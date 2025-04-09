import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaInfoCircle, FaChartBar, FaLightbulb } from 'react-icons/fa';
import './Results.css';

const Results = () => {
  const [activeTab, setActiveTab] = useState('insights');
  const location = useLocation();
  const riskData = location.state?.riskData || {};

  // Risk level color mapping
  const riskColors = {
    P1: '#4CAF50', // Green - Excellent
    P2: '#FFC107', // Yellow - Good
    P3: '#FF9800', // Orange - Fair
    P4: '#F44336', // Red - Poor
  };

  // Get color based on risk level
  const getRiskColor = (risk) => riskColors[risk] || '#757575';

  // Credit factors data based on risk level
  const getCreditFactors = () => {
    const baseScore = riskData.creditScore || 0;
    return [
      { name: 'Payment History', score: Math.min(100, baseScore * 0.35 / 850 * 100) },
      { name: 'Credit Utilization', score: Math.min(100, baseScore * 0.30 / 850 * 100) },
      { name: 'Credit Age', score: Math.min(100, baseScore * 0.15 / 850 * 100) },
      { name: 'Account Mix', score: Math.min(100, baseScore * 0.10 / 850 * 100) },
      { name: 'Recent Inquiries', score: Math.min(100, baseScore * 0.10 / 850 * 100) },
    ];
  };

  // Get risk level description
  const getRiskDescription = (riskLevel) => {
    switch(riskLevel) {
      case 'P1':
        return 'Excellent credit risk - Highly likely to repay loans';
      case 'P2':
        return 'Good credit risk - Generally reliable in loan repayment';
      case 'P3':
        return 'Fair credit risk - Some concerns about repayment ability';
      case 'P4':
        return 'Poor credit risk - High risk of default';
      default:
        return 'Unable to determine risk level';
    }
  };

  // Get suggestions based on risk level
  const getSuggestions = (riskLevel) => {
    const commonSuggestions = [
      'Make all payments on time',
      'Keep credit utilization below 30%',
      'Maintain older credit accounts',
      'Limit new credit applications'
    ];

    const specificSuggestions = {
      P1: [
        'Consider diversifying credit mix for even better scores',
        'Monitor credit report regularly to maintain excellent status',
        'You may qualify for premium credit products'
      ],
      P2: [
        'Work on reducing credit utilization',
        'Continue consistent payment history',
        'Consider consolidating any high-interest debt'
      ],
      P3: [
        'Focus on making all payments on time',
        'Reduce overall debt levels',
        'Avoid applying for new credit',
        'Consider credit counseling services'
      ],
      P4: [
        'Prioritize paying off overdue accounts',
        'Set up payment reminders',
        'Consider credit repair services',
        'Look into secured credit products'
      ]
    };

    return [...commonSuggestions, ...(specificSuggestions[riskLevel] || [])];
  };

  return (
    <div className="results-container">
      <h1 className="results-title">Risk Assessment Results</h1>
      
      {/* Top KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>Risk Level</h3>
          <div className="risk-tag" style={{ backgroundColor: getRiskColor(riskData.riskLevel) }}>
            {riskData.riskLevel || 'N/A'}
          </div>
          <p className="risk-description">{getRiskDescription(riskData.riskLevel)}</p>
        </div>
        
        <div className="kpi-card">
          <h3>Credit Score</h3>
          <div className="score-circle">
            <CircularProgressbar
              value={riskData.creditScore || 0}
              maxValue={850}
              text={riskData.creditScore || '0'}
              styles={buildStyles({
                pathColor: getRiskColor(riskData.riskLevel),
                textColor: '#333',
                trailColor: '#d6d6d6',
              })}
            />
          </div>
          <p className="score-category">{riskData.category || 'N/A'}</p>
        </div>

        <div className="kpi-card">
          <h3>Loan Eligibility</h3>
          <div className="eligibility-status" style={{ 
            color: riskData.isEligible ? '#4CAF50' : '#F44336',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            {riskData.isEligible ? '✅ Eligible' : '❌ Not Eligible'}
          </div>
          <p className="success-rate">
            Success Rate: {riskData.successRate || 0}%
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Credit Factors Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getCreditFactors()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill={getRiskColor(riskData.riskLevel)} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="tabs-section">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            <FaChartBar /> Insights
          </button>
          <button
            className={`tab-button ${activeTab === 'suggestions' ? 'active' : ''}`}
            onClick={() => setActiveTab('suggestions')}
          >
            <FaLightbulb /> Suggestions
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'insights' ? (
            <div className="insights-content">
              <ul>
                <li>Your credit score of {riskData.creditScore || 0} falls in the {riskData.category || 'N/A'} category</li>
                <li>Risk Level {riskData.riskLevel || 'N/A'} indicates {riskData.riskDescription || 'N/A'}</li>
                <li>Based on our analysis, you have a {riskData.successRate || 0}% likelihood of loan approval</li>
                <li>Your credit profile shows {riskData.isEligible ? 'positive' : 'concerning'} indicators for lending</li>
              </ul>
            </div>
          ) : (
            <div className="suggestions-content">
              <ul>
                {getSuggestions(riskData.riskLevel).map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results; 