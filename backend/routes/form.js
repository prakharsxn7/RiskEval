import express from 'express';
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import FormSubmission from '../models/FormSubmission.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import multer from 'multer';
import dotenv from 'dotenv';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../data/uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, 'Unseen_Dataset.xlsx')
    }
});

const upload = multer({ storage: storage });

// Excel file path
const EXCEL_FILE_PATH = path.join(__dirname, '../data', 'form_submissions.xlsx');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, '../data'))) {
    fs.mkdirSync(path.join(__dirname, '../data'));
}

// Create Excel file if it doesn't exist
if (!fs.existsSync(EXCEL_FILE_PATH)) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Form Submissions');
    XLSX.writeFile(workbook, EXCEL_FILE_PATH);
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Route to handle form submissions
router.post('/submit', verifyToken, async (req, res) => {
    try {
        const formData = req.body;
        
        // Store in MongoDB
        const submission = new FormSubmission({
            userId: req.user.userId,
            ...formData
        });
        await submission.save();

        // Store in Excel
        const workbook = XLSX.readFile(EXCEL_FILE_PATH);
        const worksheet = workbook.Sheets['Form Submissions'];
        
        // Convert existing data to JSON
        const existingData = XLSX.utils.sheet_to_json(worksheet);
        
        // Add new submission with timestamp and user info
        const newSubmission = {
            ...formData,
            userId: req.user.userId,
            submissionDate: new Date().toISOString()
        };
        
        // Append new data
        existingData.push(newSubmission);
        
        // Convert back to worksheet
        const newWorksheet = XLSX.utils.json_to_sheet(existingData);
        
        // Replace existing worksheet
        workbook.Sheets['Form Submissions'] = newWorksheet;
        
        // Write back to file
        XLSX.writeFile(workbook, EXCEL_FILE_PATH);
        
        res.status(200).json({ 
            message: 'Form data saved successfully',
            submissionId: submission._id
        });
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).json({ error: 'Failed to save form data' });
    }
});

// Route to get user's form submissions
router.get('/submissions', verifyToken, async (req, res) => {
    try {
        const submissions = await FormSubmission.find({ userId: req.user.userId })
            .sort({ submittedAt: -1 });
        res.json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

// Route to process file with ML model
router.post('/process-file', verifyToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Send file to FastAPI service
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));

        const base_url=process.env.MODEL_URL;
        const response = await axios.post(`${base_url}/process-file`, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        // Store results in MongoDB
        const submission = new FormSubmission({
            userId: req.user.userId,
            filePath: req.file.path,
            predictions: response.data.predictions,
            customerIds: response.data.customer_ids,
            processedAt: new Date()
        });
        await submission.save();

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json(response.data);
    } catch (error) {
        console.error('Error processing file:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to process file' });
    }
});

export default router; 