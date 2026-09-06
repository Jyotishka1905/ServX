import os
import pandas as pd
from database import engine

def import_csv():
    csv_filename = "servx_professionals_dataset.csv"
    if not os.path.exists(csv_filename):
        print(f"Error: {csv_filename} not found.")
        return

    df = pd.read_csv(csv_filename)
    
    # Drop columns not present in the model schema or causing ID conflicts
    cols_to_drop = ['id', 'name', 'description']
    for col in cols_to_drop:
        if col in df.columns:
            df = df.drop(columns=[col])

    # Assign a valid user_id to satisfy the constraint
    df['user_id'] = 1

    df.to_sql("professionals", con=engine, if_exists="append", index=False)
    print("Successfully appended CSV data into servx.db!")

if __name__ == "__main__":
    import_csv()