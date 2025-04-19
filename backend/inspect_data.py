import pandas as pd
import numpy as np

# Read the Excel file
df = pd.read_excel('Predicted_Unseen_Data.xlsx')

# Print basic information
print("\nData shape:", df.shape)
print("\nColumns:", df.columns.tolist())
print("\nFirst few rows:")
print(df.head())
print("\nData types:")
print(df.dtypes)

# Print target variable distribution
print("\nTarget variable distribution:")
print(df['Target_variable'].value_counts(normalize=True).round(4) * 100) 