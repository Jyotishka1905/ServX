from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from typing import Optional, List

from database import get_db
from models import User, Professional
from auth_utils import SECRET_KEY, ALGORITHM
from ml_engine import compute_recommendation_scores

router = APIRouter(
    prefix="/professionals",
    tags=["Professional"]
)

security = HTTPBearer()


# ========================================
# GET CURRENT PROFESSIONAL
# ========================================

@router.get("/profile")
def get_professional_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user = (
        db.query(User)
        .filter(User.id == int(user_id))
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.account_type != "professional":
        raise HTTPException(
            status_code=403,
            detail="Only professionals can access this profile"
        )

    professional = (
        db.query(Professional)
        .filter(
            Professional.user_id == user.id
        )
        .first()
    )

    if not professional:
        raise HTTPException(
            status_code=404,
            detail="Professional profile not found"
        )

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "location": user.location,
            "account_type": user.account_type
        },
        "professional": {
            "id": professional.id,
            "profession": professional.profession,
            "skills": professional.skills,
            "experience": professional.experience,
            "location": professional.location,
            "price": professional.price,
            "availability": professional.availability,
            "rating": professional.rating,
            "completed_jobs": professional.completed_jobs
        }
    }


# ========================================
# SEARCH PROFESSIONALS (Public Route)
# ========================================

@router.get("/search")
def search_professionals(
    profession: Optional[str] = Query(None, description="Filter by category (e.g., Electrician, Driver)"),
    location: Optional[str] = Query(None, description="Filter by city/location"),
    limit: int = Query(10, description="Number of results to return"),
    offset: int = Query(0, description="Offset for pagination"),
    db: Session = Depends(get_db)
):
    query = db.query(Professional, User).join(User, Professional.user_id == User.id)

    if profession:
        clean_profession = profession.strip()
        query = query.filter(Professional.profession.ilike(f"%{clean_profession}%"))
    if location and location.strip():
        clean_location = location.strip()
        query = query.filter(Professional.location.ilike(f"%{clean_location}%"))

    results = query.offset(offset).limit(limit).all()

    # Fallback safety net for search if empty on first page load
    if not results and offset == 0:
        results = db.query(Professional, User).join(User, Professional.user_id == User.id).limit(limit).all()

    professionals_list = []
    for prof, user in results:
        professionals_list.append({
            "id": prof.id,
            "user_id": user.id,
            "name": user.name,
            "profession": prof.profession,
            "location": prof.location,
            "skills": prof.skills,
            "experience": prof.experience,
            "price": prof.price,
            "availability": prof.availability,
            "rating": prof.rating,
            "completed_jobs": prof.completed_jobs,
            "match_score": 100.0
        })

    return {"professionals": professionals_list}


# ========================================
# RECOMMENDATIONS ROUTE
# ========================================

@router.get("/recommendations")
def get_recommended_professionals(
    profession: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    max_price: Optional[float] = Query(None),
    limit: int = Query(10, description="Number of results to return"),
    offset: int = Query(0, description="Offset for pagination"),
    db: Session = Depends(get_db)
):
    query = db.query(Professional, User).join(User, Professional.user_id == User.id)

    if profession:
        clean_profession = profession.strip()
        query = query.filter(Professional.profession.ilike(f"%{clean_profession}%"))
    
    if location and location.strip():
        clean_location = location.strip()
        query = query.filter(Professional.location.ilike(f"%{clean_location}%"))

    results = query.offset(offset).limit(limit).all()

    # Fail-safe fallback: If strict location/category match returns nothing on first load, try matching just the profession category
    if not results and offset == 0:
        fallback_query = db.query(Professional, User).join(User, Professional.user_id == User.id)
        if profession:
            fallback_query = fallback_query.filter(Professional.profession.ilike(f"%{profession.strip()}%"))
        results = fallback_query.limit(limit).all()

    # Absolute fallback if still empty
    if not results and offset == 0:
        results = db.query(Professional, User).join(User, Professional.user_id == User.id).limit(limit).all()

    professionals_list = []
    for prof, user in results:
        professionals_list.append({
            "id": prof.id,
            "user_id": user.id,
            "name": user.name,
            "profession": prof.profession,
            "location": prof.location,
            "skills": prof.skills,
            "experience": prof.experience,
            "price": prof.price,
            "availability": prof.availability,
            "rating": prof.rating,
            "completed_jobs": prof.completed_jobs,
            "match_score": 95.0
        })

    # Safely handle ML engine scoring with fallback if it returns empty or fails
    try:
        customer_prefs = {"location": location or "", "max_price": max_price}
        ranked_professionals = compute_recommendation_scores(professionals_list, customer_prefs)
        if not ranked_professionals and professionals_list:
            ranked_professionals = professionals_list
    except Exception:
        ranked_professionals = professionals_list

    return {"recommended_professionals": ranked_professionals}