import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from statsmodels.stats.outliers_influence import variance_inflation_factor
import os

def train_and_save_model():
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Load training data
    a1 = pd.read_excel("case_study1.xlsx")
    a2 = pd.read_excel("case_study2.xlsx")
    df1 = a1.copy()
    df2 = a2.copy()
    
    # Data Cleaning
    df1 = df1.loc[df1['Age_Oldest_TL'] != -99999]
    columns_to_be_removed = []
    
    for i in df2.columns:
        if df2.loc[df2[i] == -99999].shape[0] > 10000:
            columns_to_be_removed.append(i)
    df2 = df2.drop(columns_to_be_removed, axis=1)
    
    for i in df2.columns:
        df2 = df2.loc[df2[i] != -99999]
    
    # Merge the dataframes
    df = pd.merge(df1, df2, how='inner', left_on=['PROSPECTID'], right_on=['PROSPECTID'])
    
    # Feature selection
    numeric_columns = []
    for i in df.columns:
        if df[i].dtype != 'object' and i not in ['PROSPECTID', 'Approved_Flag']:
            numeric_columns.append(i)
    
    # VIF check
    vif_data = df[numeric_columns]
    total_columns = vif_data.shape[1]
    columns_to_be_kept = []
    column_index = 0
    
    for i in range(total_columns):
        vif_value = variance_inflation_factor(vif_data, column_index)
        if vif_value <= 6:
            columns_to_be_kept.append(numeric_columns[i])
            column_index += 1
        else:
            vif_data = vif_data.drop([numeric_columns[i]], axis=1)
    
    # Final feature list
    features = columns_to_be_kept + ['MARITALSTATUS', 'EDUCATION', 'GENDER', 'last_prod_enq2', 'first_prod_enq2']
    df = df[features + ['Approved_Flag']]
    
    # Education level mapping
    education_mapping = {
        'SSC': 1, '12TH': 2, 'GRADUATE': 3, 
        'UNDER GRADUATE': 3, 'POST-GRADUATE': 4, 
        'OTHERS': 1, 'PROFESSIONAL': 3
    }
    df['EDUCATION'] = df['EDUCATION'].map(education_mapping)
    
    # Convert categorical variables to dummy variables
    categorical_columns = ['MARITALSTATUS', 'GENDER', 'last_prod_enq2', 'first_prod_enq2']
    df_encoded = pd.get_dummies(df, columns=categorical_columns)
    
    # Prepare data for training
    y = df_encoded['Approved_Flag']
    X = df_encoded.drop(['Approved_Flag'], axis=1)
    
    # Encode target variable
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
    
    # Train model
    model = xgb.XGBClassifier(
        objective='multi:softmax',
        num_class=4,
        colsample_bytree=0.9,
        learning_rate=1,
        max_depth=3,
        alpha=10,
        n_estimators=100
    )
    
    model.fit(X_train, y_train)
    
    # Save model and label encoder
    model.save_model('models/xgb_model.json')
    np.save('models/label_encoder_classes.npy', label_encoder.classes_, allow_pickle=True)
    
    print("Model and label encoder saved successfully!")

if __name__ == "__main__":
    train_and_save_model() 