from fastapi import APIRouter, Depends, HTTPException, Header, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from jose import jwt, JWTError

from database import get_db
from models import User, Professional, Booking
from auth_utils import SECRET_KEY, ALGORITHM
from email_utils import send_email_notification

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)

# Pydantic schema for creating a booking request
class BookingCreate(BaseModel):
    professional_id: int
    service_date: str
    notes: Optional[str] = None

# Unified Helper to extract current user from JWT token cleanly via headers
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
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except (JWTError, IndexError):
        raise credentials_exception
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# 1. Customer creates a booking request
@router.post("/")
def create_booking(
    booking_data: BookingCreate, 
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if current_user.account_type != "customer":
        raise HTTPException(status_code=403, detail="Only customers can book services")
    
    # Verify professional exists
    prof = db.query(Professional).filter(Professional.id == booking_data.professional_id).first()
    if not prof:
        raise HTTPException(status_code=404, detail="Professional not found")

    prof_user = db.query(User).filter(User.id == prof.user_id).first()

    new_booking = Booking(
        customer_id=current_user.id,
        professional_id=booking_data.professional_id,
        service_date=booking_data.service_date,
        notes=booking_data.notes,
        status="Pending"
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    # Trigger email notifications in the background
    if prof_user and prof_user.email:
        background_tasks.add_task(
            send_email_notification,
            recipient_email=prof_user.email,
            subject="New Service Booking Request!",
            body_text=f"Hi {prof_user.name},\n\nYou have a new booking request from {current_user.name} for {booking_data.service_date}.\nNotes: {booking_data.notes}\n\nLog in to your ServX dashboard to Accept or Reject it."
        )

    if current_user.email:
        background_tasks.add_task(
            send_email_notification,
            recipient_email=current_user.email,
            subject="Booking Request Placed Successfully",
            body_text=f"Hi {current_user.name},\n\nYour booking request with {prof_user.name if prof_user else 'the professional'} for {booking_data.service_date} has been placed and is currently Pending.\n\nThank you for using ServX!"
        )

    return {"message": "Booking request sent successfully!", "booking_id": new_booking.id}

# 2. Customer views their own bookings
@router.get("/customer")
def get_customer_bookings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.account_type != "customer":
        raise HTTPException(status_code=403, detail="Only customers can view their bookings")

    bookings = db.query(Booking).filter(Booking.customer_id == current_user.id).all()
    
    result = []
    for b in bookings:
        prof = db.query(Professional).filter(Professional.id == b.professional_id).first()
        prof_user = db.query(User).filter(User.id == prof.user_id).first() if prof else None
        
        result.append({
            "id": b.id,
            "professional_name": prof_user.name if prof_user else "Unknown Professional",
            "profession": prof.profession if prof else "Service",
            "location": prof.location if prof else "",
            "price": prof.price if prof else 0,
            "service_date": b.service_date,
            "notes": b.notes,
            "status": b.status,
            "created_at": b.created_at
        })

    return {"bookings": result}

# 3. Professional views incoming booking requests
@router.get("/professional/requests")
def get_professional_bookings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.account_type != "professional":
        raise HTTPException(status_code=403, detail="Only professionals can view incoming requests")
    
    prof = db.query(Professional).filter(Professional.user_id == current_user.id).first()
    if not prof:
        raise HTTPException(status_code=404, detail="Professional profile not found")

    bookings = db.query(Booking).filter(Booking.professional_id == prof.id).all()
    
    result = []
    for b in bookings:
        customer = db.query(User).filter(User.id == b.customer_id).first()
        result.append({
            "id": b.id,
            "customer_name": customer.name if customer else "Unknown",
            "customer_email": customer.email if customer else "",
            "service_date": b.service_date,
            "notes": b.notes,
            "status": b.status,
            "created_at": b.created_at
        })

    return {"bookings": result}

# 4. Professional updates booking status (Accept / Reject / Complete)
@router.put("/{booking_id}/status")
def update_booking_status(
    booking_id: int, 
    status: str, 
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if current_user.account_type != "professional":
        raise HTTPException(status_code=403, detail="Unauthorized")

    prof = db.query(Professional).filter(Professional.user_id == current_user.id).first()
    if not prof:
        raise HTTPException(status_code=404, detail="Professional profile not found")

    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.professional_id != prof.id:
        raise HTTPException(status_code=403, detail="Unauthorized to modify this booking")

    if status not in ["Accepted", "Rejected", "Completed"]:
        raise HTTPException(status_code=400, detail="Invalid status update value")

    booking.status = status
    db.commit()

    # Notify customer of status change in the background
    customer = db.query(User).filter(User.id == booking.customer_id).first()
    if customer and customer.email:
        background_tasks.add_task(
            send_email_notification,
            recipient_email=customer.email,
            subject=f"Your Booking Has Been {status}",
            body_text=f"Hi {customer.name},\n\nThe professional has updated your booking status to: {status}.\n\nLog in to ServX to view details."
        )

    return {"message": f"Booking status updated to {status}"}