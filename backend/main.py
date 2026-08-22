from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
import models

from api.auth import router as auth_router

# Import professional router
from api.professional import router as professional_router


# ==========================================
# CREATE DATABASE TABLES
# ==========================================

Base.metadata.create_all(bind=engine)


# ==========================================
# CREATE FASTAPI APP
# ==========================================

app = FastAPI(
    title="ServX API",
    description="Backend API for ServX",
    version="1.0.0"
)


# ==========================================
# CORS CONFIGURATION
# ==========================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ==========================================
# ROUTERS
# ==========================================

app.include_router(auth_router)

app.include_router(professional_router)


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():
    return {
        "message": "Welcome to ServX API",
        "status": "running"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }