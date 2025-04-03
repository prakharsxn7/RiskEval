from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
import os
import shutil
from typing import Dict, List
import json

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and label encoder
model = None
label_encoder = None

def load_model():
    global model, label_encoder
    try:
        # Load the trained model
        model = xgb.XGBClassifier()
        model.load_model('models/xgb_model.json')
        
        # Initialize label encoder
        label_encoder = LabelEncoder()
        label_encoder.classes_ = np.load('models/label_encoder_classes.npy', allow_pickle=True)
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to load ML model")

@app.on_event("startup")
async def startup_event():
    load_model()

@app.post("/process-file")
async def process_file(file: UploadFile = File(...)) -> Dict:
    try:
        # Save the uploaded file
        file_path = "Unseen_Dataset.xlsx"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Read the dataset
        df_unseen = pd.read_excel(file_path)
        
        # Store PROSPECTID if it exists
        prospect_ids = df_unseen['PROSPECTID'].tolist() if 'PROSPECTID' in df_unseen.columns else None
        
        # Remove PROSPECTID if it exists
        if 'PROSPECTID' in df_unseen.columns:
            df_unseen = df_unseen.drop('PROSPECTID', axis=1)
        
        # Preprocess the data
        # Map education levels to numeric values
        education_mapping = {
            'SSC': 1, '12TH': 2, 'GRADUATE': 3, 
            'UNDER GRADUATE': 3, 'POST-GRADUATE': 4, 
            'OTHERS': 1, 'PROFESSIONAL': 3
        }
        df_unseen['EDUCATION'] = df_unseen['EDUCATION'].map(education_mapping)
        
        # Convert categorical variables to dummy variables
        categorical_columns = ['MARITALSTATUS', 'GENDER', 'last_prod_enq2', 'first_prod_enq2']
        df_unseen = pd.get_dummies(df_unseen, columns=categorical_columns)
        
        # Add missing columns with default values
        if 'pct_currentBal_all_TL' not in df_unseen.columns:
            df_unseen['pct_currentBal_all_TL'] = 0
        if 'num_lss_12mts' not in df_unseen.columns:
            df_unseen['num_lss_12mts'] = 0
            
        # Ensure all required columns are present and in the correct order
        required_columns = model.get_booster().feature_names
        for col in required_columns:
            if col not in df_unseen.columns:
                df_unseen[col] = 0
        
        # Reorder columns to match training data
        df_unseen = df_unseen[required_columns]
        
        # Make predictions
        predictions = model.predict(df_unseen)
        predicted_labels = label_encoder.inverse_transform(predictions)
        
        # Create results
        results = {
            "predictions": predicted_labels.tolist(),
            "customer_ids": prospect_ids if prospect_ids else list(range(len(predictions)))
        }
        
        # Clean up
        os.remove(file_path)
        
        return results
        
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None} 