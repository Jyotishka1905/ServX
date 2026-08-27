import os
from database import SessionLocal, engine, Base
import models

def seed_database():
    # Automatically ensure tables exist in the correct database file path
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Comprehensive multi-record mock data covering all 12 categories for ServX
    mock_professionals = [
        # Electricians
        {"name": "Amit Sharma", "email": "amit.electrician1@servx.com", "profession": "Electrician", "skills": "Wiring, Circuit Repair, Inverter Setup", "experience": 5, "location": "Asansol", "price": 450, "rating": 4.8, "completed_jobs": 120},
        {"name": "Ramesh Verma", "email": "ramesh.electrician2@servx.com", "profession": "Electrician", "skills": "Panel Board, Appliance Installation", "experience": 8, "location": "Asansol", "price": 600, "rating": 4.6, "completed_jobs": 95},
        {"name": "Pradip Roy", "email": "pradip.electrician3@servx.com", "profession": "Electrician", "skills": "Home Wiring, Fan & Light Fitting", "experience": 4, "location": "Asansol", "price": 400, "rating": 4.5, "completed_jobs": 60},
        {"name": "Subrata Das", "email": "subrata.electrician4@servx.com", "profession": "Electrician", "skills": "Industrial Electrical, Heavy Machinery Setup", "experience": 12, "location": "Asansol", "price": 900, "rating": 4.9, "completed_jobs": 240},

        # Teachers
        {"name": "Priya Sen", "email": "priya.teacher1@servx.com", "profession": "Teacher", "skills": "Mathematics, Physics, High School Tutoring", "experience": 6, "location": "Asansol", "price": 500, "rating": 4.9, "completed_jobs": 150},
        {"name": "Debabrata Mukherjee", "email": "debabrata.teacher2@servx.com", "profession": "Teacher", "skills": "Chemistry, Biology, Science Foundation", "experience": 10, "location": "Asansol", "price": 700, "rating": 4.8, "completed_jobs": 210},
        {"name": "Sampa Ghosh", "email": "sampa.teacher3@servx.com", "profession": "Teacher", "skills": "Primary Education, English, Bengali", "experience": 7, "location": "Asansol", "price": 450, "rating": 4.7, "completed_jobs": 110},

        # Drivers
        {"name": "Vikram Das", "email": "vikram.driver1@servx.com", "profession": "Driver", "skills": "Commercial Driving, Outstation Trips, Manual/Auto", "experience": 10, "location": "Asansol", "price": 800, "rating": 4.9, "completed_jobs": 310},
        {"name": "Sheikh Rahim", "email": "rahim.driver2@servx.com", "profession": "Driver", "skills": "Personal Chauffeur, City Navigation, Night Trips", "experience": 6, "location": "Asansol", "price": 600, "rating": 4.5, "completed_jobs": 140},
        {"name": "Bimalendu Chatterjee", "email": "bimal.driver3@servx.com", "profession": "Driver", "skills": "SUV Expert, Long Distance Tours", "experience": 15, "location": "Asansol", "price": 1000, "rating": 5.0, "completed_jobs": 420},

        # Plumbers
        {"name": "Sanjay Malik", "email": "sanjay.plumber1@servx.com", "profession": "Plumber", "skills": "Pipe Leakage, Tap Fitting, Bathroom Renovation", "experience": 7, "location": "Asansol", "price": 400, "rating": 4.5, "completed_jobs": 110},
        {"name": "Gobindo Mondal", "email": "gobindo.plumber2@servx.com", "profession": "Plumber", "skills": "Water Motor Repair, Tank Cleaning, Drainage", "experience": 9, "location": "Asansol", "price": 500, "rating": 4.7, "completed_jobs": 180},
        {"name": "Kunal Sen", "email": "kunal.plumber3@servx.com", "profession": "Plumber", "skills": "Modern Sanitary Fittings, Leak Detection", "experience": 5, "location": "Asansol", "price": 450, "rating": 4.6, "completed_jobs": 85},

        # Doctors
        {"name": "Dr. Subrata Mukherjee", "email": "dr.subrata1@servx.com", "profession": "Doctor", "skills": "General Physician, Home Visits, Consultation", "experience": 12, "location": "Asansol", "price": 1000, "rating": 5.0, "completed_jobs": 500},
        {"name": "Dr. Sneha Chatterjee", "email": "dr.sneha2@servx.com", "profession": "Doctor", "skills": "Pediatrician, Child Healthcare, Vaccination Advice", "experience": 8, "location": "Asansol", "price": 900, "rating": 4.9, "completed_jobs": 340},

        # Maids
        {"name": "Sunita Devi", "email": "sunita.maid1@servx.com", "profession": "Maid", "skills": "Deep Cleaning, Cooking, Housekeeping", "experience": 5, "location": "Asansol", "price": 300, "rating": 4.6, "completed_jobs": 90},
        {"name": "Geeta Karmakar", "email": "geeta.maid2@servx.com", "profession": "Maid", "skills": "Utensils, Dusting, General House Help", "experience": 4, "location": "Asansol", "price": 250, "rating": 4.4, "completed_jobs": 70},

        # Carpenters
        {"name": "Manoj Karmakar", "email": "manoj.carpenter1@servx.com", "profession": "Carpenter", "skills": "Custom Furniture, Door Repair, Modular Kitchen", "experience": 9, "location": "Asansol", "price": 700, "rating": 4.8, "completed_jobs": 140},
        {"name": "Ashok Sutradhar", "email": "ashok.carpenter2@servx.com", "profession": "Carpenter", "skills": "Bed Assembly, Wardrobe Design, Wood Polishing", "experience": 11, "location": "Asansol", "price": 750, "rating": 4.7, "completed_jobs": 190},

        # IT Experts
        {"name": "Rahul Ghosh", "email": "rahul.it1@servx.com", "profession": "IT Expert", "skills": "Laptop Repair, OS Installation, Network Troubleshooting", "experience": 4, "location": "Asansol", "price": 600, "rating": 4.7, "completed_jobs": 75},
        {"name": "Sayan Banerjee", "email": "sayan.it2@servx.com", "profession": "IT Expert", "skills": "Data Recovery, Printer Setup, Wi-Fi Configuration", "experience": 6, "location": "Asansol", "price": 650, "rating": 4.9, "completed_jobs": 130},

        # Painters
        {"name": "Alok Painter", "email": "alok.painter1@servx.com", "profession": "Painter", "skills": "Wall Painting, Waterproofing, Texture Design", "experience": 6, "location": "Asansol", "price": 550, "rating": 4.4, "completed_jobs": 60},
        {"name": "Kartik Roy", "email": "kartik.painter2@servx.com", "profession": "Painter", "skills": "Interior/Exterior Painting, Putty, Primer", "experience": 8, "location": "Asansol", "price": 600, "rating": 4.6, "completed_jobs": 115},

        # AC Repair
        {"name": "Biplab AC", "email": "biplab.ac1@servx.com", "profession": "AC Repair", "skills": "AC Servicing, Gas Filling, Installation", "experience": 8, "location": "Asansol", "price": 650, "rating": 4.8, "completed_jobs": 200},
        {"name": "Tanmoy Cooling", "email": "tanmoy.ac2@servx.com", "profession": "AC Repair", "skills": "Inverter AC Repair, PCB Fixing, Duct Cleaning", "experience": 5, "location": "Asansol", "price": 600, "rating": 4.7, "completed_jobs": 125},

        # Technicians
        {"name": "Suman Tech", "email": "suman.tech1@servx.com", "profession": "Technician", "skills": "Refrigerator, Washing Machine, Microwave Repair", "experience": 7, "location": "Asansol", "price": 500, "rating": 4.6, "completed_jobs": 160},
        {"name": "Abhijit Appliance", "email": "abhijit.tech2@servx.com", "profession": "Technician", "skills": "LED TV Repair, Chimney Servicing", "experience": 6, "location": "Asansol", "price": 550, "rating": 4.7, "completed_jobs": 140},

        # Tutors
        {"name": "Ananya Roy", "email": "ananya.tutor1@servx.com", "profession": "Tutor", "skills": "English Literature, Grammar, IELTS", "experience": 4, "location": "Asansol", "price": 400, "rating": 4.7, "completed_jobs": 80},
        {"name": "Rounak Tutor", "email": "rounak.tutor2@servx.com", "profession": "Tutor", "skills": "Coding Basics, Computer Science, Mathematics", "experience": 5, "location": "Asansol", "price": 500, "rating": 4.8, "completed_jobs": 95}
    ]

    print("Seeding database with expanded multi-category preview data...")

    added_count = 0
    for data in mock_professionals:
        existing_user = db.query(models.User).filter(models.User.email == data["email"]).first()
        if existing_user:
            continue

        user = models.User(
            name=data["name"],
            email=data["email"],
            password="hashed_password_placeholder",
            account_type="professional",
            location=data["location"]
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        prof = models.Professional(
            user_id=user.id,
            profession=data["profession"],
            skills=data["skills"],
            experience=data["experience"],
            location=data["location"],
            price=data["price"],
            availability="Available",
            rating=data["rating"],
            completed_jobs=data["completed_jobs"]
        )
        db.add(prof)
        db.commit()
        added_count += 1

    print(f"Successfully seeded {added_count} new professional profiles into servx.db!")
    db.close()

if __name__ == "__main__":
    seed_database()
    import os
from database import SessionLocal, engine, Base
import models

def seed_database():
    # Automatically ensure tables exist in the correct database file path
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Comprehensive multi-record mock data with diverse locations for ServX
    mock_professionals = [
        # Electricians
        {"name": "Amit Sharma", "email": "amit.electrician1@servx.com", "profession": "Electrician", "skills": "Wiring, Circuit Repair, Inverter Setup", "experience": 5, "location": "Asansol", "price": 450, "rating": 4.8, "completed_jobs": 120},
        {"name": "Ramesh Verma", "email": "ramesh.electrician2@servx.com", "profession": "Electrician", "skills": "Panel Board, Appliance Installation", "experience": 8, "location": "Kolkata", "price": 600, "rating": 4.6, "completed_jobs": 95},
        {"name": "Pradip Roy", "email": "pradip.electrician3@servx.com", "profession": "Electrician", "skills": "Home Wiring, Fan & Light Fitting", "experience": 4, "location": "Durgapur", "price": 400, "rating": 4.5, "completed_jobs": 60},
        {"name": "Subrata Das", "email": "subrata.electrician4@servx.com", "profession": "Electrician", "skills": "Industrial Electrical, Heavy Machinery Setup", "experience": 12, "location": "Burdwan", "price": 900, "rating": 4.9, "completed_jobs": 240},

        # Teachers
        {"name": "Priya Sen", "email": "priya.teacher1@servx.com", "profession": "Teacher", "skills": "Mathematics, Physics, High School Tutoring", "experience": 6, "location": "Asansol", "price": 500, "rating": 4.9, "completed_jobs": 150},
        {"name": "Debabrata Mukherjee", "email": "debabrata.teacher2@servx.com", "profession": "Teacher", "skills": "Chemistry, Biology, Science Foundation", "experience": 10, "location": "Kolkata", "price": 700, "rating": 4.8, "completed_jobs": 210},
        {"name": "Sampa Ghosh", "email": "sampa.teacher3@servx.com", "profession": "Teacher", "skills": "Primary Education, English, Bengali", "experience": 7, "location": "Dhanbad", "price": 450, "rating": 4.7, "completed_jobs": 110},

        # Drivers
        {"name": "Vikram Das", "email": "vikram.driver1@servx.com", "profession": "Driver", "skills": "Commercial Driving, Outstation Trips, Manual/Auto", "experience": 10, "location": "Asansol", "price": 800, "rating": 4.9, "completed_jobs": 310},
        {"name": "Sheikh Rahim", "email": "rahim.driver2@servx.com", "profession": "Driver", "skills": "Personal Chauffeur, City Navigation, Night Trips", "experience": 6, "location": "Kolkata", "price": 600, "rating": 4.5, "completed_jobs": 140},
        {"name": "Bimalendu Chatterjee", "email": "bimal.driver3@servx.com", "profession": "Driver", "skills": "SUV Expert, Long Distance Tours", "experience": 15, "location": "Durgapur", "price": 1000, "rating": 5.0, "completed_jobs": 420},

        # Plumbers
        {"name": "Sanjay Malik", "email": "sanjay.plumber1@servx.com", "profession": "Plumber", "skills": "Pipe Leakage, Tap Fitting, Bathroom Renovation", "experience": 7, "location": "Asansol", "price": 400, "rating": 4.5, "completed_jobs": 110},
        {"name": "Gobindo Mondal", "email": "gobindo.plumber2@servx.com", "profession": "Plumber", "skills": "Water Motor Repair, Tank Cleaning, Drainage", "experience": 9, "location": "Patna", "price": 500, "rating": 4.7, "completed_jobs": 180},
        {"name": "Kunal Sen", "email": "kunal.plumber3@servx.com", "profession": "Plumber", "skills": "Modern Sanitary Fittings, Leak Detection", "experience": 5, "location": "Kolkata", "price": 450, "rating": 4.6, "completed_jobs": 85},

        # Doctors
        {"name": "Dr. Subrata Mukherjee", "email": "dr.subrata1@servx.com", "profession": "Doctor", "skills": "General Physician, Home Visits, Consultation", "experience": 12, "location": "Asansol", "price": 1000, "rating": 5.0, "completed_jobs": 500},
        {"name": "Dr. Sneha Chatterjee", "email": "dr.sneha2@servx.com", "profession": "Doctor", "skills": "Pediatrician, Child Healthcare, Vaccination Advice", "experience": 8, "location": "Kolkata", "price": 900, "rating": 4.9, "completed_jobs": 340},

        # Maids
        {"name": "Sunita Devi", "email": "sunita.maid1@servx.com", "profession": "Maid", "skills": "Deep Cleaning, Cooking, Housekeeping", "experience": 5, "location": "Asansol", "price": 300, "rating": 4.6, "completed_jobs": 90},
        {"name": "Geeta Karmakar", "email": "geeta.maid2@servx.com", "profession": "Maid", "skills": "Utensils, Dusting, General House Help", "experience": 4, "location": "Durgapur", "price": 250, "rating": 4.4, "completed_jobs": 70},

        # Carpenters
        {"name": "Manoj Karmakar", "email": "manoj.carpenter1@servx.com", "profession": "Carpenter", "skills": "Custom Furniture, Door Repair, Modular Kitchen", "experience": 9, "location": "Asansol", "price": 700, "rating": 4.8, "completed_jobs": 140},
        {"name": "Ashok Sutradhar", "email": "ashok.carpenter2@servx.com", "profession": "Carpenter", "skills": "Bed Assembly, Wardrobe Design, Wood Polishing", "experience": 11, "location": "Kolkata", "price": 750, "rating": 4.7, "completed_jobs": 190},

        # IT Experts
        {"name": "Rahul Ghosh", "email": "rahul.it1@servx.com", "profession": "IT Expert", "skills": "Laptop Repair, OS Installation, Network Troubleshooting", "experience": 4, "location": "Asansol", "price": 600, "rating": 4.7, "completed_jobs": 75},
        {"name": "Sayan Banerjee", "email": "sayan.it2@servx.com", "profession": "IT Expert", "skills": "Data Recovery, Printer Setup, Wi-Fi Configuration", "experience": 6, "location": "Kolkata", "price": 650, "rating": 4.9, "completed_jobs": 130},

        # Painters
        {"name": "Alok Painter", "email": "alok.painter1@servx.com", "profession": "Painter", "skills": "Wall Painting, Waterproofing, Texture Design", "experience": 6, "location": "Asansol", "price": 550, "rating": 4.4, "completed_jobs": 60},
        {"name": "Kartik Roy", "email": "kartik.painter2@servx.com", "profession": "Painter", "skills": "Interior/Exterior Painting, Putty, Primer", "experience": 8, "location": "Dhanbad", "price": 600, "rating": 4.6, "completed_jobs": 115},

        # AC Repair
        {"name": "Biplab AC", "email": "biplab.ac1@servx.com", "profession": "AC Repair", "skills": "AC Servicing, Gas Filling, Installation", "experience": 8, "location": "Asansol", "price": 650, "rating": 4.8, "completed_jobs": 200},
        {"name": "Tanmoy Cooling", "email": "tanmoy.ac2@servx.com", "profession": "AC Repair", "skills": "Inverter AC Repair, PCB Fixing, Duct Cleaning", "experience": 5, "location": "Kolkata", "price": 600, "rating": 4.7, "completed_jobs": 125},

        # Technicians
        {"name": "Suman Tech", "email": "suman.tech1@servx.com", "profession": "Technician", "skills": "Refrigerator, Washing Machine, Microwave Repair", "experience": 7, "location": "Asansol", "price": 500, "rating": 4.6, "completed_jobs": 160},
        {"name": "Abhijit Appliance", "email": "abhijit.tech2@servx.com", "profession": "Technician", "skills": "LED TV Repair, Chimney Servicing", "experience": 6, "location": "Durgapur", "price": 550, "rating": 4.7, "completed_jobs": 140},

        # Tutors
        {"name": "Ananya Roy", "email": "ananya.tutor1@servx.com", "profession": "Tutor", "skills": "English Literature, Grammar, IELTS", "experience": 4, "location": "Asansol", "price": 400, "rating": 4.7, "completed_jobs": 80},
        {"name": "Rounak Tutor", "email": "rounak.tutor2@servx.com", "profession": "Tutor", "skills": "Coding Basics, Computer Science, Mathematics", "experience": 5, "location": "Kolkata", "price": 500, "rating": 4.8, "completed_jobs": 95}
    ]

    print("Seeding database with multi-location preview data...")

    added_count = 0
    for data in mock_professionals:
        existing_user = db.query(models.User).filter(models.User.email == data["email"]).first()
        if existing_user:
            continue

        user = models.User(
            name=data["name"],
            email=data["email"],
            password="hashed_password_placeholder",
            account_type="professional",
            location=data["location"]
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        prof = models.Professional(
            user_id=user.id,
            profession=data["profession"],
            skills=data["skills"],
            experience=data["experience"],
            location=data["location"],
            price=data["price"],
            availability="Available",
            rating=data["rating"],
            completed_jobs=data["completed_jobs"]
        )
        db.add(prof)
        db.commit()
        added_count += 1

    print(f"Successfully seeded {added_count} new multi-location professional profiles into servx.db!")
    db.close()

if __name__ == "__main__":
    seed_database()