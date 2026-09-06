from database import SessionLocal
from models import User, Professional

db = SessionLocal()
user_count = db.query(User).count()
prof_count = db.query(Professional).count()
print(f"Total Users in DB: {user_count}")
print(f"Total Professionals in DB: {prof_count}")
db.close()