import pandas as pd
from database import SessionLocal
from models import User, Professional

def seed_data():
    db = SessionLocal()
    
    try:
        df = pd.read_csv("servx_professionals_dataset.csv")
        print(f"Loaded {len(df)} records from CSV. Inserting into database...")

        for _, row in df.iterrows():
            email = f"professional_{row['id']}@servx.com"
            
            # Check if this user already exists to prevent duplicates
            existing_user = db.query(User).filter(User.email == email).first()
            if existing_user:
                continue

            # 1. Create User entry
            new_user = User(
                name=row["name"],
                email=email,
                password="dummy_hash_for_testing",
                account_type="professional",
                location=row["location"]
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)

            # 2. Create Professional profile using valid columns from models.py
            new_prof = Professional(
                user_id=new_user.id,
                profession=row["profession"],
                skills=row["profession"], # Using profession as skills placeholder
                experience=5,             # Default mock experience value
                location=row["location"],
                price=row["price"],
                availability="Mon-Sat: 9AM - 6PM",
                rating=row["rating"] if "rating" in row else 5.0,
                completed_jobs=row["completed_jobs"] if "completed_jobs" in row else 10
            )
            db.add(new_prof)
            db.commit()

        print("Database seeding completed successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()