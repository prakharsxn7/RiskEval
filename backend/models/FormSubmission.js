import mongoose from 'mongoose';

const formSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // File processing fields
  filePath: String,
  predictions: [String],
  customerIds: [Number],
  processedAt: Date,
  
  // Account Activity
  pct_tl_open_L6M: Number,
  pct_tl_closed_L6M: Number,
  Tot_TL_closed_L12M: Number,
  pct_tl_closed_L12M: Number,
  Tot_Missed_Pmnt: Number,
  
  // Account Types
  CC_TL: Number,
  Home_TL: Number,
  PL_TL: Number,
  Secured_TL: Number,
  Unsecured_TL: Number,
  Other_TL: Number,
  
  // Account Age
  Age_Oldest_TL: Number,
  Age_Newest_TL: Number,
  
  // Payment History
  time_since_recent_payment: Number,
  max_recent_level_of_deliq: Number,
  num_deliq_6_12mts: Number,
  num_times_60p_dpd: Number,
  num_std_12mts: Number,
  
  // Payment Performance
  num_sub: Number,
  num_sub_6mts: Number,
  num_sub_12mts: Number,
  
  // Inquiries
  num_enq_6mts: Number,
  num_enq_12mts: Number,
  
  // Delinquency
  max_dpd_6_12mts: Number,
  max_dpd_12mts: Number,
  
  // Trade Lines
  tot_open_tl: Number,
  tot_closed_tl: Number,
  tot_active_tl: Number,
  Total_TL_opened_L6M: Number,
  tot_tl_closed_L6M: Number,
  
  // Loan Flags and Inquiries
  PL_Flag: String,
  pct_PL_enq_L6m_of_ever: Number,
  pct_CC_enq_L6m_of_ever: Number,
  HL_Flag: String,
  GL_Flag: String,
  
  // Personal Information
  MARITALSTATUS: String,
  EDUCATION: String,
  GENDER: String,
  last_prod_enq2: String,
  first_prod_enq2: String,
  income_segment: String,
  customer_since: Number,

  // Risk Assessment Results
  riskScore: Number,
  riskLevel: String,
  confidence: Number,
  
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

export default FormSubmission; 