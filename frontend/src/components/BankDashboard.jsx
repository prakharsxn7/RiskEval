import React, { useState } from 'react';
import { FaDownload, FaServer, FaShieldAlt, FaInfoCircle, FaArrowRight, FaCreditCard, FaChartBar, FaLock, FaUserShield, FaCogs } from 'react-icons/fa';
import crmImage from '../assets/CRM.jpg';

const BankDashboard = () => {
  const [showSteps, setShowSteps] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [bankName, setBankName] = useState('');
  const [bankId, setBankId] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  const handleStartDownload = () => {
    setShowSteps(true);
  };
  
  const handleNextStep = () => {
    if (activeStep === 1 && (!bankName || !bankId)) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (activeStep === 2 && !agreementChecked) {
      alert('Please agree to the terms and conditions');
      return;
    }

    if (activeStep === 3 && !paymentCompleted) {
      // Simulate payment completion
      setPaymentCompleted(true);
      return;
    }

    setActiveStep(activeStep + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep(activeStep - 1);
  };

  const handleDownload = () => {
    // Open Google Drive link in a new tab
    const googleDriveLink = "https://drive.google.com/file/d/148D3jh_k_fa_ytrvmi1-DMK9nQrEuWkQ/view?usp=share_link"; // Replace with your actual Google Drive link
    window.open(googleDriveLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="dashboard-container bank-dashboard">
      {!showSteps ? (
        <div className="software-showcase">
          <div className="showcase-header">
            <h1>Risk Evaluation Software - Credit Risk Model </h1>
            <p>Advanced risk assessment solution designed specifically for financial institutions</p>
          </div>
          
          <div className="software-preview">
            <div className="preview-image">
              <img src={crmImage} alt="Risk Evaluation Dashboard Preview" />
              <div className="image-overlay"></div>
            </div>
          </div>
          
          <div className="software-features">
            <h2>Key Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <FaChartBar className="feature-icon" />
                <h3>Advanced Analytics</h3>
                <p>Leverage machine learning models to predict loan default risk with up to 95% accuracy.</p>
              </div>
              
              <div className="feature-card">
                <FaLock className="feature-icon" />
                <h3>Data Security</h3>
                <p>Bank-grade encryption and security protocols to protect sensitive customer information.</p>
              </div>
              
              <div className="feature-card">
                <FaCogs className="feature-icon" />
                <h3>Customizable Rules</h3>
                <p>Configure risk assessment criteria based on your bank's specific requirements and policies.</p>
              </div>
              
              <div className="feature-card">
                <FaUserShield className="feature-icon" />
                <h3>Regulatory Compliance</h3>
                <p>Stay compliant with financial regulations including KYC, AML, and lending standards.</p>
              </div>
            </div>
          </div>
          
          <div className="software-requirements">
            <h2>System Requirements</h2>
            <div className="requirements-list">
              <div className="requirement">
                <span className="requirement-label">Operating System:</span>
                <span className="requirement-value">Windows 10/11 Pro, or MacOS 12+</span>
              </div>
              <div className="requirement">
                <span className="requirement-label">Processor:</span>
                <span className="requirement-value">2.5 GHz quad-core or better</span>
              </div>
              <div className="requirement">
                <span className="requirement-label">Memory:</span>
                <span className="requirement-value">16 GB RAM minimum</span>
              </div>
              <div className="requirement">
                <span className="requirement-label">Storage:</span>
                <span className="requirement-value">10 GB available space</span>
              </div>
              <div className="requirement">
                <span className="requirement-label">Database:</span>
                <span className="requirement-value">MongoDB 4.4 or higher</span>
              </div>
            </div>
          </div>
          
          <div className="download-prompt">
            <h2>Ready to transform your risk assessment process?</h2>
            <p>Get started with our enterprise risk evaluation software today.</p>
            <button className="download-btn" onClick={handleStartDownload}>
              <FaDownload /> Download Now
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="dashboard-header">
            <h1>Risk Evaluation Software Installation</h1>
            <p>Follow the steps below to download and set up your bank's risk evaluation system</p>
          </div>

          <div className="steps-indicator">
            <div className={`step ${activeStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Registration</div>
            </div>
            <div className={`step ${activeStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">License Agreement</div>
            </div>
            <div className={`step ${activeStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Payment</div>
            </div>
            <div className={`step ${activeStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Download</div>
            </div>
          </div>

          <div className="dashboard-grid">
            {activeStep === 1 && (
              <div className="dashboard-card registration-card">
                <div className="card-header">
                  <FaInfoCircle className="card-icon" />
                  <h3>Bank Registration Information</h3>
                </div>
                <div className="card-content">
                  <p>To get started, you will need to provide your bank's details.</p>
                  <div className="form-group">
                    <label>
                      Bank Name<sup>*</sup>
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required
                      placeholder="Enter your bank's name"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Bank ID/License Number<sup>*</sup>
                    </label>
                    <input
                      type="text"
                      value={bankId}
                      onChange={(e) => setBankId(e.target.value)}
                      required
                      placeholder="Enter your bank's ID or license number"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="dashboard-card license-card">
                <div className="card-header">
                  <FaShieldAlt className="card-icon" />
                  <h3>License Agreement</h3>
                </div>
                <div className="card-content">
                  <div className="license-agreement">
                    <h4>Terms of Use</h4>
                    <div className="agreement-text">
                      <p>This Risk Evaluation Software ("Software") is licensed, not sold, to you by Risk-Eval Inc. ("Company") for use strictly in accordance with the terms and conditions of this License Agreement.</p>
                      <p>By downloading, installing, or using the Software, you agree to be bound by the terms of this Agreement. If you do not agree to the terms of this Agreement, do not install or use the Software.</p>
                      <h5>1. License Grant</h5>
                      <p>Subject to the terms of this Agreement, Company grants you a limited, non-exclusive, non-transferable license to download, install and use the Software solely for your bank's internal business operations.</p>
                      <h5>2. Restrictions</h5>
                      <p>You may not: (a) modify, translate, reverse engineer, decompile, or disassemble the Software; (b) create derivative works based on the Software; (c) rent, lease, loan, sell, distribute or sublicense the Software; (d) remove or alter any proprietary notices on the Software.</p>
                      <h5>3. Data Security</h5>
                      <p>You are responsible for maintaining the confidentiality of all data processed by the Software and ensuring its use complies with all applicable laws and regulations regarding data protection and privacy.</p>
                    </div>
                    <div className="agreement-check">
                      <input
                        type="checkbox"
                        id="agreement-checkbox"
                        checked={agreementChecked}
                        onChange={() => setAgreementChecked(!agreementChecked)}
                      />
                      <label htmlFor="agreement-checkbox">I have read and agree to the License Agreement</label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="dashboard-card payment-card">
                <div className="card-header">
                  <FaCreditCard className="card-icon" />
                  <h3>Payment Information</h3>
                </div>
                <div className="card-content">
                  <div className="payment-details">
                    <h4>Subscription Details</h4>
                    <div className="payment-plan">
                      <div className="plan-header">Enterprise Plan</div>
                      <div className="plan-price">$4,999.00<span>/year</span></div>
                      <div className="plan-features">
                        <div className="feature">✓ Full Access to Risk Evaluation Tool</div>
                        <div className="feature">✓ Unlimited Risk Assessments</div>
                        <div className="feature">✓ Priority Technical Support</div>
                        <div className="feature">✓ Quarterly Software Updates</div>
                        <div className="feature">✓ Custom Risk Models</div>
                      </div>
                    </div>

                    <div className="payment-button">
                      <button 
                        onClick={() => setPaymentCompleted(true)}
                        className={paymentCompleted ? "completed" : ""}
                      >
                        {paymentCompleted ? "Payment Complete" : "Process Payment"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="dashboard-card download-card">
                <div className="card-header">
                  <FaServer className="card-icon" />
                  <h3>Download Software</h3>
                </div>
                <div className="card-content">
                  <div className="download-info">
                    <h4>Ready to Install</h4>
                    <p>Thank you for completing the registration process. Your Risk Evaluation Software is now ready for download.</p>
                    
                    <div className="system-requirements">
                      <h5>System Requirements:</h5>
                      <ul>
                        <li>Operating System: Windows 10/11 Pro, or MacOS 12+</li>
                        <li>Processor: 2.5 GHz quad-core or better</li>
                        <li>Memory: 16 GB RAM minimum</li>
                        <li>Storage: 10 GB available space</li>
                        <li>Network: Broadband internet connection</li>
                        <li>Database: MongoDB 4.4 or higher</li>
                      </ul>
                    </div>
                    
                    <div className="installation-steps">
                      <h5>Installation Instructions:</h5>
                      <ol>
                        <li>Download the installation package</li>
                        <li>Extract the ZIP file to your preferred location</li>
                        <li>Run setup.exe (Windows) or installer.pkg (MacOS)</li>
                        <li>Follow the on-screen instructions</li>
                        <li>When prompted, enter your Bank ID: <strong>{bankId}</strong></li>
                      </ol>
                    </div>
                    
                    <div className="download-button">
                      <button onClick={handleDownload} className="primary-btn">
                        <FaDownload /> Download Now
                      </button>
                      <p className="file-info">File size: 256 MB</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="stepper-buttons">
            {activeStep > 1 && (
              <button className="previous-btn" onClick={handlePreviousStep}>
                Back
              </button>
            )}
            {activeStep < 4 && (
              <button className="next-btn" onClick={handleNextStep}>
                {activeStep === 3 && !paymentCompleted ? "Complete Payment" : "Continue"} <FaArrowRight />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BankDashboard; 