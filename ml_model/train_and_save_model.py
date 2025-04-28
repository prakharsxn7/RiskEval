import numpy as np
import pandas as pd
import seaborn as sns
from scipy.stats import chi2_contingency
from statsmodels.stats.outliers_influence import variance_inflation_factor
from sklearn.model_selection import train_test_split
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, precision_recall_fscore_support
import warnings
import os
import time
import json
from datetime import datetime
from scipy.stats import f_oneway
import matplotlib.pyplot as plt

def train_and_save_model():
    print('program is running')
    print()
    start_time = time.time()

    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)

    # Loading Dataset
    a1 = pd.read_excel("case_study1.xlsx")
    a2 = pd.read_excel("case_study2.xlsx")
    df1 = a1.copy()
    df2 = a2.copy()

    # Data Cleaning
    # Remove nulls
    df1 = df1.loc[df1['Age_Oldest_TL'] != -99999]
    columns_to_be_removed = []

    for i in df2.columns:
        if df2.loc[df2[i] == -99999].shape[0] > 10000:
            columns_to_be_removed.append(i)
    df2 = df2.drop(columns_to_be_removed, axis=1)

    for i in df2.columns:
        df2 = df2.loc[df2[i] != -99999]
        
    # Checking common column names
    for i in list(df1.columns):
        if i in list(df2.columns):
            print(i)

    # Merge the two dataframes, inner join so that no nulls are present
    df = pd.merge(df1, df2, how='inner', left_on=['PROSPECTID'], right_on=['PROSPECTID'])

    # check how many columns are categorical
    print("List of Categorical columns:")
    for i in df.columns:
        if df[i].dtype == 'object':
            print(i)

    # Chi-square test
    for i in ['MARITALSTATUS', 'EDUCATION', 'GENDER', 'last_prod_enq2', 'first_prod_enq2']:
        chi2, pval, _, _ = chi2_contingency(pd.crosstab(df[i], df['Approved_Flag']))
        print(i, '---', pval)

    # Since all the categorical features have pval <=0.05, we will accept all
    selected_categorical = ['MARITALSTATUS', 'EDUCATION', 'GENDER', 'last_prod_enq2', 'first_prod_enq2']

    # VIF for numerical columns
    numeric_columns = []
    for i in df.columns:
        if df[i].dtype != 'object' and i not in ['PROSPECTID', 'Approved_Flag']:
            numeric_columns.append(i)

    # VIF sequentially check
    vif_data = df[numeric_columns]
    total_columns = vif_data.shape[1]
    columns_to_be_kept = []
    column_index = 0

    for i in range(0, total_columns):
        vif_value = variance_inflation_factor(vif_data, column_index)
        print(column_index, '---', vif_value)
        
        if vif_value <= 6:
            columns_to_be_kept.append(numeric_columns[i])
            column_index = column_index + 1
        else:
            vif_data = vif_data.drop([numeric_columns[i]], axis=1)

    # check Anova for columns_to_be_kept
    columns_to_be_kept_numerical = []

    for i in columns_to_be_kept:
        a = list(df[i])
        b = list(df['Approved_Flag'])
        
        group_P1 = [value for value, group in zip(a, b) if group == 'P1']
        group_P2 = [value for value, group in zip(a, b) if group == 'P2']
        group_P3 = [value for value, group in zip(a, b) if group == 'P3']
        group_P4 = [value for value, group in zip(a, b) if group == 'P4']

        f_statistic, p_value = f_oneway(group_P1, group_P2, group_P3, group_P4)

        if p_value <= 0.05:
            columns_to_be_kept_numerical.append(i)

    # feature selection is done for cat and num features
    # listing all the final features
    features = columns_to_be_kept_numerical + selected_categorical
    df = df[features + ['Approved_Flag']]

    # Label encoding for the categorical features
    # ['MARITALSTATUS', 'EDUCATION', 'GENDER', 'last_prod_enq2', 'first_prod_enq2']

    # Ordinal feature -- EDUCATION
    # SSC            : 1
    # 12TH           : 2
    # GRADUATE       : 3
    # UNDER GRADUATE : 3
    # POST-GRADUATE  : 4
    # OTHERS         : 1
    # PROFESSIONAL   : 3

    # Others has to be verified by the business end user
    df.loc[df['EDUCATION'] == 'SSC', ['EDUCATION']] = 1
    df.loc[df['EDUCATION'] == '12TH', ['EDUCATION']] = 2
    df.loc[df['EDUCATION'] == 'GRADUATE', ['EDUCATION']] = 3
    df.loc[df['EDUCATION'] == 'UNDER GRADUATE', ['EDUCATION']] = 3
    df.loc[df['EDUCATION'] == 'POST-GRADUATE', ['EDUCATION']] = 4
    df.loc[df['EDUCATION'] == 'OTHERS', ['EDUCATION']] = 1
    df.loc[df['EDUCATION'] == 'PROFESSIONAL', ['EDUCATION']] = 3

    df['EDUCATION'].value_counts()
    df['EDUCATION'] = df['EDUCATION'].astype(int)
    df.info()

    df_encoded = pd.get_dummies(df, columns=['MARITALSTATUS', 'GENDER', 'last_prod_enq2', 'first_prod_enq2'])

    df_encoded.info()
    k = df_encoded.describe()

    # Machine Learning
    # Xgboost
    model = xgb.XGBClassifier(
        objective='multi:softmax', 
        num_class=4, 
        colsample_bytree=0.9, 
        learning_rate=1.0, 
        max_depth=3, 
        alpha=10, 
        n_estimators=100,
        random_state=42
    )

    y = df_encoded['Approved_Flag']
    x = df_encoded.drop(['Approved_Flag'], axis=1)

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    x_train, x_test, y_train, y_test = train_test_split(x, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded)

    model.fit(x_train, y_train)
    y_pred = model.predict(x_test)

    accuracy = accuracy_score(y_test, y_pred)
    print(f'Accuracy: {accuracy:.2f}')

    precision, recall, f1_score, _ = precision_recall_fscore_support(y_test, y_pred)

    for i, v in enumerate(label_encoder.classes_):
        print(f"Class {v}:")
        print(f"Precision: {precision[i]}")
        print(f"Recall: {recall[i]}")
        print(f"F1 Score: {f1_score[i]}")
        print()

    # Save model and metadata
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save model with consistent name
    model_path = 'models/xgb_model.json'
    model.save_model(model_path)
    
    # Save label encoder classes
    np.save('models/label_encoder_classes.npy', label_encoder.classes_)
    
    # Save feature names
    np.save('models/feature_names.npy', x.columns.values)
    
    # Save metadata
    metadata = {
        'timestamp': timestamp,
        'features': list(x.columns),
        'label_encoder_classes': list(label_encoder.classes_),
        'test_accuracy': float(accuracy),
        'precision': {v: float(p) for v, p in zip(label_encoder.classes_, precision)},
        'recall': {v: float(r) for v, r in zip(label_encoder.classes_, recall)},
        'f1_score': {v: float(f) for v, f in zip(label_encoder.classes_, f1_score)}
    }
    
    with open('models/model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=4)
    
    # Feature importance
    plt.figure(figsize=(10, 8))
    xgb.plot_importance(model, max_num_features=15)
    plt.tight_layout()
    plt.savefig('models/feature_importance.png')
    
    elapsed_time = time.time() - start_time
    print("Total run time of the program:", str(round(elapsed_time, 2)) + ' sec')
    print(f"Model saved to {model_path}")
    print(f"Model metadata saved to models/model_metadata.json")
    
    return model, label_encoder, x.columns

if __name__ == "__main__":
    train_and_save_model()