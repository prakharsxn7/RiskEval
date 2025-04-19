from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import xgboost as xgb
import numpy as np
import io
import os
import traceback
import json

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
    allow_origins=origins,
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
model_path = os.path.join(current_dir, 'models', 'xgb_model.json')
label_encoder_path = os.path.join(current_dir, 'models', 'label_encoder_classes.npy')
feature_names_path = os.path.join(current_dir, 'models', 'feature_names.json')

# Risk level descriptions
RISK_DESCRIPTIONS = {
    'P1': 'Excellent credit risk - Highly likely to repay loans',
    'P2': 'Good credit risk - Generally reliable in loan repayment',
    'P3': 'Fair credit risk - Some concerns about repayment ability',
    'P4': 'Poor credit risk - High risk of default'
}

# Credit score ranges based on risk level
CREDIT_SCORE_RANGES = {
    'P1': (740, 850),  # Excellent
    'P2': (670, 739),  # Good
    'P3': (580, 669),  # Fair
    'P4': (300, 579)   # Poor
}

# Success rate ranges based on risk level
SUCCESS_RATE_RANGES = {
    'P1': (90, 100),   # Excellent
    'P2': (75, 89),    # Good
    'P3': (50, 74),    # Fair
    'P4': (0, 49)      # Poor
}

# Load the model and label encoder
try:
    print("\n=== Model Loading ===")
    print("Current directory:", current_dir)
    print("Model path:", model_path)
    print("Label encoder path:", label_encoder_path)
    print("Feature names path:", feature_names_path)
    
    # Check if files exist
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}")
    if not os.path.exists(label_encoder_path):
        raise FileNotFoundError(f"Label encoder file not found at {label_encoder_path}")
    if not os.path.exists(feature_names_path):
        raise FileNotFoundError(f"Feature names file not found at {feature_names_path}")
    
    # Load model
    model = xgb.XGBClassifier(
        objective='multi:softprob',
        num_class=4,
        max_depth=6,
        learning_rate=0.1,
        n_estimators=100,
        subsample=0.8,
        colsample_bytree=0.8,
        min_child_weight=1,
        gamma=0,
        eval_metric='mlogloss'
    )
    model.load_model(model_path)
    
    # Load label encoder classes
    label_encoder_classes = np.load(label_encoder_path, allow_pickle=True)
    
    # Load feature names
    with open(feature_names_path, 'r') as f:
        expected_features = json.load(f)
    
    print("\nModel loaded successfully")
    print("Model parameters:", model.get_params())
    print("\nExpected features:", expected_features)
    print("\nLabel encoder loaded successfully")
    print("Label encoder classes:", label_encoder_classes)
    print("Number of classes:", len(label_encoder_classes))
    
except Exception as e:
    print(f"\nError loading model: {str(e)}")
    print("Full traceback:")
    print(traceback.format_exc())
    model = None
    label_encoder_classes = None
    expected_features = None

def calculate_credit_score(risk_level):
    """Calculate a credit score based on the risk level"""
    score_range = CREDIT_SCORE_RANGES.get(risk_level, (300, 850))
    return np.random.randint(score_range[0], score_range[1] + 1)

def calculate_success_rate(risk_level):
    """Calculate success rate based on the risk level"""
    rate_range = SUCCESS_RATE_RANGES.get(risk_level, (0, 100))
    return np.random.randint(rate_range[0], rate_range[1] + 1)

def determine_loan_eligibility(risk_level):
    """Determine loan eligibility based on risk level"""
    return risk_level in ['P1', 'P2']

def get_credit_factors_breakdown(feature_importance, credit_score):
    """Calculate credit factors breakdown based on feature importance and credit score"""
    # Map feature importance to credit factors
    credit_factors = {
        'Payment History': ['Tot_Missed_Pmnt', 'pct_tl_closed_L6M', 'pct_tl_closed_L12M'],
        'Credit Utilization': ['pct_active_tl', 'pct_closed_tl', 'Total_TL'],
        'Credit Age': ['Age_Oldest_TL', 'Age_Newest_TL'],
        'Account Mix': ['CC_TL', 'Home_TL', 'PL_TL', 'Secured_TL', 'Unsecured_TL'],
        'Recent Inquiries': ['Total_TL_opened_L6M', 'Total_TL_opened_L12M']
    }
    
    # Calculate scores for each factor
    factor_scores = {}
    for factor, features in credit_factors.items():
        # Get importance scores for features in this factor
        scores = [feature_importance.get(f, 0) for f in features]
        # Calculate weighted average
        avg_score = sum(scores) / len(scores) if scores else 0
        # Scale to credit score range
        factor_scores[factor] = int(avg_score * credit_score)
    
    return factor_scores

@app.post("/process-file")
async def process_file(file: UploadFile = File(...)):
    if not model or label_encoder_classes is None or expected_features is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Read the Excel file
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        
        # Print data shape and columns for debugging
        print(f"\nData shape: {df.shape}")
        print(f"Columns: {df.columns.tolist()}")
        print("\nFirst few rows of data:")
        print(df.head())
        
        # Handle categorical variables
        categorical_cols = ['MARITALSTATUS', 'EDUCATION', 'GENDER', 'last_prod_enq2', 'first_prod_enq2']
        df_encoded = pd.get_dummies(df, columns=categorical_cols)
        
        # Calculate derived features
        print("\nCalculating derived features...")
        df_encoded['Total_TL'] = df_encoded['CC_TL'] + df_encoded['Home_TL'] + df_encoded['PL_TL'] + df_encoded['Other_TL']
        print("Total_TL calculated")
        
        df_encoded['Tot_Closed_TL'] = df_encoded['Tot_TL_closed_L12M']
        df_encoded['Tot_Active_TL'] = df_encoded['Total_TL'] - df_encoded['Tot_Closed_TL']
        print("Tot_Closed_TL and Tot_Active_TL calculated")
        
        # Initialize all required features with default values first
        df_encoded['pct_tl_open_L12M'] = df_encoded['pct_tl_open_L6M']  # Use L6M value as default
        df_encoded['pct_tl_closed_L12M'] = df_encoded['pct_tl_closed_L6M']  # Use L6M value as default
        print("L12M percentages initialized")
        
        df_encoded['Total_TL_opened_L6M'] = df_encoded['pct_tl_open_L6M'] * df_encoded['Total_TL'] / 100
        df_encoded['Tot_TL_closed_L6M'] = df_encoded['pct_tl_closed_L6M'] * df_encoded['Total_TL'] / 100
        df_encoded['Total_TL_opened_L12M'] = df_encoded['pct_tl_open_L12M'] * df_encoded['Total_TL'] / 100
        print("TL opened/closed counts calculated")
        
        df_encoded['pct_active_tl'] = (df_encoded['Tot_Active_TL'] / df_encoded['Total_TL']) * 100
        df_encoded['pct_closed_tl'] = (df_encoded['Tot_Closed_TL'] / df_encoded['Total_TL']) * 100
        print("Percentage calculations completed")
        
        # Initialize other required features with default values
        df_encoded['Auto_TL'] = 0
        df_encoded['Consumer_TL'] = 0
        df_encoded['Gold_TL'] = 0
        print("Default TL types initialized")
        
        # Ensure all required features exist and are numeric
        print("\nChecking for missing features...")
        for feature in expected_features:
            if feature not in df_encoded.columns:
                df_encoded[feature] = 0
                print(f"Added missing feature: {feature} with default value 0")
            # Convert to numeric if not already
            df_encoded[feature] = pd.to_numeric(df_encoded[feature], errors='coerce').fillna(0)
        
        print("\nFinal features in dataframe:")
        print(df_encoded[expected_features].columns.tolist())
        
        # Select only the features used during training
        X = df_encoded[expected_features]
        print(f"\nShape of features for prediction: {X.shape}")
        
        # Make predictions
        probabilities = model.predict_proba(X)
        predictions = [label_encoder_classes[i] for i in np.argmax(probabilities, axis=1)]
        
        # Calculate feature importance
        feature_importance = dict(zip(expected_features, model.feature_importances_))
        sorted_feature_importance = {k: float(v) for k, v in sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)}
        
        # Process results for each customer
        results = []
        for i, (pred, prob) in enumerate(zip(predictions, probabilities)):
            credit_score = calculate_credit_score(pred)
            success_rate = calculate_success_rate(pred)
            is_eligible = determine_loan_eligibility(pred)
            
            result = {
                'riskLevel': pred,
                'creditScore': credit_score,
                'isEligible': is_eligible,
                'category': pred,  # Using risk level as category
                'riskDescription': RISK_DESCRIPTIONS[pred],
                'successRate': success_rate,
                'probabilities': [float(p) for p in prob]  # Convert numpy floats to Python floats
            }
            results.append(result)
        
        return {
            'predictions': predictions,
            'probabilities': [[float(p) for p in prob] for prob in probabilities],  # Convert numpy floats to Python floats
            'feature_importance': sorted_feature_importance,
            'results': results
        }
        
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        print("Full traceback:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 