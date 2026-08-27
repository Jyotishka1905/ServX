from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from jose import jwt, JWTError

from database import get_db
from models import User, Professional

from auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ========================================
# DIRECT CURRENT USER DEPENDENCY
# ========================================

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not authorization or not authorization.startswith("Bearer "):
        raise credentials_exception
    
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except (JWTError, IndexError):
        raise credentials_exception
        
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
        
    return user


# ========================================
# REQUEST SCHEMAS
# ========================================

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    accountType: str
    location: str
    profession: str | None = None
    skills: str | None = None
    experience: int | None = None
    price: float | None = None
    availability: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str


class ProfileUpdateRequest(BaseModel):
    name: str
    location: str


# ========================================
# REGISTER
# ========================================

@router.post("/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    # Check existing email
    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = hash_password(data.password)

    # Create user
    user = User(
        name=data.name,
        email=data.email,
        password=hashed_password,
        account_type=data.accountType,
        location=data.location
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # PROFESSIONAL
    if data.accountType == "professional":
        if not data.profession:
            raise HTTPException(
                status_code=400,
                detail="Profession is required"
            )

        professional = Professional(
            user_id=user.id,
            profession=data.profession,
            skills=data.skills or "",
            experience=data.experience or 0,
            location=data.location,
            price=data.price or 0,
            availability=data.availability or "",
            rating=0.0,
            completed_jobs=0
        )

        db.add(professional)
        db.commit()
        db.refresh(professional)

    return {
        "message": "Registration successful",
        "user_id": user.id,
        "account_type": user.account_type
    }


# ========================================
# LOGIN
# ========================================

@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    # User doesn't exist
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Check password
    password_valid = verify_password(
        data.password,
        user.password
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Create JWT
    access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "account_type": user.account_type
    })

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "account_type": user.account_type,
            "location": user.location
        }
    }


# ========================================
# UPDATE PROFILE
# ========================================

@router.put("/profile/update")
def update_profile(
    data: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.name = data.name.strip()
    current_user.location = data.location.strip()

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "account_type": current_user.account_type,
            "location": current_user.location
        }
    }