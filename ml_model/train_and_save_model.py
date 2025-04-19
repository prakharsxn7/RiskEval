import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
import os
import json

def preprocess_data(df):
    # Convert categorical variables to numeric
    categorical_mappings = {
        'Gender': {'Male': 1, 'Female': 0},
        'MaritalStatus': {'Married': 1, 'Single': 0},
        'Education': {'Graduate': 1, 'Not Graduate': 0},
        'Self_Employed': {'Yes': 1, 'No': 0},
        'Property_Area': {'Urban': 2, 'Semiurban': 1, 'Rural': 0}
    }
    
    for col, mapping in categorical_mappings.items():
        if col in df.columns:
            df[col] = df[col].map(mapping)
    
    # Create one-hot encoded features
    one_hot_features = {
        'Dependents': ['0', '1', '2', '3+'],
        'Loan_Amount_Term': [12, 36, 60, 84, 120, 180, 240, 300, 360, 480]
    }
    
    for col, values in one_hot_features.items():
        if col in df.columns:
            for val in values:
                df[f'{col}_{val}'] = (df[col] == val).astype(int)
    
    # Ensure all required features exist with default values
    required_features = [
        'pct_tl_open_L6M', 'Tot_TL_closed_L12M', 'Tot_Missed_Pmnt',
        'pct_tl_closed_L6M', 'NETMONTHLYINCOME', 'Age', 'Gender',
        'MaritalStatus', 'Education', 'Self_Employed', 'Property_Area'
    ]
    
    for feature in required_features:
        if feature not in df.columns:
            df[feature] = 0
    
    return df

def train_model():
    # Load and preprocess data
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, 'case_study1.xlsx')
    df = pd.read_excel(data_path)
    print("Available columns:", df.columns.tolist())
    print("\nFirst few rows:")
    print(df.head())
    
    # Create models directory if it doesn't exist
    models_dir = os.path.join(current_dir, 'models')
    if not os.path.exists(models_dir):
        os.makedirs(models_dir)
    
    # For this case study, we'll use all available features
    # We'll need to generate a target variable based on some rules
    # Let's create a risk score based on various factors
    
    # Calculate risk score based on various factors
    df['risk_score'] = (
        # Higher percentage of closed loans in last 6M increases risk
        df['pct_tl_closed_L6M'] * 0.2 +
        # Higher percentage of missed payments increases risk
        (df['Tot_Missed_Pmnt'] / df['Total_TL']).fillna(0) * 0.3 +
        # Higher percentage of unsecured loans increases risk
        (df['Unsecured_TL'] / df['Total_TL']).fillna(0) * 0.2 +
        # Higher percentage of recent loans increases risk
        (df['Total_TL_opened_L6M'] / df['Total_TL']).fillna(0) * 0.15 +
        # Higher percentage of closed loans in last 12M increases risk
        df['pct_tl_closed_L12M'] * 0.15
    )
    
    # Normalize risk score to 0-1 range
    df['risk_score'] = (df['risk_score'] - df['risk_score'].min()) / (df['risk_score'].max() - df['risk_score'].min())
    
    # Create target variable based on risk score quartiles
    df['Target_variable'] = pd.qcut(df['risk_score'], q=4, labels=['P1', 'P2', 'P3', 'P4'])
    
    # Drop risk score as it was only used to create target variable
    df = df.drop('risk_score', axis=1)
    
    # Separate features and target
    X = df.drop(['PROSPECTID', 'Target_variable'], axis=1)
    y = df['Target_variable']
    
    # Encode target variable
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Define model parameters
    params = {
        'objective': 'multi:softprob',
        'num_class': 4,
        'max_depth': 6,
        'learning_rate': 0.1,
        'n_estimators': 100,
        'subsample': 0.8,
        'colsample_bytree': 0.8,
        'min_child_weight': 1,
        'gamma': 0,
        'scale_pos_weight': 'balanced',
        'eval_metric': 'mlogloss'
    }
    
    # Train model
    model = xgb.XGBClassifier(**params)
    model.fit(X, y_encoded)
    
    # Save model
    model.save_model(os.path.join(models_dir, 'xgb_model.json'))
    
    # Save label encoder classes
    np.save(os.path.join(models_dir, 'label_encoder_classes.npy'), label_encoder.classes_)
    
    # Save feature names
    with open(os.path.join(models_dir, 'feature_names.json'), 'w') as f:
        json.dump(list(X.columns), f)
    
    print("\nModel trained and saved successfully!")
    print(f"Model parameters: {params}")
    print(f"Features used: {list(X.columns)}")
    print(f"\nTarget variable distribution:")
    print(y.value_counts().sort_index())

if __name__ == "__main__":
    train_model() 