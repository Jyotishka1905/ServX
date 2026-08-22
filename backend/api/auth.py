from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import User, Professional

from auth_utils import (
    hash_password,
    verify_password,
    create_access_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ========================================
# REGISTER REQUEST
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


# ========================================
# LOGIN REQUEST
# ========================================

class LoginRequest(BaseModel):

    email: str

    password: str


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
    hashed_password = hash_password(
        data.password
    )


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


    # ========================================
    # PROFESSIONAL
    # ========================================

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