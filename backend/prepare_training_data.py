import pandas as pd
import os

# Create data directory if it doesn't exist
os.makedirs('data', exist_ok=True)

# Read the Excel file with predictions
df = pd.read_excel('Predicted_Unseen_Data.xlsx')

# Save to CSV
df.to_csv('data/train_data.csv', index=False)
print("Training data saved to data/train_data.csv") 