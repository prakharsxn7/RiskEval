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
import  time

print('program is running')
print()
start_time = time.time()


# Loading Dataset
a1 = pd.read_excel("case_study1.xlsx")
a2 = pd.read_excel("case_study2.xlsx")
df1 = a1.copy()
df2 = a2.copy()


#Data Cleaning
#remove nulls 

# Remove nulls
df1 = df1.loc[df1['Age_Oldest_TL'] != -99999]
columns_to_be_removed = []

for i in df2.columns:
    if df2.loc[df2[i] == -99999].shape[0] > 10000:
        columns_to_be_removed .append(i)
df2 = df2.drop(columns_to_be_removed, axis =1)

for i in df2.columns:
    df2 = df2.loc[ df2[i] != -99999 ]
    
# Checking common column names
for i in list(df1.columns):
    if i in list(df2.columns):
        print (i)


# Merge the two dataframes, inner join so that no nulls are present
df = pd. merge ( df1, df2, how ='inner', left_on = ['PROSPECTID'], right_on = ['PROSPECTID'] )

# check how many columns are categorical
print("List of Categorical columns :")
for i in df.columns:
    if df[i].dtype == 'object':
        print(i)



# Chi-square test
for i in ['MARITALSTATUS', 'EDUCATION', 'GENDER', 'last_prod_enq2', 'first_prod_enq2']:
    chi2, pval, _, _ = chi2_contingency(pd.crosstab(df[i], df['Approved_Flag']))
    print(i, '---', pval)


# Since all the categorical features have pval <=0.05, we will accept all


# VIF for numerical columns
numeric_columns = []
for i in df.columns:
    if df[i].dtype != 'object' and i not in ['PROSPECTID','Approved_Flag']:
        numeric_columns.append(i)



      

# VIF sequentially check

vif_data = df[numeric_columns]
total_columns = vif_data.shape[1]
columns_to_be_kept = []
column_index = 0



for i in range (0,total_columns):
    
    vif_value = variance_inflation_factor(vif_data, column_index)
    print (column_index,'---',vif_value)
    
    
    if vif_value <= 6:
        columns_to_be_kept.append( numeric_columns[i] )
        column_index = column_index+1
    
    else:
        vif_data = vif_data.drop([ numeric_columns[i] ] , axis=1)

   





# check Anova for columns_to_be_kept 

from scipy.stats import f_oneway

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
features = columns_to_be_kept_numerical + ['MARITALSTATUS', 'EDUCATION', 'GENDER', 'last_prod_enq2', 'first_prod_enq2']
df = df[features + ['Approved_Flag']]






# Label encoding for the categorical features
['MARITALSTATUS', 'EDUCATION', 'GENDER' , 'last_prod_enq2' ,'first_prod_enq2']



df['MARITALSTATUS'].unique()    
df['EDUCATION'].unique()
df['GENDER'].unique()
df['last_prod_enq2'].unique()
df['first_prod_enq2'].unique()



# Ordinal feature -- EDUCATION
# SSC            : 1
# 12TH           : 2
# GRADUATE       : 3
# UNDER GRADUATE : 3
# POST-GRADUATE  : 4
# OTHERS         : 1
# PROFESSIONAL   : 3


# Others has to be verified by the business end user 




df.loc[df['EDUCATION'] == 'SSC',['EDUCATION']]              = 1
df.loc[df['EDUCATION'] == '12TH',['EDUCATION']]             = 2
df.loc[df['EDUCATION'] == 'GRADUATE',['EDUCATION']]         = 3
df.loc[df['EDUCATION'] == 'UNDER GRADUATE',['EDUCATION']]   = 3
df.loc[df['EDUCATION'] == 'POST-GRADUATE',['EDUCATION']]    = 4
df.loc[df['EDUCATION'] == 'OTHERS',['EDUCATION']]           = 1
df.loc[df['EDUCATION'] == 'PROFESSIONAL',['EDUCATION']]     = 3




df['EDUCATION'].value_counts()
df['EDUCATION'] = df['EDUCATION'].astype(int)
df.info()



df_encoded = pd.get_dummies(df, columns=['MARITALSTATUS','GENDER', 'last_prod_enq2' ,'first_prod_enq2'])



df_encoded.info()
k = df_encoded.describe()


#Machine Learning

# Xgboost

model= xgb.XGBClassifier(objective = 'multi : softmax', num_class=4,colsample_bytree=0.9,learning_rate=1,max_depth=3,alpha=10,n_estimators=100)

y = df_encoded['Approved_Flag']
x = df_encoded. drop ( ['Approved_Flag'], axis = 1 )


label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

x_train, x_test, y_train, y_test = train_test_split(x, y_encoded, test_size=0.2, random_state=42)


model.fit(x_train, y_train)
y_pred = model.predict(x_test)

accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy:.2f}')


precision, recall, f1_score, _ = precision_recall_fscore_support(y_test, y_pred)

for i, v in enumerate(['p1', 'p2', 'p3', 'p4']):
    print(f"Class {v}:")
    print(f"Precision: {precision[i]}")
    print(f"Recall: {recall[i]}")
    print(f"F1 Score: {f1_score[i]}")
    print()




# Predict on unseen data
start_time = time.time()
a3 = pd.read_excel("Unseen_Dataset.xlsx")

# Ensure columns in unseen match training columns
cols_in_def = list(df.columns)
cols_in_def.remove('Approved_Flag')  # Remove target column
df_unseen = a3[cols_in_def]

# Map education levels to numeric values
df_unseen.loc[df_unseen['EDUCATION'] == 'SSC', ['EDUCATION']] = 1
df_unseen.loc[df_unseen['EDUCATION'] == '12TH', ['EDUCATION']] = 2
df_unseen.loc[df_unseen['EDUCATION'] == 'GRADUATE', ['EDUCATION']] = 3
df_unseen.loc[df_unseen['EDUCATION'] == 'UNDER GRADUATE', ['EDUCATION']] = 3
df_unseen.loc[df_unseen['EDUCATION'] == 'POST-GRADUATE', ['EDUCATION']] = 4
df_unseen.loc[df_unseen['EDUCATION'] == 'OTHERS', ['EDUCATION']] = 1
df_unseen.loc[df_unseen['EDUCATION'] == 'PROFESSIONAL', ['EDUCATION']] = 3

df_unseen.loc[:, 'EDUCATION'] = df_unseen['EDUCATION'].astype(int)


# Encode categorical variables
df_encoded_unseen = pd.get_dummies(df_unseen, columns=['MARITALSTATUS', 'GENDER', 'last_prod_enq2', 'first_prod_enq2'])

df_encoded_unseen['EDUCATION'] = pd.to_numeric(df_encoded_unseen['EDUCATION'], errors='coerce')


# Align columns with training set
missing_cols = set(x_train.columns) - set(df_encoded_unseen.columns)
for col in missing_cols:
    df_encoded_unseen[col] = 0
df_encoded_unseen = df_encoded_unseen[x_train.columns]

# Predict unseen data
y_pred_unseen = model.predict(df_encoded_unseen)

# Save results
a3['Target_variable'] = label_encoder.inverse_transform(y_pred_unseen)
a3.to_excel("Predicted_Unseen_Data.xlsx", index=False)


elapsed_time = time.time() - start_time
print("Total run time of the program:", str(round(elapsed_time, 2)) + ' sec')
