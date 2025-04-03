import pandas as pd
import numpy as np

# Create a small test dataset
data = {
    'PROSPECTID': range(1, 6),
    'pct_tl_open_L6M': np.random.uniform(0, 1, 5),
    'pct_tl_closed_L6M': np.random.uniform(0, 1, 5),
    'Tot_TL_closed_L12M': np.random.randint(0, 10, 5),
    'pct_tl_closed_L12M': np.random.uniform(0, 1, 5),
    'Tot_Missed_Pmnt': np.random.randint(0, 5, 5),
    'CC_TL': np.random.randint(0, 3, 5),
    'Home_TL': np.random.randint(0, 2, 5),
    'PL_TL': np.random.randint(0, 3, 5),
    'Secured_TL': np.random.randint(0, 4, 5),
    'Unsecured_TL': np.random.randint(0, 3, 5),
    'Other_TL': np.random.randint(0, 2, 5),
    'Age_Oldest_TL': np.random.randint(12, 60, 5),
    'Age_Newest_TL': np.random.randint(1, 12, 5),
    'time_since_recent_payment': np.random.randint(0, 30, 5),
    'max_recent_level_of_deliq': np.random.randint(0, 5, 5),
    'num_deliq_6_12mts': np.random.randint(0, 3, 5),
    'num_times_60p_dpd': np.random.randint(0, 2, 5),
    'num_std_12mts': np.random.randint(0, 4, 5),
    'num_sub': np.random.randint(0, 3, 5),
    'num_sub_6mts': np.random.randint(0, 2, 5),
    'num_sub_12mts': np.random.randint(0, 3, 5),
    'num_dbt': np.random.randint(0, 2, 5),
    'num_dbt_12mts': np.random.randint(0, 2, 5),
    'num_lss': np.random.randint(0, 1, 5),
    'num_lss_12mts': np.random.randint(0, 1, 5),
    'recent_level_of_deliq': np.random.randint(0, 3, 5),
    'CC_enq_L12m': np.random.randint(0, 5, 5),
    'PL_enq_L12m': np.random.randint(0, 4, 5),
    'time_since_recent_enq': np.random.randint(0, 30, 5),
    'enq_L3m': np.random.randint(0, 3, 5),
    'NETMONTHLYINCOME': np.random.randint(20000, 100000, 5),
    'Time_With_Curr_Empr': np.random.randint(1, 10, 5),
    'pct_currentBal_all_TL': np.random.uniform(0, 1, 5),
    'CC_Flag': np.random.randint(0, 1, 5),
    'PL_Flag': np.random.randint(0, 1, 5),
    'pct_PL_enq_L6m_of_ever': np.random.uniform(0, 1, 5),
    'pct_CC_enq_L6m_of_ever': np.random.uniform(0, 1, 5),
    'HL_Flag': np.random.randint(0, 1, 5),
    'GL_Flag': np.random.randint(0, 1, 5),
    'EDUCATION': np.random.choice(['SSC', '12TH', 'GRADUATE', 'UNDER GRADUATE', 'POST-GRADUATE', 'OTHERS', 'PROFESSIONAL'], 5),
    'MARITALSTATUS': np.random.choice(['Married', 'Single'], 5),
    'GENDER': np.random.choice(['M', 'F'], 5),
    'last_prod_enq2': np.random.choice(['AL', 'CC', 'ConsumerLoan', 'HL', 'PL', 'others'], 5),
    'first_prod_enq2': np.random.choice(['AL', 'CC', 'ConsumerLoan', 'HL', 'PL', 'others'], 5)
}

df = pd.DataFrame(data)
df.to_excel('test_data.xlsx', index=False)
print("Test data created successfully!") 