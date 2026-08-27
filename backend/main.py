from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
import models

from api.auth import router as auth_router
from api.professional import router as professional_router
from api.booking import router as booking_router  # <-- Added booking router import

# ==========================================
# CREATE DATABASE TABLES
# ==========================================
Base.metadata.create_all(bind=engine)

# ==========================================
# CREATE FASTAPI APP (Declared ONLY ONCE)
# ==========================================
app = FastAPI(
    title="ServX API",
    description="Backend API for ServX",
    version="1.0.0"
)

# ==========================================
# CORS CONFIGURATION
# ==========================================
origins = [
    "http://localhost:5173",  # Vite default frontend port
    "http://127.0.0.1:5173",
    "http://localhost:3000",  # Standard React port backup
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers (Content-Type, Authorization, etc.)
)

# ==========================================
# ROUTERS
# ==========================================
app.include_router(auth_router)
app.include_router(professional_router)
app.include_router(booking_router)  # <-- Registered booking router here

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