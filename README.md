# 🧠 RiskEval – A Credit Risk Evaluation Platform

**RiskEval** is a machine learning–powered platform that predicts the loan creditworthiness of applicants based on financial and behavioral data. Using an **XGBoost model**, it classifies users into **risk priority levels (P1 to P4)** to guide lending decisions and minimize the risk of default. 

The platform includes two separate dashboards for different user types:
- 🧑‍💼 **Customers** can submit their financial details, view their risk score and analytics, and receive a detailed report on how to improve their chances of loan approval.
- 🏦 **Bank Associates** can download a standalone tool that processes Excel files with multiple applicants, automatically ranking them by credit risk for informed lending decisions.

A dedicated **landing page** is also available to explain the project and guide users through its features.

---

## 🚀 Key Features

- 🔍 **Creditworthiness Prediction**: Uses an XGBoost ML model to assess risk of default and assign risk levels (P1 > P2 > P3 > P4).
- 🧑‍💻 **Dual Dashboards**:
  - **Customer Interface** – A web form for submitting financial data, with instant feedback, priority level, and improvement suggestions.
  - **Bank Interface** – A local desktop app for bulk Excel upload and automated risk prioritization for loan applicants.
- 📄 **Dynamic Report Generation**: Customers receive a detailed report with personalized insights to strengthen future loan applications.
- 🖥️ **Offline-Ready Bank Tool**: Works independently on local systems, ensuring security and accessibility without web dependencies.
- 🌐 **Informative Landing Page**: Explains the platform, workflow, and benefits for both user groups.

---

## 🎯 Outcomes & Impact

- 🏦 **For Banks**: Enables smarter, data-driven lending decisions by ranking applicants from lowest to highest risk. Reduces the probability of loan default and optimizes loan disbursal processes.
- 👤 **For Customers**: Offers transparency into their loan eligibility, with actionable feedback and visual analytics to help improve credit profiles.
- ⚙️ **Operational Efficiency**: Automates manual review, streamlines applicant processing, and minimizes human bias in approval workflows.

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Material UI, Chart.js, Recharts, Axios, React Router, React Toastify
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer, CORS, dotenv
- **ML Microservice:** Python (FastAPI, Uvicorn, XGBoost, scikit-learn, pandas, numpy)
- **Other:** Excel file handling (xlsx, openpyxl)

---

## 📁 Folder Structure
```
RiskEval/
│
├── backend/         # Node.js/Express API & FastAPI ML microservice
│   ├── routes/      # API endpoints (auth, form)
│   ├── models/      # Mongoose schemas
│   ├── middleware/  # Custom middleware
│   ├── main.py      # FastAPI ML inference
│   ├── server.js    # Express server
│   ├── ...
│
├── frontend/        # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── services/    # API logic
│   │   └── App.jsx      # Main app logic
│   ├── ...
│
├── ml_model/        # ML model training & inference
│   ├── train_and_save_model.py  # Model training
│   ├── exe_xgb.py              # Model execution
│   ├── models/                 # Saved models
│   ├── ...
│
├── README.md
└── ...
```

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/RiskEval.git
cd RiskEval
```

### 2. Backend Setup
```bash
cd backend
npm install           # Install Node.js dependencies

```
- Create a `.env` file in `backend/` with:
  ```env
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  FRONTEND_URL=http://localhost:5173
  MODEL_URL=http://localhost:8000
  ```
- Start Express server:
  ```bash
  npm start
  ```
- Start FastAPI ML microservice:
  ```bash
  source venv_py311/bin/activate
  pip install -r requirements.txt  # Install Python dependencies (FastAPI)
  uvicorn main:app --reload --host 0.0.0.0 --port 8000
  ```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
- The app will be available at `http://localhost:5173`

### 4. ML Model Setup (for retraining)
```bash
cd ../ml_model
pip install -r requirements.txt
python train_and_save_model.py
```
- Place the generated model files in `ml_model/models/`

---

## 🧩 Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token signing
- `FRONTEND_URL`: URL of the frontend (for CORS)
- `MODEL_URL`: URL of the FastAPI ML microservice

---

## 🤝 Contributing
1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📄 License
[MIT](LICENSE)

---

## 🙋‍♂️ Contact
For questions, open an issue or contact the maintainer at [prakharsxn7@gmail.com].
