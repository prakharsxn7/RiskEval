import joblib
import xgboost as xgb
import numpy as np
import json
import os

def convert_model():
    # Get the absolute path to the model files
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Old paths
    old_model_path = os.path.join(current_dir, 'models', 'risk_model.joblib')
    old_label_encoder_path = os.path.join(current_dir, 'models', 'label_encoder.joblib')
    old_feature_names_path = os.path.join(current_dir, 'models', 'feature_names.txt')
    
    # New paths
    new_model_path = os.path.join(current_dir, 'models', 'xgb_model.json')
    new_label_encoder_path = os.path.join(current_dir, 'models', 'label_encoder_classes.npy')
    new_feature_names_path = os.path.join(current_dir, 'models', 'feature_names.json')
    
    try:
        print("Loading existing model files...")
        
        # Load the existing model and label encoder
        model = joblib.load(old_model_path)
        label_encoder = joblib.load(old_label_encoder_path)
        
        # Load feature names
        with open(old_feature_names_path, 'r') as f:
            feature_names = f.read().splitlines()
        
        print("Converting to XGBoost format...")
        
        # Save model in XGBoost format
        model.save_model(new_model_path)
        
        # Save label encoder classes
        np.save(new_label_encoder_path, label_encoder.classes_)
        
        # Save feature names as JSON
        with open(new_feature_names_path, 'w') as f:
            json.dump(feature_names, f)
        
        print("\nConversion completed successfully!")
        print(f"New model saved to: {new_model_path}")
        print(f"New label encoder saved to: {new_label_encoder_path}")
        print(f"New feature names saved to: {new_feature_names_path}")
        
        # Verify the conversion
        print("\nVerifying the conversion...")
        
        # Load the new XGBoost model
        new_model = xgb.XGBClassifier()
        new_model.load_model(new_model_path)
        
        # Load the new label encoder classes
        new_label_encoder_classes = np.load(new_label_encoder_path, allow_pickle=True)
        
        # Load the new feature names
        with open(new_feature_names_path, 'r') as f:
            new_feature_names = json.load(f)
        
        print("\nVerification successful!")
        print("Model parameters:", new_model.get_params())
        print("Label encoder classes:", new_label_encoder_classes)
        print("Feature names:", new_feature_names)
        
    except Exception as e:
        print(f"Error during conversion: {str(e)}")
        raise

if __name__ == "__main__":
    convert_model() 