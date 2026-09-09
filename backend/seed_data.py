import pandas as pd
from database import SessionLocal, engine
from models import Base, User, Professional

def seed_data():
    # Ensure all tables are created first
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    first_names = [
        "Amit", "Priya", "Rajesh", "Ananya", "Vikram", "Sneha", "Rahul", "Pooja", 
        "Subrata", "Megha", "Arindam", "Ritu", "Rohit", "Neha", "Arjun", "Kavita", 
        "Siddharth", "Ankita", "Manish", "Swati", "Suman", "Tanmoy", "Payel", "Debanjan"
    ]
    last_names = [
        "Kumar", "Sen", "Ghosh", "Roy", "Malhotra", "Mukherjee", "Verma", "Sharma", 
        "Chatterjee", "Das", "Banerjee", "Chakraborty", "Patel", "Gupta", "Mishra", 
        "Joshi", "Bhattacharya", "Nath", "Sarkar", "Dutta", "Sanyal", "Kundu", "Bose"
    ]
    
    try:
        df = pd.read_csv("servx_professionals_dataset.csv")
        print(f"Loaded {len(df)} records from CSV. Inserting into database...")

        for index, row in df.iterrows():
            row_dict = row.to_dict()
            row_id = int(row_dict.get('id', index + 1))
            email = f"professional_{row_id}@servx.com"
            
            f_name = first_names[row_id % len(first_names)]
            l_name = last_names[(row_id * 7) % len(last_names)]
            generated_name = f"{f_name} {l_name}"

            existing_user = db.query(User).filter(User.email == email).first()
            if existing_user:
                existing_user.name = generated_name
                db.commit()
                
                existing_prof = db.query(Professional).filter(Professional.user_id == existing_user.id).first()
                if not existing_prof:
                    new_prof = Professional(
                        user_id=existing_user.id,
                        name=generated_name,
                        profession=str(row_dict.get("profession", "General")),
                        skills=str(row_dict.get("skills", row_dict.get("profession", ""))),
                        experience=int(row_dict.get("experience", 5)) if pd.notna(row_dict.get("experience")) else 5,
                        location=str(row_dict.get("location", "Unknown")),
                        price=float(row_dict.get("price", 500)) if pd.notna(row_dict.get("price")) else 500.0,
                        availability=str(row_dict.get("availability", "Mon-Sat: 9AM - 6PM")),
                        rating=float(row_dict.get("rating", 5.0)) if pd.notna(row_dict.get("rating")) else 5.0,
                        completed_jobs=int(row_dict.get("completed_jobs", 10)) if pd.notna(row_dict.get("completed_jobs")) else 10
                    )
                    db.add(new_prof)
                    db.commit()
                continue

            new_user = User(
                name=generated_name,
                email=email,
                password="dummy_hash_for_testing",
                account_type="professional",
                location=str(row_dict.get("location", "Unknown"))
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)

            new_prof = Professional(
                user_id=new_user.id,
                name=generated_name,
                profession=str(row_dict.get("profession", "General")),
                skills=str(row_dict.get("skills", row_dict.get("profession", ""))),
                experience=int(row_dict.get("experience", 5)) if pd.notna(row_dict.get("experience")) else 5,
                location=str(row_dict.get("location", "Unknown")),
                price=float(row_dict.get("price", 500)) if pd.notna(row_dict.get("price")) else 500.0,
                availability=str(row_dict.get("availability", "Mon-Sat: 9AM - 6PM")),
                rating=float(row_dict.get("rating", 5.0)) if pd.notna(row_dict.get("rating")) else 5.0,
                completed_jobs=int(row_dict.get("completed_jobs", 10)) if pd.notna(row_dict.get("completed_jobs")) else 10
            )
            db.add(new_prof)
            db.commit()

        print("Database seeded with unique names successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()