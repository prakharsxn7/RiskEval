import { useState } from "react"
import * as XLSX from 'xlsx';
import { config } from "../utils/path";
import { useNavigate } from 'react-router-dom';


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
}

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
    "trade-lines": false,
    "loan-flags": false,
    "customer-info": false
  })
  const [filledFieldsCount, setFilledFieldsCount] = useState(0)
  const navigate = useNavigate();

  // Progress indicator component
  const ProgressIndicator = () => {
    const sections = [
      "Account Activity",
      "Account Types",
      "Delinquency",
      "Inquiries",
      "Trade Lines",
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
    
    // Inquiries
    num_enq_6mts: "",
    num_enq_12mts: "",

    // Days Past Due
    max_dpd_6_12mts: "",
    max_dpd_12mts: "",
    
    // Trade Lines
    tot_open_tl: "",
    tot_closed_tl: "",
    tot_active_tl: "",
    Total_TL_opened_L6M: "",
    tot_tl_closed_L6M: "",

    // Loan Flags
    PL_Flag: "",
    pct_PL_enq_L6m_of_ever: "",
    pct_CC_enq_L6m_of_ever: "",
    HL_Flag: "",
    GL_Flag: "",

    // Customer Info
    MARITALSTATUS: "",
    EDUCATION: "",
    GENDER: "",
    last_prod_enq2: "",
    first_prod_enq2: "",
    income_segment: "",
    customer_since: "",
  })

  const handleChange = (field, value) => {
    // Check if the field was previously empty and is now filled
    const wasEmpty = !formData[field];
    const isNowFilled = value !== "";
    
    // Update form data
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Update filled fields count
    if (wasEmpty && isNowFilled) {
      setFilledFieldsCount(prevCount => prevCount + 1);
    } else if (!wasEmpty && !isNowFilled) {
      setFilledFieldsCount(prevCount => Math.max(0, prevCount - 1));
    }
    
    // Check if all fields in the current section are filled
    const sectionFields = {
      'account-activity': ['pct_tl_open_L6M', 'pct_tl_closed_L6M', 'Tot_TL_closed_L12M', 'pct_tl_closed_L12M', 'Tot_Missed_Pmnt'],
      'account-types': ['CC_TL', 'Home_TL', 'PL_TL', 'Secured_TL', 'Unsecured_TL', 'Other_TL'],
      'delinquency': ['max_recent_level_of_deliq', 'num_deliq_6_12mts', 'num_times_60p_dpd', 'num_std_12mts', 'num_sub'],
      'inquiries': ['num_enq_6mts', 'num_enq_12mts'],
      'trade-lines': ['tot_open_tl', 'tot_closed_tl', 'tot_active_tl', 'Total_TL_opened_L6M', 'tot_tl_closed_L6M'],
      'loan-flags': ['PL_Flag', 'HL_Flag', 'GL_Flag'],
      'customer-info': ['MARITALSTATUS', 'EDUCATION', 'GENDER', 'income_segment', 'customer_since']
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

      // Convert customer_since to numeric (days since date)
      if (processedData.customer_since) {
        const customerDate = new Date(processedData.customer_since)
        const today = new Date()
        processedData.customer_since = Math.floor((today - customerDate) / (1000 * 60 * 60 * 24))
      } else {
        processedData.customer_since = 0
      }

      // Convert all other fields to numbers
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
        num_dbt: 0,
        num_dbt_12mts: 0,
        num_lss: 0,
        num_lss_12mts: 0,
        recent_level_of_deliq: processedData.max_recent_level_of_deliq || 0,
        CC_enq_L12m: processedData.num_enq_12mts || 0,
        PL_enq_L12m: 0,
        time_since_recent_enq: 0,
        enq_L3m: 0,
        NETMONTHLYINCOME: 0,
        Time_With_Curr_Empr: 0,
        pct_currentBal_all_TL: 0,
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

      // Create a worksheet from the transformed data
      const ws = XLSX.utils.json_to_sheet([transformedData])
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Data")

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const formDataToSend = new FormData()
      formDataToSend.append('file', dataBlob, 'data.xlsx')

      const BASE_URL = config.url.PYTHON_API_URL
      
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
        setError(null)
        
        // Calculate credit score based on risk level (P1-P4)
        let creditScore = 0;
        let isEligible = false;
        let category = '';
        let riskDescription = '';
        
        switch(result.predictions[0]) {
          case 'P1':
            creditScore = Math.floor(Math.random() * (850 - 740) + 740);
            isEligible = true;
            category = 'Excellent';
            riskDescription = 'Very low risk profile';
            break;
          case 'P2':
            creditScore = Math.floor(Math.random() * (739 - 670) + 670);
            isEligible = true;
            category = 'Good';
            riskDescription = 'Low to moderate risk profile';
            break;
          case 'P3':
            creditScore = Math.floor(Math.random() * (669 - 580) + 580);
            isEligible = false;
            category = 'Fair';
            riskDescription = 'Moderate to high risk profile';
            break;
          case 'P4':
            creditScore = Math.floor(Math.random() * (579 - 300) + 300);
            isEligible = false;
            category = 'Poor';
            riskDescription = 'High risk profile';
            break;
          default:
            creditScore = 0;
            isEligible = false;
            category = 'Unknown';
            riskDescription = 'Unable to determine risk profile';
        }

        // Navigate to results page with risk assessment data
        navigate('/results', {
          state: {
            riskData: {
              riskLevel: result.predictions[0],
              creditScore,
              isEligible,
              category,
              riskDescription,
              successRate: isEligible ? Math.floor(Math.random() * (95 - 75) + 75) : Math.floor(Math.random() * (74 - 40) + 40)
            }
          }
        });
      } else {
        throw new Error('No predictions received from server')
      }
    } catch (err) {
      console.error('Error:', err)
      setError(`Failed to process form data: ${err.message}`)
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    const sections = ["account-activity", "account-types", "delinquency", "inquiries", "trade-lines", "loan-flags", "customer-info"];
    const currentIndex = sections.indexOf(activeTab);
    if (currentIndex < sections.length - 1) {
      setActiveTab(sections[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const sections = ["account-activity", "account-types", "delinquency", "inquiries", "trade-lines", "loan-flags", "customer-info"];
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
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.pct_tl_open_L6M}
                  onChange={(e) => handleChange("pct_tl_open_L6M", e.target.value)}
                  style={commonInputStyles}
                  placeholder="pct_tl_open_L6M"
                    />
                </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={commonLabelStyles}>
                  Percent accounts closed in last 6 months
                </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.pct_tl_closed_L6M}
                  onChange={(e) => handleChange("pct_tl_closed_L6M", e.target.value)}
                  style={commonInputStyles}
                  placeholder="pct_tl_closed_L6M"
                    />
                </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={commonLabelStyles}>
                  Total accounts closed in last 12 months
                </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.Tot_TL_closed_L12M}
                  onChange={(e) => handleChange("Tot_TL_closed_L12M", e.target.value)}
                  style={commonInputStyles}
                  placeholder="Tot_TL_closed_L12M"
                    />
                </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={commonLabelStyles}>
                  Percent accounts closed in last 12 months
                </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.pct_tl_closed_L12M}
                  onChange={(e) => handleChange("pct_tl_closed_L12M", e.target.value)}
                  style={commonInputStyles}
                  placeholder="pct_tl_closed_L12M"
                    />
                </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={commonLabelStyles}>
                  Total missed payments
                </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.Tot_Missed_Pmnt}
                  onChange={(e) => handleChange("Tot_Missed_Pmnt", e.target.value)}
                  style={commonInputStyles}
                  placeholder="Tot_Missed_Pmnt"
                    />
                </div>
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
                    <input
                        type="number"
                        step="1"
                        value={formData.CC_TL}
                    onChange={(e) => handleChange("CC_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="CC_TL"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Count of housing loan accounts
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.Home_TL}
                    onChange={(e) => handleChange("Home_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Home_TL"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Count of personal loan accounts
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.PL_TL}
                    onChange={(e) => handleChange("PL_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="PL_TL"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Count of secured accounts
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.Secured_TL}
                    onChange={(e) => handleChange("Secured_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Secured_TL"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Count of unsecured accounts
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.Unsecured_TL}
                    onChange={(e) => handleChange("Unsecured_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Unsecured_TL"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Count of other accounts
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.Other_TL}
                    onChange={(e) => handleChange("Other_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Other_TL"
                    />
            </div>

                <div>
                  <label style={commonLabelStyles}>
                    Age of oldest opened account
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.Age_Oldest_TL}
                    onChange={(e) => handleChange("Age_Oldest_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Age_Oldest_TL"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Age of newest opened account
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.Age_Newest_TL}
                    onChange={(e) => handleChange("Age_Newest_TL", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Age_Newest_TL"
                    />
            </div>

                <div>
                  <label style={commonLabelStyles}>
                    Time since recent payment made
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.time_since_recent_payment}
                    onChange={(e) => handleChange("time_since_recent_payment", e.target.value)}
                    style={commonInputStyles}
                    placeholder="time_since_recent_payment"
                    />
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
                    <input
                        type="number"
                        step="1"
                        value={formData.max_recent_level_of_deliq}
                    onChange={(e) => handleChange("max_recent_level_of_deliq", e.target.value)}
                    style={commonInputStyles}
                    placeholder="max_recent_level_of_deliq"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of times delinquent between last 6-12 months
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.num_deliq_6_12mts}
                    onChange={(e) => handleChange("num_deliq_6_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_deliq_6_12mts"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of times 60+ days past due
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.num_times_60p_dpd}
                    onChange={(e) => handleChange("num_times_60p_dpd", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_times_60p_dpd"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of standard payments in the last 12 months
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.num_std_12mts}
                    onChange={(e) => handleChange("num_std_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_std_12mts"
                    />
            </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of sub-standard payments
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.num_sub}
                    onChange={(e) => handleChange("num_sub", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_sub"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of sub-standard payments in the last 6 months
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.num_sub_6mts}
                    onChange={(e) => handleChange("num_sub_6mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_sub_6mts"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of sub-standard payments in the last 12 months
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.num_sub_12mts}
                    onChange={(e) => handleChange("num_sub_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_sub_12mts"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Maximum days past due in the last 6-12 months
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.max_dpd_6_12mts}
                    onChange={(e) => handleChange("max_dpd_6_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="max_dpd_6_12mts"
                  />
            </div>

                <div>
                  <label style={commonLabelStyles}>
                    Maximum days past due in the last 12 months
                  </label>
                    <input
                        type="number"
                        step="1"
                    value={formData.max_dpd_12mts}
                    onChange={(e) => handleChange("max_dpd_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="max_dpd_12mts"
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
                    Number of inquiries in the last 6 months
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.num_enq_6mts}
                    onChange={(e) => handleChange("num_enq_6mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_enq_6mts"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Number of inquiries in the last 12 months
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.num_enq_12mts}
                    onChange={(e) => handleChange("num_enq_12mts", e.target.value)}
                    style={commonInputStyles}
                    placeholder="num_enq_12mts"
                    />
            </div>

                <div>
                  <label style={commonLabelStyles}>
                    Percent of personal loan inquiries in the last 6 months
                  </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.pct_PL_enq_L6m_of_ever}
                    onChange={(e) => handleChange("pct_PL_enq_L6m_of_ever", e.target.value)}
                    style={commonInputStyles}
                    placeholder="pct_PL_enq_L6m_of_ever"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Percent of credit card inquiries in the last 6 months
                  </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.pct_CC_enq_L6m_of_ever}
                    onChange={(e) => handleChange("pct_CC_enq_L6m_of_ever", e.target.value)}
                    style={commonInputStyles}
                    placeholder="pct_CC_enq_L6m_of_ever"
                  />
                </div>
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
                        step="1"
                        value={formData.tot_open_tl}
                    onChange={(e) => handleChange("tot_open_tl", e.target.value)}
                    style={commonInputStyles}
                    placeholder="tot_open_tl"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Total closed trade lines
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.tot_closed_tl}
                    onChange={(e) => handleChange("tot_closed_tl", e.target.value)}
                    style={commonInputStyles}
                    placeholder="tot_closed_tl"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Total active trade lines
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.tot_active_tl}
                    onChange={(e) => handleChange("tot_active_tl", e.target.value)}
                    style={commonInputStyles}
                    placeholder="tot_active_tl"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Total accounts opened in the last 6 months
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.Total_TL_opened_L6M}
                    onChange={(e) => handleChange("Total_TL_opened_L6M", e.target.value)}
                    style={commonInputStyles}
                    placeholder="Total_TL_opened_L6M"
                    />
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Total accounts closed in the last 6 months
                  </label>
                    <input
                        type="number"
                        step="1"
                        value={formData.tot_tl_closed_L6M}
                    onChange={(e) => handleChange("tot_tl_closed_L6M", e.target.value)}
                    style={commonInputStyles}
                    placeholder="tot_tl_closed_L6M"
                    />
                </div>
                </div>
            </div>

            {/* Loan Flags Tab */}
            <div
              style={{
                display: activeTab === "loan-flags" ? "block" : "none",
              }}
            >
              <h3 style={sectionHeadingStyle}>Loan Flags</h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.5rem",
              }}>
                <div>
                  <label style={commonLabelStyles}>
                    Personal Loan Flag
                  </label>
                    <select
                        value={formData.PL_Flag}
                    onChange={(e) => handleChange("PL_Flag", e.target.value)}
                    style={commonInputStyles}
                    >
                        <option value="">Select</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Home Loan Flag
                  </label>
                    <select
                        value={formData.HL_Flag}
                    onChange={(e) => handleChange("HL_Flag", e.target.value)}
                    style={commonInputStyles}
                    >
                        <option value="">Select</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Gold Loan Flag
                  </label>
                    <select
                        value={formData.GL_Flag}
                    onChange={(e) => handleChange("GL_Flag", e.target.value)}
                    style={commonInputStyles}
                    >
                        <option value="">Select</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                </div>
                </div>
            </div>

            {/* Customer Info Tab */}
            <div
              style={{
                display: activeTab === "customer-info" ? "block" : "none",
              }}
            >
              <h3 style={sectionHeadingStyle}>Customer Information</h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.5rem",
              }}>
                <div>
                  <label style={commonLabelStyles}>
                    Marital Status
                  </label>
                    <select
                        value={formData.MARITALSTATUS}
                    onChange={(e) => handleChange("MARITALSTATUS", e.target.value)}
                    style={commonInputStyles}
                    >
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                    </select>
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Education
                  </label>
                    <select
                        value={formData.EDUCATION}
                    onChange={(e) => handleChange("EDUCATION", e.target.value)}
                    style={commonInputStyles}
                    >
                        <option value="">Select</option>
                        <option value="High School">High School</option>
                        <option value="Bachelor">Bachelor</option>
                        <option value="Master">Master</option>
                        <option value="PhD">PhD</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Gender
                  </label>
                    <select
                        value={formData.GENDER}
                    onChange={(e) => handleChange("GENDER", e.target.value)}
                    style={commonInputStyles}
                    >
                        <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                  <label style={commonLabelStyles}>
                    Last Product Inquiry
                  </label>
                    <select
                        value={formData.last_prod_enq2}
                    onChange={(e) => handleChange("last_prod_enq2", e.target.value)}
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
                    First Product Inquiry
                  </label>
                    <select
                        value={formData.first_prod_enq2}
                    onChange={(e) => handleChange("first_prod_enq2", e.target.value)}
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
                    placeholder="customer_since"
                    />
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
                disabled={isLoading || filledFieldsCount < 35}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: isLoading || filledFieldsCount < 35 ? "#ccc" : "linear-gradient(135deg, #3b82f6, #10b981)",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: isLoading || filledFieldsCount < 35 ? "not-allowed" : "pointer",
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