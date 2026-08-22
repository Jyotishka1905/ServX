from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

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