import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import formRoutes from './routes/form.js';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// MongoDB Connection Options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/risk-eval', mongooseOptions)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit with failure
  });

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB connection closure:', err);
    process.exit(1);
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);

// Software download endpoint
app.get('/api/download/bank-software', async (req, res) => {
  // Set additional CORS headers for this specific endpoint
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  try {
    const fs = await import('fs');
    const filePath = path.join(__dirname, 'files', 'software.zip');
    
    console.log('Download requested. File path:', filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('File not found at path:', filePath);
      
      // In development or when cloned from repository, provide helpful instructions
      return res.status(404).json({ 
        error: 'Software file not found.', 
        message: 'The software.zip file is not included in the repository due to size limitations. Please create a files directory in the backend folder and place your software.zip file there. For development, any zip file will work.',
        developmentTip: 'You can create a small test file with: zip -r backend/files/software.zip README.md'
      });
    }
    
    console.log('File exists, preparing download...');
    
    // Set headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename=RiskEval-BankSoftware.zip');
    res.setHeader('Content-Type', 'application/zip');
    
    // Send the file
    res.download(filePath, 'RiskEval-BankSoftware.zip', (err) => {
      if (err) {
        console.error('Download error:', err);
        // If headers are already sent, we can't send another response
        if (!res.headersSent) {
          res.status(500).json({ error: 'Server error during download' });
        }
      } else {
        console.log('Download completed successfully');
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Server error during download' });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Risk-Eval API' });
});

// Start server with port fallback and error handling
const PORT = process.env.PORT || 5000;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
        startServer(PORT + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer(); 