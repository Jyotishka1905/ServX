from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    password = Column(String, nullable=False)

    account_type = Column(
        String,
        nullable=False
    )

    location = Column(
        String,
        nullable=False
    )

    professional = relationship(
        "Professional",
        back_populates="user",
        uselist=False
    )


class Professional(Base):

    __tablename__ = "professionals"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    name = Column(
        String,
        nullable=True
    )

    profession = Column(
        String,
        nullable=False
    )

    skills = Column(
        String,
        default=""
    )

    experience = Column(
        Integer,
        default=0
    )

    location = Column(
        String,
        nullable=False
    )

    price = Column(
        Float,
        default=0
    )

    availability = Column(
        String,
        default=""
    )

    rating = Column(
        Float,
        default=0.0
    )

    completed_jobs = Column(
        Integer,
        default=0
    )

    user = relationship(
        "User",
        back_populates="professional"
    )


class Booking(Base):

    __tablename__ = "bookings"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    customer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    professional_id = Column(
        Integer,
        ForeignKey("professionals.id"),
        nullable=False
    )

    service_date = Column(
        String,
        nullable=False
    )

    notes = Column(
        String,
        nullable=True
    )

    status = Column(
        String,
        default="Pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )