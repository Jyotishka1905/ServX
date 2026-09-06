import pandas as pd
from faker import Faker
import random

fake = Faker()

professions = ["Electrician", "Plumber", "AC Technician", "Carpenter", "Teacher", "Painter", "Cleaner"]
locations = ["Asansol", "Durgapur", "Kolkata", "Raniganj"]

data = []
for i in range(200):
    profession = random.choice(professions)
    data.append({
        "id": i + 1,
        "name": fake.name(),
        "profession": profession,
        "location": random.choice(locations),
        "price": random.randint(300, 2000),
        "rating": round(random.uniform(3.5, 5.0), 1),
        "completed_jobs": random.randint(5, 120),
        "description": f"Experienced {profession} offering professional and reliable services."
    })

df = pd.DataFrame(data)
df.to_csv("servx_professionals_dataset.csv", index=False)
print("Synthetic dataset generated successfully!")