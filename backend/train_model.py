import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier
import joblib
import os

def train_model():
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Read and prepare data
    data = pd.read_csv('data/train_data.csv')
    
    # Separate features and target
    X = data.drop('Target_variable', axis=1)
    y = data['Target_variable']
    
    # Handle categorical variables
    categorical_cols = ['MARITALSTATUS', 'EDUCATION', 'GENDER', 'last_prod_enq2', 'first_prod_enq2']
    X = pd.get_dummies(X, columns=categorical_cols)
    
    # Encode target variable
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
    
    # Calculate sample weights to match original distribution
    class_weights = {
        0: 0.07,  # P1: 7%
        1: 0.71,  # P2: 71%
        2: 0.09,  # P3: 9%
        3: 0.13   # P4: 13%
    }
    sample_weights = pd.Series(y_train).map(class_weights)
    
    # Initialize model with parameters matching previous version
    model = XGBClassifier(
        learning_rate=0.1,           # Increased from 0.05
        n_estimators=100,            # Reduced from 200
        max_depth=6,
        min_child_weight=1,
        gamma=0,
        subsample=0.8,
        colsample_bytree=0.8,
        objective='multi:softprob',
        num_class=4,
        random_state=42
    )
    
    # Train model with sample weights
    model.fit(
        X_train, 
        y_train,
        sample_weight=sample_weights,
        eval_set=[(X_test, y_test)],
        eval_metric='mlogloss',
        early_stopping_rounds=10,
        verbose=True
    )
    
    # Save model, feature names, and label encoder
    joblib.dump(model, 'models/risk_model.joblib')
    joblib.dump(label_encoder, 'models/label_encoder.joblib')
    feature_names = X.columns.tolist()
    with open('models/feature_names.txt', 'w') as f:
        f.write('\n'.join(feature_names))
    
    print("Model trained and saved successfully!")
    
    # Print model evaluation metrics
    y_pred = model.predict(X_test)
    accuracy = (y_pred == y_test).mean()
    print(f"\nTest accuracy: {accuracy:.2%}")
    
    # Print feature importance
    feature_importance = pd.Series(model.feature_importances_, index=X.columns)
    print("\nTop 10 most important features:")
    print(feature_importance.sort_values(ascending=False).head(10))
    
    return model, feature_names

if __name__ == "__main__":
    train_model() 