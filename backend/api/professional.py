from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy.orm import Session

from jose import jwt, JWTError

from database import get_db
from models import User, Professional

from auth_utils import SECRET_KEY, ALGORITHM


router = APIRouter(
    prefix="/professional",
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


    # ========================================
    # DECODE JWT
    # ========================================

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


    # ========================================
    # FIND USER
    # ========================================

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


    # ========================================
    # CHECK ACCOUNT TYPE
    # ========================================

    if user.account_type != "professional":

        raise HTTPException(
            status_code=403,
            detail="Only professionals can access this profile"
        )


    # ========================================
    # FIND PROFESSIONAL PROFILE
    # ========================================

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


    # ========================================
    # RETURN PROFILE
    # ========================================

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