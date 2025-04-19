import { useState } from "react"
import * as XLSX from 'xlsx';
import { config } from "../utils/path";


const tabStyle = {
  padding: "0.75rem 1.5rem",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  fontWeight: 500,
  color: "#6b7280",
  transition: "all 0.2s ease",
}

const activeTabStyle = {
  ...tabStyle,
  color: "#3b82f6",
  background: "linear-gradient(135deg, #3b82f6, #10b981)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}

// Common styles for form fields
const commonInputStyles = {
  width: "100%",
  padding: "0.75rem",
  border: "1px solid #d1d5db",
  borderRadius: "0.5rem",
  fontSize: "0.95rem",
  color: "#374151",
  backgroundColor: "white",
  outline: "none",
  transition: "all 0.2s ease",
  height: "45px",
}

// Additional styles specifically for select elements
const selectStyles = {
  ...commonInputStyles,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23666' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 1rem center",
  paddingRight: "2.5rem",
  cursor: "pointer",
}

// Add styles for inputs and selects including interactive states
const styleTag = document.createElement('style');
styleTag.textContent = `
  input[type="number"], select {
    transition: all 0.2s ease;
  }

  input[type="number"]:hover, select:hover {
    border-color: #9ca3af;
    background-color: #f9fafb;
  }

  input[type="number"]:focus, select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background-color: white;
    outline: none;
  }

  select:active {
    background-color: #f3f4f6;
  }

  select {
    text-indent: 0;
    padding-left: 0.75rem;
  }

  select option {
    padding: 8px 12px;
    font-size: 0.95rem;
    color: #374151;
    background-color: white;
    min-height: 1.5em;
    text-indent: 0;
  }

  select option:hover {
    background-color: #f3f4f6;
  }

  /* Custom dropdown arrow color change on hover/focus */
  select:hover, select:focus {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%233b82f6' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  }

  /* Fix dropdown alignment */
  select, select option {
    text-align-last: left;
  }
`;
document.head.appendChild(styleTag);

const commonLabelStyles = {
  display: "block",
  marginBottom: "0.5rem",
  color: "#374151",
  fontWeight: 500,
  fontSize: "0.95rem",
}

const navigationButtonStyle = {
  padding: "0.75rem 1.5rem",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "0.5rem",
  color: "#374151",
  fontSize: "0.95rem",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
}

const sectionHeadingStyle = {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#1f2937",
  marginBottom: "2rem",
  textAlign: "center"
}

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("account-activity")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [completedSections, setCompletedSections] = useState({
    "account-activity": false,
    "account-types": false,
    "delinquency": false,
    "inquiries": false,
    "loan-flags": false,
    "customer-info": false
  })

  // Progress indicator component
  const ProgressIndicator = () => {
    const sections = [
      "Account Activity",
      "Account Types",
      "Delinquency",
      "Inquiries",
      "Loan Flags",
      "Customer Info"
    ]

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '3rem',
        position: 'relative',
        padding: '0 1rem',
        minHeight: '100px'
      }}>
        {/* Progress line */}
        <div style={{
          position: 'absolute',
          top: '26px',  // Align exactly with circle centers
          left: '0',
          right: '0',
          height: '2px',
          backgroundColor: '#e5e7eb',
          zIndex: 0
        }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          {sections.map((section, index) => {
            const sectionKey = section.toLowerCase().replace(' ', '-')
            const isCompleted = completedSections[sectionKey]
            
            return (
              <div key={section} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: '1',
                maxWidth: '100px'
              }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#3b82f6' : '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                  background: isCompleted ? 'linear-gradient(135deg, #3b82f6, #10b981)' : '#e5e7eb',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  position: 'relative'
                }}>
                  {isCompleted && (
                    <span style={{ color: 'white' }}>✓</span>
                  )}
                </div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: isCompleted ? '#3b82f6' : '#6b7280',
                  textAlign: 'center',
                  maxWidth: '80px',
                  lineHeight: '1.2',
                  marginTop: '0.25rem'
                }}>
                  {section}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const [formData, setFormData] = useState({
    // Account Activity
    pct_tl_open_L6M: "",
    pct_tl_closed_L6M: "",
    Tot_TL_closed_L12M: "",
    pct_tl_closed_L12M: "",
    Tot_Missed_Pmnt: "",
    
    // Account Types
    CC_TL: "",
    Home_TL: "",
    PL_TL: "",
    Secured_TL: "",
    Unsecured_TL: "",
    Other_TL: "",
    
    // Account Age
    Age_Oldest_TL: "",
    Age_Newest_TL: "",
    time_since_recent_payment: "",

    // Delinquency
    max_recent_level_of_deliq: "",
    num_deliq_6_12mts: "",
    num_times_60p_dpd: "",
    num_std_12mts: "",
    num_sub: "",
    num_sub_6mts: "",
    num_sub_12mts: "",
    num_dbt: "",
    num_dbt_12mts: "",
    num_lss: "",
    recent_level_of_deliq: "",
    
    // Inquiries
    CC_enq_L12m: "",
    PL_enq_L12m: "",
    time_since_recent_enq: "",
    enq_L3m: "",

    // Customer Info
    NETMONTHLYINCOME: "",
    Time_With_Curr_Empr: "",
    CC_Flag: "",
    PL_Flag: "",
    pct_PL_enq_L6m_of_ever: "",
    pct_CC_enq_L6m_of_ever: "",
    HL_Flag: "",
    GL_Flag: "",
    MARITALSTATUS: "",
    EDUCATION: "",
    GENDER: "",
    last_prod_enq2: "",
    first_prod_enq2: "",
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Check if all fields in the current section are filled
    const sectionFields = {
      'account-activity': ['pct_tl_open_L6M', 'pct_tl_closed_L6M', 'Tot_TL_closed_L12M', 'pct_tl_closed_L12M', 'Tot_Missed_Pmnt'],
      'account-types': ['CC_TL', 'Home_TL', 'PL_TL', 'Secured_TL', 'Unsecured_TL', 'Other_TL'],
      'delinquency': ['max_recent_level_of_deliq', 'num_deliq_6_12mts', 'num_times_60p_dpd', 'num_std_12mts', 'num_sub'],
      'inquiries': ['CC_enq_L12m', 'PL_enq_L12m', 'time_since_recent_enq', 'enq_L3m'],
      'loan-flags': ['PL_Flag', 'HL_Flag', 'GL_Flag'],
      'customer-info': ['NETMONTHLYINCOME', 'Time_With_Curr_Empr', 'CC_Flag', 'PL_Flag', 'MARITALSTATUS', 'EDUCATION', 'GENDER', 'last_prod_enq2', 'first_prod_enq2']
    }

    const currentSectionFields = sectionFields[activeTab]
    const isSectionComplete = currentSectionFields.every(field => formData[field])
    
    if (isSectionComplete) {
      setCompletedSections(prev => ({
        ...prev,
        [activeTab]: true
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Create a copy of the form data for processing
      const processedData = { ...formData }

      // Convert categorical variables to numeric values
      const categoricalMappings = {
        MARITALSTATUS: { 'Single': 1, 'Married': 2, 'Divorced': 3, 'Widowed': 4 },
        EDUCATION: { 'High School': 1, 'Bachelor': 2, 'Master': 3, 'PhD': 4, 'Other': 5 },
        GENDER: { 'Male': 1, 'Female': 2, 'Other': 3 },
        income_segment: { 'Low': 1, 'Medium': 2, 'High': 3, 'Very High': 4 }
      }

      // Convert categorical fields to numeric
      Object.keys(categoricalMappings).forEach(field => {
        processedData[field] = categoricalMappings[field][processedData[field]] || 0
      })

<<<<<<< Updated upstream
      // Convert customer_since to numeric (days since date)
      if (processedData.customer_since) {
        const customerDate = new Date(processedData.customer_since)
        const today = new Date()
        processedData.customer_since = Math.floor((today - customerDate) / (1000 * 60 * 60 * 24))
      } else {
        processedData.customer_since = 0
      }

      // Convert all other fields to numbers, replacing empty strings, NaN, or invalid values with 0
=======
      // Convert all other fields to numbers
>>>>>>> Stashed changes
      Object.keys(processedData).forEach(key => {
        if (!['MARITALSTATUS', 'EDUCATION', 'GENDER', 'income_segment'].includes(key)) {
          const value = Number(processedData[key])
          processedData[key] = isNaN(value) ? 0 : value
        }
      })

      // Transform data to match model's expected features
      const transformedData = {
        ...processedData,
        // Add missing fields with default values
        num_dbt: processedData.num_dbt || 0,
        num_dbt_12mts: processedData.num_dbt_12mts || 0,
        num_lss: processedData.num_lss || 0,
        num_lss_12mts: processedData.num_lss_12mts || 0,
        recent_level_of_deliq: processedData.max_recent_level_of_deliq || 0,
        CC_enq_L12m: processedData.CC_enq_L12m || 0,
        PL_enq_L12m: processedData.PL_enq_L12m || 0,
        time_since_recent_enq: processedData.time_since_recent_enq || 0,
        enq_L3m: processedData.enq_L3m || 0,
        NETMONTHLYINCOME: processedData.NETMONTHLYINCOME || 0,
        Time_With_Curr_Empr: processedData.Time_With_Curr_Empr || 0,
        pct_currentBal_all_TL: processedData.pct_currentBal_all_TL || 0,
        // Transform categorical variables
        MARITALSTATUS_Married: processedData.MARITALSTATUS === 2 ? 1 : 0,
        MARITALSTATUS_Single: processedData.MARITALSTATUS === 1 ? 1 : 0,
        GENDER_F: processedData.GENDER === 2 ? 1 : 0,
        GENDER_M: processedData.GENDER === 1 ? 1 : 0,
        // Transform product enquiry fields
        last_prod_enq2_AL: processedData.last_prod_enq2 === 'AL' ? 1 : 0,
        last_prod_enq2_CC: processedData.last_prod_enq2 === 'CC' ? 1 : 0,
        last_prod_enq2_ConsumerLoan: processedData.last_prod_enq2 === 'ConsumerLoan' ? 1 : 0,
        last_prod_enq2_HL: processedData.last_prod_enq2 === 'HL' ? 1 : 0,
        last_prod_enq2_PL: processedData.last_prod_enq2 === 'PL' ? 1 : 0,
        last_prod_enq2_others: processedData.last_prod_enq2 === 'Others' ? 1 : 0,
        first_prod_enq2_AL: processedData.first_prod_enq2 === 'AL' ? 1 : 0,
        first_prod_enq2_CC: processedData.first_prod_enq2 === 'CC' ? 1 : 0,
        first_prod_enq2_ConsumerLoan: processedData.first_prod_enq2 === 'ConsumerLoan' ? 1 : 0,
        first_prod_enq2_HL: processedData.first_prod_enq2 === 'HL' ? 1 : 0,
        first_prod_enq2_PL: processedData.first_prod_enq2 === 'PL' ? 1 : 0,
        first_prod_enq2_others: processedData.first_prod_enq2 === 'Others' ? 1 : 0,
      }

      // Ensure all numeric fields are valid numbers
      Object.keys(transformedData).forEach(key => {
        const value = transformedData[key]
        if (typeof value !== 'number' || isNaN(value)) {
          transformedData[key] = 0
        }
      })

      console.log('Transformed data:', transformedData)

      // Create a worksheet from the transformed data
      const ws = XLSX.utils.json_to_sheet([transformedData])
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Data")

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const formDataToSend = new FormData()
      formDataToSend.append('file', dataBlob, 'data.xlsx')

      const BASE_URL= config.url.PYTHON_API_URL
      
      const response = await fetch(`${BASE_URL}/process-file`, {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to process data')
      }

      const result = await response.json()
      console.log('Server response:', result)
      
      // Handle the predictions here
      if (result.predictions && result.predictions.length > 0) {
        // Display the predictions to the user
        setError(null)
<<<<<<< Updated upstream
        alert(`Risk Assessment Result: ${result.predictions[0]}`)
=======
        
        // Calculate credit score based on risk level (P1-P4)
        let creditScore = 0;
        let isEligible = false;
        let category = '';
        let riskDescription = '';
        
        // Get the most frequent risk level from predictions
        const riskLevelCounts = result.predictions.reduce((acc, curr) => {
          acc[curr] = (acc[curr] || 0) + 1;
          return acc;
        }, {});
        
        const mostFrequentRiskLevel = Object.entries(riskLevelCounts)
          .sort((a, b) => b[1] - a[1])[0][0];
        
        // Calculate average credit score based on all predictions
        const creditScores = result.predictions.map(prediction => {
          switch(prediction) {
            case 'P1':
              return Math.floor(Math.random() * (850 - 740) + 740);
            case 'P2':
              return Math.floor(Math.random() * (739 - 670) + 670);
            case 'P3':
              return Math.floor(Math.random() * (669 - 580) + 580);
            case 'P4':
              return Math.floor(Math.random() * (579 - 300) + 300);
            default:
              return 0;
          }
        });
        
        creditScore = Math.round(creditScores.reduce((a, b) => a + b, 0) / creditScores.length);
        
        // Determine eligibility and category based on most frequent risk level
        switch(mostFrequentRiskLevel) {
          case 'P1':
            isEligible = true;
            category = 'Excellent';
            riskDescription = 'Very low risk profile';
            break;
          case 'P2':
            isEligible = true;
            category = 'Good';
            riskDescription = 'Low to moderate risk profile';
            break;
          case 'P3':
            isEligible = false;
            category = 'Fair';
            riskDescription = 'Moderate to high risk profile';
            break;
          case 'P4':
            isEligible = false;
            category = 'Poor';
            riskDescription = 'High risk profile';
            break;
          default:
            isEligible = false;
            category = 'Unknown';
            riskDescription = 'Unable to determine risk profile';
        }

        // Navigate to results page with risk assessment data
        navigate('/results', {
          state: {
            riskData: {
              riskLevel: mostFrequentRiskLevel,
              creditScore,
              isEligible,
              category,
              riskDescription,
              successRate: isEligible ? Math.floor(Math.random() * (95 - 75) + 75) : Math.floor(Math.random() * (74 - 40) + 40),
              predictions: result.predictions // Include all predictions for detailed analysis
            }
          }
        });
>>>>>>> Stashed changes
      } else {
        throw new Error('No predictions received from server')
      }
    } catch (err) {
      console.error('Error:', err)
      setError(`Failed to process form data: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    const sections = ["account-activity", "account-types", "delinquency", "inquiries", "loan-flags", "customer-info"];
    const currentIndex = sections.indexOf(activeTab);
    if (currentIndex < sections.length - 1) {
      setActiveTab(sections[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const sections = ["account-activity", "account-types", "delinquency", "inquiries", "loan-flags", "customer-info"];
    const currentIndex = sections.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(sections[currentIndex - 1]);
    }
  };

  return (
    <div style={{ maxWidth: "1024px", margin: "5rem auto 2rem", padding: "0 1rem" }}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "1rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem", marginTop: "1rem" }}>
          <h2 
            style={{ 
              fontSize: "2.5rem", 
              fontWeight: "bold", 
              marginBottom: "1rem",
              background: "linear-gradient(135deg, #3b82f6, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Risk Assessment
          </h2>
          <div
            style={{
              width: "6rem",
              height: "0.25rem",
              background: "linear-gradient(135deg, #3b82f6, #10b981)",
              margin: "0 auto",
              borderRadius: "1rem"
            }}
          ></div>
        </div>

        <ProgressIndicator />

        {error && (
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '8px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "2rem" }}>
            {/* Account Activity Tab */}
            <div style={{ display: activeTab === "account-activity" ? "block" : "none" }}>
              <h3 style={sectionHeadingStyle}>Account Activity</h3>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={commonLabelStyles}>
                  Percent accounts opened in last 6 months
                </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                  min="0"
                  max="100"
                        value={formData.pct_tl_open_L6M}
                  onChange={(e) => handleChange("pct_tl_open_L6M", e.target.value)}
                  style={commonInputStyles}
                  placeholder="Percent accounts opened in the last 6 months"
                    />
                </div>
=======
                <input
                  type="number"
                  step="0.01"
                  value={formData.pct_tl_open_L6M}
                  onChange={(e) => handleChange("pct_tl_open_L6M", e.target.value)}
                  style={commonInputStyles}
                  placeholder="pct_tl_open_L6M"
                />
              </div>
>>>>>>> Stashed changes

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={commonLabelStyles}>
                  Percent accounts closed in last 6 months
                </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.pct_tl_closed_L6M}
                  onChange={(e) => handleChange("pct_tl_closed_L6M", e.target.value)}
                  style={commonInputStyles}
                  placeholder="Percent accounts closed in the last 6 months"
                    />
                </div>
=======
                <input
                  type="number"
                  step="0.01"
                  value={formData.pct_tl_closed_L6M}
                  onChange={(e) => handleChange("pct_tl_closed_L6M", e.target.value)}
                  style={commonInputStyles}
                  placeholder="pct_tl_closed_L6M"
                />
              </div>
>>>>>>> Stashed changes

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={commonLabelStyles}>
                  Total accounts closed in last 12 months
                </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.Tot_TL_closed_L12M}
                  onChange={(e) => handleChange("Tot_TL_closed_L12M", e.target.value)}
                  style={commonInputStyles}
                  placeholder="Total accounts closed in the last 12 months"
                    />
                </div>
=======
                <input
                  type="number"
                  step="1"
                  value={formData.Tot_TL_closed_L12M}
                  onChange={(e) => handleChange("Tot_TL_closed_L12M", e.target.value)}
                  style={commonInputStyles}
                  placeholder="Tot_TL_closed_L12M"
                />
              </div>
>>>>>>> Stashed changes

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={commonLabelStyles}>
                  Percent accounts closed in last 12 months
                </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.pct_tl_closed_L12M}
                  onChange={(e) => handleChange("pct_tl_closed_L12M", e.target.value)}
                  style={commonInputStyles}
                  placeholder="Percent accounts closed in the last 12 months"
                    />
                </div>
=======
                <input
                  type="number"
                  step="0.01"
                  value={formData.pct_tl_closed_L12M}
                  onChange={(e) => handleChange("pct_tl_closed_L12M", e.target.value)}
                  style={commonInputStyles}
                  placeholder="pct_tl_closed_L12M"
                />
              </div>
>>>>>>> Stashed changes

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={commonLabelStyles}>
                  Total missed payments
                </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.Tot_Missed_Pmnt}
                  onChange={(e) => handleChange("Tot_Missed_Pmnt", e.target.value)}
                  style={commonInputStyles}
                  placeholder="Total missed payments"
                    />
                </div>
=======
                <input
                  type="number"
                  step="1"
                  value={formData.Tot_Missed_Pmnt}
                  onChange={(e) => handleChange("Tot_Missed_Pmnt", e.target.value)}
                  style={commonInputStyles}
                  placeholder="Tot_Missed_Pmnt"
                />
              </div>
>>>>>>> Stashed changes
            </div>

            {/* Account Types Tab */}
            <div
              style={{
                display: activeTab === "account-types" ? "block" : "none",
              }}
            >
              <h3 style={sectionHeadingStyle}>Account Types</h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.5rem",
              }}>
                <div>
                  <label style={commonLabelStyles}>
                    Count of credit card accounts
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.CC_TL}
                    onChange={(e) => handleChange("CC_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Count of credit card accounts"
                    />
=======
                  <input
                    type="number"
                    step="1"
                    value={formData.CC_TL}
                    onChange={(e) => handleChange("CC_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="CC_TL"
                  />
>>>>>>> Stashed changes
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Count of housing loan accounts
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.Home_TL}
                    onChange={(e) => handleChange("Home_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Count of housing loan accounts"
                    />
=======
                  <input
                    type="number"
                    step="1"
                    value={formData.Home_TL}
                    onChange={(e) => handleChange("Home_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Home_TL"
                  />
>>>>>>> Stashed changes
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Count of personal loan accounts
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.PL_TL}
                    onChange={(e) => handleChange("PL_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Count of personal loan accounts"
                    />
=======
                  <input
                    type="number"
                    step="1"
                    value={formData.PL_TL}
                    onChange={(e) => handleChange("PL_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="PL_TL"
                  />
>>>>>>> Stashed changes
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Count of secured accounts
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.Secured_TL}
                    onChange={(e) => handleChange("Secured_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Count of secured accounts"
                    />
=======
                  <input
                    type="number"
                    step="1"
                    value={formData.Secured_TL}
                    onChange={(e) => handleChange("Secured_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Secured_TL"
                  />
>>>>>>> Stashed changes
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Count of unsecured accounts
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.Unsecured_TL}
                    onChange={(e) => handleChange("Unsecured_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Count of unsecured accounts"
                    />
=======
                  <input
                    type="number"
                    step="1"
                    value={formData.Unsecured_TL}
                    onChange={(e) => handleChange("Unsecured_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Unsecured_TL"
                  />
>>>>>>> Stashed changes
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Count of other accounts
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.Other_TL}
                    onChange={(e) => handleChange("Other_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Count of other accounts"
                    />
            </div>
=======
                  <input
                    type="number"
                    step="1"
                    value={formData.Other_TL}
                    onChange={(e) => handleChange("Other_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Other_TL"
                  />
                </div>
>>>>>>> Stashed changes

                <div>
                  <label style={commonLabelStyles}>
                    Age of oldest opened account
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.Age_Oldest_TL}
                    onChange={(e) => handleChange("Age_Oldest_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Age of oldest opened account"
                    />
=======
                  <input
                    type="number"
                    step="0.01"
                    value={formData.Age_Oldest_TL}
                    onChange={(e) => handleChange("Age_Oldest_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Age_Oldest_TL"
                  />
>>>>>>> Stashed changes
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Age of newest opened account
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.Age_Newest_TL}
                    onChange={(e) => handleChange("Age_Newest_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Age of newest opened account"
                    />
            </div>
=======
                  <input
                    type="number"
                    step="0.01"
                    value={formData.Age_Newest_TL}
                    onChange={(e) => handleChange("Age_Newest_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Age_Newest_TL"
                  />
                </div>
>>>>>>> Stashed changes

                <div>
                  <label style={commonLabelStyles}>
                    Time since recent payment made
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.time_since_recent_payment}
                    onChange={(e) => handleChange("time_since_recent_payment", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Time since recent payment made"
                    />
=======
                  <input
                    type="number"
                    step="0.01"
                    value={formData.time_since_recent_payment}
                    onChange={(e) => handleChange("time_since_recent_payment", e.target.value)}
                    style={commonInputStyles}
                    placeholder="time_since_recent_payment"
                  />
>>>>>>> Stashed changes
                </div>
              </div>
            </div>

            {/* Delinquency Tab */}
            <div
              style={{
                display: activeTab === "delinquency" ? "block" : "none",
              }}
            >
              <h3 style={sectionHeadingStyle}>Delinquency Information</h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.5rem",
              }}>
                <div>
                  <label style={commonLabelStyles}>
                    Maximum recent level of delinquency
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.max_recent_level_of_deliq}
                    onChange={(e) => handleChange("max_recent_level_of_deliq", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Maximum recent level of delinquency"
                    />
=======
                  <input
                    type="number"
                    step="0.01"
                    value={formData.max_recent_level_of_deliq}
                    onChange={(e) => handleChange("max_recent_level_of_deliq", e.target.value)}
                    style={commonInputStyles}
                    placeholder="max_recent_level_of_deliq"
                  />
>>>>>>> Stashed changes
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of times delinquent between last 6-12 months
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.num_deliq_6_12mts}
                    onChange={(e) => handleChange("num_deliq_6_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Number of times delinquent between last 6-12 months"
                    />
=======
                  <input
                    type="number"
                    step="1"
                    value={formData.num_deliq_6_12mts}
                    onChange={(e) => handleChange("num_deliq_6_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_deliq_6_12mts"
                  />
>>>>>>> Stashed changes
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of times 60+ days past due
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.num_times_60p_dpd}
                    onChange={(e) => handleChange("num_times_60p_dpd", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Number of times 60+ days past due"
                    />
=======
                  <input
                    type="number"
                    step="1"
                    value={formData.num_times_60p_dpd}
                    onChange={(e) => handleChange("num_times_60p_dpd", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_times_60p_dpd"
                  />
>>>>>>> Stashed changes
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of standard payments in the last 12 months
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.num_std_12mts}
                    onChange={(e) => handleChange("num_std_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Number of standard payments in the last 12 months"
                    />
            </div>
=======
                  <input
                    type="number"
                    step="0.01"
                    value={formData.num_std_12mts}
                    onChange={(e) => handleChange("num_std_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_std_12mts"
                  />
                </div>
>>>>>>> Stashed changes

                <div>
                  <label style={commonLabelStyles}>
                    Number of sub-standard payments
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.num_sub}
                    onChange={(e) => handleChange("num_sub", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Number of sub-standard payments"
                    />
=======
                  <input
                    type="number"
                    step="1"
                    value={formData.num_sub}
                    onChange={(e) => handleChange("num_sub", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_sub"
                  />
>>>>>>> Stashed changes
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of sub-standard payments in the last 6 months
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.num_sub_6mts}
                    onChange={(e) => handleChange("num_sub_6mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Number of sub-standard payments in the last 6 months"
                    />
=======
                  <input
                    type="number"
                    step="1"
                    value={formData.num_sub_6mts}
                    onChange={(e) => handleChange("num_sub_6mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_sub_6mts"
                  />
>>>>>>> Stashed changes
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of sub-standard payments in the last 12 months
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.num_sub_12mts}
                    onChange={(e) => handleChange("num_sub_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Number of sub-standard payments in the last 12 months"
                    />
=======
                  <input
                    type="number"
                    step="1"
                    value={formData.num_sub_12mts}
                    onChange={(e) => handleChange("num_sub_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_sub_12mts"
                  />
>>>>>>> Stashed changes
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of debt accounts
                  </label>
                  <input
                    type="number"
<<<<<<< Updated upstream
                    value={formData.max_dpd_6_12mts}
                    onChange={(e) => handleChange("max_dpd_6_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Maximum days past due in the last 6-12 months"
=======
                    step="1"
                    value={formData.num_dbt}
                    onChange={(e) => handleChange("num_dbt", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_dbt"
>>>>>>> Stashed changes
                  />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of debt accounts in last 12 months
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                    value={formData.max_dpd_12mts}
                    onChange={(e) => handleChange("max_dpd_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Maximum days past due in the last 12 months"
=======
                  <input
                    type="number"
                    step="1"
                    value={formData.num_dbt_12mts}
                    onChange={(e) => handleChange("num_dbt_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_dbt_12mts"
                  />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of loss accounts
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.num_lss}
                    onChange={(e) => handleChange("num_lss", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_lss"
                  />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Recent level of delinquency
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.recent_level_of_deliq}
                    onChange={(e) => handleChange("recent_level_of_deliq", e.target.value)}
                    style={commonInputStyles}
                    placeholder="recent_level_of_deliq"
>>>>>>> Stashed changes
                  />
                </div>
              </div>
            </div>

            {/* Inquiries Tab */}
            <div
              style={{
                display: activeTab === "inquiries" ? "block" : "none",
              }}
            >
              <h3 style={sectionHeadingStyle}>Inquiry Details</h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.5rem",
              }}>
                <div>
                  <label style={commonLabelStyles}>
                    Number of credit card inquiries in last 12 months
                  </label>
                  <input
                    type="number"
<<<<<<< Updated upstream
                        value={formData.num_enq_6mts}
                    onChange={(e) => handleChange("num_enq_6mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Number of inquiries in the last 6 months"
                    />
=======
                    step="1"
                    value={formData.CC_enq_L12m}
                    onChange={(e) => handleChange("CC_enq_L12m", e.target.value)}
                    style={commonInputStyles}
                    placeholder="CC_enq_L12m"
                  />
>>>>>>> Stashed changes
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of personal loan inquiries in last 12 months
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                        value={formData.num_enq_12mts}
                    onChange={(e) => handleChange("num_enq_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Number of inquiries in the last 12 months"
                    />
            </div>
=======
                  <input
                    type="number"
                    step="1"
                    value={formData.PL_enq_L12m}
                    onChange={(e) => handleChange("PL_enq_L12m", e.target.value)}
                    style={commonInputStyles}
                    placeholder="PL_enq_L12m"
                  />
                </div>
>>>>>>> Stashed changes

                <div>
                  <label style={commonLabelStyles}>
                    Time since recent inquiry
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
                    value={formData.pct_PL_enq_L6m_of_ever}
                    onChange={(e) => handleChange("pct_PL_enq_L6m_of_ever", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Percent of personal loan inquiries in the last 6 months"
                    />
=======
                  <input
                    type="number"
                    step="0.01"
                    value={formData.time_since_recent_enq}
                    onChange={(e) => handleChange("time_since_recent_enq", e.target.value)}
                    style={commonInputStyles}
                    placeholder="time_since_recent_enq"
                  />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of inquiries in last 3 months
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.enq_L3m}
                    onChange={(e) => handleChange("enq_L3m", e.target.value)}
                    style={commonInputStyles}
                    placeholder="enq_L3m"
                  />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Percent of personal loan inquiries in last 6 months
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pct_PL_enq_L6m_of_ever}
                    onChange={(e) => handleChange("pct_PL_enq_L6m_of_ever", e.target.value)}
                    style={commonInputStyles}
                    placeholder="pct_PL_enq_L6m_of_ever"
                  />
>>>>>>> Stashed changes
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Percent of credit card inquiries in last 6 months
                  </label>
<<<<<<< Updated upstream
                    <input
                        type="number"
=======
                  <input
                    type="number"
                    step="0.01"
>>>>>>> Stashed changes
                    value={formData.pct_CC_enq_L6m_of_ever}
                    onChange={(e) => handleChange("pct_CC_enq_L6m_of_ever", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Percent of credit card inquiries in the last 6 months"
                  />
                </div>
<<<<<<< Updated upstream
                </div>
            </div>

            {/* Trade Lines Tab */}
            <div
              style={{
                display: activeTab === "trade-lines" ? "block" : "none",
              }}
            >
              <h3 style={sectionHeadingStyle}>Trade Lines Information</h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.5rem",
              }}>
                <div>
                  <label style={commonLabelStyles}>
                    Total open trade lines
                  </label>
                    <input
                        type="number"
                        value={formData.tot_open_tl}
                    onChange={(e) => handleChange("tot_open_tl", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Total open trade lines"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Total closed trade lines
                  </label>
                    <input
                        type="number"
                        value={formData.tot_closed_tl}
                    onChange={(e) => handleChange("tot_closed_tl", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Total closed trade lines"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Total active trade lines
                  </label>
                    <input
                        type="number"
                        value={formData.tot_active_tl}
                    onChange={(e) => handleChange("tot_active_tl", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Total active trade lines"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Total accounts opened in the last 6 months
                  </label>
                    <input
                        type="number"
                        value={formData.Total_TL_opened_L6M}
                    onChange={(e) => handleChange("Total_TL_opened_L6M", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Total accounts opened in the last 6 months"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Total accounts closed in the last 6 months
                  </label>
                    <input
                        type="number"
                        value={formData.tot_tl_closed_L6M}
                    onChange={(e) => handleChange("tot_tl_closed_L6M", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Total accounts closed in the last 6 months"
                    />
                </div>
                </div>
=======
              </div>
>>>>>>> Stashed changes
            </div>

            {/* Loan Flags Tab */}
            <div style={{ display: activeTab === "loan-flags" ? "block" : "none" }}>
              <h3 style={sectionHeadingStyle}>Loan Flags</h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.5rem",
              }}>
                <div>
                  <label style={commonLabelStyles}>
                    Credit Card Flag
                  </label>
                  <select
                    value={formData.CC_Flag}
                    onChange={(e) => handleChange("CC_Flag", e.target.value)}
                    style={selectStyles}
                  >
                    <option value="">Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Personal Loan Flag
                  </label>
                  <select
                    value={formData.PL_Flag}
                    onChange={(e) => handleChange("PL_Flag", e.target.value)}
                    style={selectStyles}
                  >
                    <option value="">Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Home Loan Flag
                  </label>
                  <select
                    value={formData.HL_Flag}
                    onChange={(e) => handleChange("HL_Flag", e.target.value)}
                    style={selectStyles}
                  >
                    <option value="">Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Gold Loan Flag
                  </label>
                  <select
                    value={formData.GL_Flag}
                    onChange={(e) => handleChange("GL_Flag", e.target.value)}
                    style={selectStyles}
                  >
                    <option value="">Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Customer Info Tab */}
            <div style={{ display: activeTab === "customer-info" ? "block" : "none" }}>
              <h3 style={sectionHeadingStyle}>Customer Information</h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.5rem",
              }}>
                <div>
                  <label style={commonLabelStyles}>
                    Net Monthly Income
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.NETMONTHLYINCOME}
                    onChange={(e) => handleChange("NETMONTHLYINCOME", e.target.value)}
                    style={commonInputStyles}
                    placeholder="NETMONTHLYINCOME"
                  />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Time with Current Employer
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.Time_With_Curr_Empr}
                    onChange={(e) => handleChange("Time_With_Curr_Empr", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Time_With_Curr_Empr"
                  />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Marital Status
                  </label>
                  <select
                    value={formData.MARITALSTATUS}
                    onChange={(e) => handleChange("MARITALSTATUS", e.target.value)}
                    style={selectStyles}
                  >
                    <option value="">Select</option>
                    <option value="Married">Married</option>
                    <option value="Single">Single</option>
                  </select>
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Education
                  </label>
                  <select
                    value={formData.EDUCATION}
                    onChange={(e) => handleChange("EDUCATION", e.target.value)}
                    style={selectStyles}
                  >
                    <option value="">Select</option>
                    <option value="12TH">12TH</option>
                    <option value="GRADUATE">GRADUATE</option>
                    <option value="OTHERS">OTHERS</option>
                    <option value="POST-GRADUATE">POST-GRADUATE</option>
                    <option value="SSC">SSC</option>
                    <option value="UNDER GRADUATE">UNDER GRADUATE</option>
                  </select>
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Gender
                  </label>
                  <select
                    value={formData.GENDER}
                    onChange={(e) => handleChange("GENDER", e.target.value)}
                    style={selectStyles}
                  >
                    <option value="">Select</option>
                    <option value="F">Female</option>
                    <option value="M">Male</option>
                  </select>
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Last Product Inquiry
                  </label>
                  <select
                    value={formData.last_prod_enq2}
                    onChange={(e) => handleChange("last_prod_enq2", e.target.value)}
                    style={selectStyles}
                  >
                    <option value="">Select</option>
                    <option value="AL">Auto Loan</option>
                    <option value="CC">Credit Card</option>
                    <option value="ConsumerLoan">Consumer Loan</option>
                    <option value="HL">Home Loan</option>
                    <option value="PL">Personal Loan</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    First Product Inquiry
                  </label>
                  <select
                    value={formData.first_prod_enq2}
                    onChange={(e) => handleChange("first_prod_enq2", e.target.value)}
<<<<<<< Updated upstream
                    style={commonInputStyles}
                    >
                        <option value="">Select</option>
                        <option value="AL">Auto Loan</option>
                        <option value="CC">Credit Card</option>
                        <option value="ConsumerLoan">Consumer Loan</option>
                        <option value="HL">Home Loan</option>
                        <option value="PL">Personal Loan</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Income Segment
                  </label>
                    <select
                        value={formData.income_segment}
                    onChange={(e) => handleChange("income_segment", e.target.value)}
                    style={commonInputStyles}
                    >
                        <option value="">Select</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    <option value="Very High">Very High</option>
                    </select>
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Customer Since
                  </label>
                    <input
                    type="date"
                        value={formData.customer_since}
                    onChange={(e) => handleChange("customer_since", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Customer relationship duration"
                    />
                </div>
=======
                    style={selectStyles}
                  >
                    <option value="">Select</option>
                    <option value="AL">Auto Loan</option>
                    <option value="CC">Credit Card</option>
                    <option value="ConsumerLoan">Consumer Loan</option>
                    <option value="HL">Home Loan</option>
                    <option value="PL">Personal Loan</option>
                    <option value="others">Others</option>
                  </select>
>>>>>>> Stashed changes
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div style={{ 
              marginTop: "2rem",
              marginBottom: "2rem", 
              display: "flex", 
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem"
            }}>
              <button
                type="button"
                onClick={handlePrevious}
                style={{
                  ...navigationButtonStyle,
                  visibility: activeTab === "account-activity" ? "hidden" : "visible"
                }}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                style={{
                  ...navigationButtonStyle,
                  visibility: activeTab === "customer-info" ? "hidden" : "visible"
                }}
              >
                Next
              </button>
            </div>

            {/* Submit Button */}
            <div style={{ width: "100%" }}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: isLoading ? "#ccc" : "linear-gradient(135deg, #3b82f6, #10b981)",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px"
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid #fff",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }} />
                    Processing...
                  </>
                ) : (
                  "Calculate Risk"
                )}
              </button>
                </div>
            </div>
        </form>
      </div>
    </div>
  )
}

<style>
  {`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
</style>