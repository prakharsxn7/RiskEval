from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import xgboost as xgb
import numpy as np
import io
import os
import traceback

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Allow both React and Vite dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Get the absolute path to the model files
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(os.path.dirname(current_dir), 'ml_model', 'models', 'xgb_model.json')
label_encoder_path = os.path.join(os.path.dirname(current_dir), 'ml_model', 'models', 'label_encoder_classes.npy')

# Load the model and label encoder
try:
    model = xgb.XGBClassifier()
    model.load_model(model_path)
    label_encoder_classes = np.load(label_encoder_path, allow_pickle=True)
    print("Model and label encoder loaded successfully")
    print(f"Model loaded from: {model_path}")
    print(f"Label encoder loaded from: {label_encoder_path}")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    print(f"Attempted to load model from: {model_path}")
    print(f"Attempted to load label encoder from: {label_encoder_path}")
    model = None
    label_encoder_classes = None

@app.post("/process-file")
async def process_file(file: UploadFile = File(...)):
    if not model or label_encoder_classes is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Read the Excel file
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        
        print("Received data shape:", df.shape)
        print("Received columns:", df.columns.tolist())
        print("Data types before conversion:", df.dtypes)
        
        # Validate the data
        if df.empty:
            raise ValueError("Received empty dataset")

        # Convert all columns to numeric, replacing NaN with 0
        for col in df.columns:
            try:
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            except Exception as e:
                print(f"Error converting column {col} to numeric: {str(e)}")
                print(f"Column {col} values:", df[col].values)
                raise ValueError(f"Column {col} contains non-numeric values")

        # Create binary columns for MARITALSTATUS
        df['MARITALSTATUS_Married'] = (df['MARITALSTATUS'] == 2).astype(int)
        df['MARITALSTATUS_Single'] = (df['MARITALSTATUS'] == 1).astype(int)

        # Create binary columns for GENDER
        df['GENDER_F'] = (df['GENDER'] == 2).astype(int)
        df['GENDER_M'] = (df['GENDER'] == 1).astype(int)

        # Drop original categorical columns
        df = df.drop(['MARITALSTATUS', 'GENDER'], axis=1)

        # Ensure all required columns are present with correct names
        required_columns = [
            'pct_tl_open_L6M', 'pct_tl_closed_L6M', 'Tot_TL_closed_L12M', 'pct_tl_closed_L12M',
            'Tot_Missed_Pmnt', 'CC_TL', 'Home_TL', 'PL_TL', 'Secured_TL', 'Unsecured_TL',
            'Other_TL', 'Age_Oldest_TL', 'Age_Newest_TL', 'time_since_recent_payment',
            'max_recent_level_of_deliq', 'num_deliq_6_12mts', 'num_times_60p_dpd',
            'num_std_12mts', 'num_sub', 'num_sub_6mts', 'num_sub_12mts', 'num_dbt',
            'num_dbt_12mts', 'num_lss', 'num_lss_12mts', 'recent_level_of_deliq',
            'CC_enq_L12m', 'PL_enq_L12m', 'time_since_recent_enq', 'enq_L3m',
            'NETMONTHLYINCOME', 'Time_With_Curr_Empr', 'pct_currentBal_all_TL',
            'CC_Flag', 'PL_Flag', 'pct_PL_enq_L6m_of_ever', 'pct_CC_enq_L6m_of_ever',
            'HL_Flag', 'GL_Flag', 'EDUCATION', 'MARITALSTATUS_Married',
            'MARITALSTATUS_Single', 'GENDER_F', 'GENDER_M', 'last_prod_enq2_AL',
            'last_prod_enq2_CC', 'last_prod_enq2_ConsumerLoan', 'last_prod_enq2_HL',
            'last_prod_enq2_PL', 'last_prod_enq2_others', 'first_prod_enq2_AL',
            'first_prod_enq2_CC', 'first_prod_enq2_ConsumerLoan', 'first_prod_enq2_HL',
            'first_prod_enq2_PL', 'first_prod_enq2_others'
        ]

        # Check for missing columns and add them with default value 0
        for col in required_columns:
            if col not in df.columns:
                df[col] = 0

        # Ensure columns are in the correct order
        df = df[required_columns]

        print("Final data shape:", df.shape)
        print("Final columns:", df.columns.tolist())
        print("Data types after conversion:", df.dtypes)
        print("First row of data:", df.iloc[0].to_dict())
        
        # Make predictions
        try:
            predictions = model.predict(df)
            print("Raw predictions:", predictions)
        except Exception as e:
            print("Error during prediction:", str(e))
            print("DataFrame head:", df.head())
            print("DataFrame info:")
            print(df.info())
            raise ValueError(f"Error making predictions: {str(e)}")
        
        # Convert numeric predictions to labels
        try:
            predictions = label_encoder_classes[predictions]
            print("Converted predictions:", predictions)
        except Exception as e:
            print("Error converting predictions:", str(e))
            print("Raw predictions shape:", predictions.shape)
            print("Label encoder classes shape:", label_encoder_classes.shape)
            raise ValueError(f"Error converting predictions: {str(e)}")
        
        return {"predictions": predictions.tolist()}
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        print("Full traceback:")
        print(traceback.format_exc())
        if 'df' in locals():
            print("DataFrame info:")
            print(df.info())
        raise HTTPException(status_code=400, detail=str(e)) 