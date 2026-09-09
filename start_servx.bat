@echo off
echo ========================================
echo Starting ServX Backend (FastAPI)...
echo ========================================
cd backend
call .venv\Scripts\activate
start cmd /k "python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload"

cd ..

echo ========================================
echo Starting ServX Frontend (Vite/React)...
echo ========================================
cd frontend
start cmd /k "npm run dev"

echo ========================================
echo ServX is starting up successfully!
echo ========================================
pause