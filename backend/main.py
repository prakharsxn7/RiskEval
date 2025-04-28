from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import xgboost as xgb
import numpy as np
import io
import os
import traceback

app = FastAPI()
origins = [
    "https://riskeval.site",  # Your frontend URL
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5001",  # Allow local development
]
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow both React and Vite dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(os.path.dirname(current_dir), 'ml_model', 'models', 'xgb_model.json')
label_encoder_path = os.path.join(os.path.dirname(current_dir), 'ml_model', 'models', 'label_encoder_classes.npy')
feature_names_path = os.path.join(os.path.dirname(current_dir),'ml_model','models', 'feature_names.npy')
# Load everything needed
model = xgb.XGBClassifier()
model.load_model(model_path)

label_encoder_classes = np.load(label_encoder_path, allow_pickle=True)
feature_names = np.load(feature_names_path, allow_pickle=True)

@app.post("/process-file")
async def process_file(file: UploadFile = File(...)):
    if model is None or label_encoder_classes is None or feature_names is None:
        raise HTTPException(status_code=500, detail="Model or metadata not loaded")

    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))

        if df.empty:
            raise ValueError("Received empty dataset")

        # Convert all to numeric
        df = df.apply(pd.to_numeric, errors='coerce').fillna(0)

        # Create binary columns for categorical
        df['MARITALSTATUS_Married'] = (df['MARITALSTATUS'] == 2).astype(int)
        df['MARITALSTATUS_Single'] = (df['MARITALSTATUS'] == 1).astype(int)

        df['GENDER_F'] = (df['GENDER'] == 2).astype(int)
        df['GENDER_M'] = (df['GENDER'] == 1).astype(int)

        # Drop originals
        df = df.drop(['MARITALSTATUS', 'GENDER'], axis=1, errors='ignore')

        # Reindex to match training feature set
        df = df.reindex(columns=feature_names, fill_value=0)

        # Predict
        preds = model.predict(df)

        # Decode prediction
        decoded_preds = label_encoder_classes[preds]

        return {"predictions": decoded_preds.tolist()}

    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))
