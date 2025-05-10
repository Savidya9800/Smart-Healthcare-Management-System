# 🏥 Smart Healthcare Management System (MEDI FLOW)

### 🚀 A modern web-based healthcare management system designed to streamline medical services, enhance patient care, and optimize hospital workflows.

---

## 📌 Features

### ✅ **Patient Management**
- Complete patient profile management with detailed medical information
- Secure blockchain-based medical records
- Easy access to health history and prescriptions
- Real-time profile updates with validation

### ✅ **Doctor & Appointment Management**
- AI-powered smart appointment scheduling
- Online doctor booking with specialization filtering
- Appointment status tracking and notifications
- Doctor leave management system
- Complete diagnosis and prescription system

### ✅ **Pharmacy Management**
- Comprehensive medicine inventory control
- Stock expiration monitoring and alerts
- Batch tracking and location management
- Low stock notifications

### ✅ **Reception Management**
- AI-powered dynamic wait-time estimation
- Automated invoice & payment tracking
- Patient check-in/check-out management
- Visitor management system

### ✅ **Novelty Features**
- **Interactive 3D Heart Model** for visualizing cardiac symptoms
- **AI Health Chatbot** for preliminary symptom assessment
- **Vitals Monitoring System** with normal range indicators
- Real-time health analytics and metrics visualization

### ✅ **Administrative Features**
- Multi-user role-based access control (Admin, Doctor, Patient, Receptionist)
- Comprehensive reporting with PDF export
- Intuitive dashboards for each user role
- Appointment and diagnosis analytics

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js with functional components and hooks
- **Styling:** Tailwind CSS, Material-UI components
- **State Management:** React Context API
- **Routing:** React Router
- **3D Rendering:** Three.js (for heart model visualization)
- **PDF Generation:** jsPDF

### Backend
- **Server:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Email Service:** Nodemailer for appointment notifications
- **Cloud Storage:** Cloudinary for image upload and management
- **AI Integration:** Python-based health model

### AI Components
- **Health Chatbot:** Natural language processing for symptom analysis
- **Diagnosis Assistant:** Machine learning for preliminary diagnosis suggestions
- **Wait-time Estimation:** Predictive algorithms for queue management

---

## 🎨 Design System

The application follows a consistent color scheme:
- **Primary Blue:** #2b2c6c - Used for headers, important actions
- **Accent Pink:** #e6317d - Used for highlights, calls-to-action
- **Secondary Green:** #2fb297 - Used for success states, confirmations
- **Neutral Gray:** #71717d - Used for text, subtle elements

---

## 📂 Project Structure

```
MEDI FLOW/
├── BACKEND/                # Node.js backend server
│   ├── .env                # Environment variables (not tracked in git)
│   ├── index.js            # Server entry point
│   ├── Controllers/        # API route controllers
│   │   ├── AnalysisController.js
│   │   ├── appoinmentController.js
│   │   ├── authController.js
│   │   ├── StockController.js
│   │   └── DoctorManagement/   # Doctor-specific controllers
│   ├── Middleware/        # Authentication and request middlewares
│   ├── Models/            # MongoDB schema definitions
│   └── Routes/            # API route definitions
│   └── ai-model/          # Python-based AI health models
│       ├── main.py        # FastAPI entry point
│       └── model.py       # Health analysis model
│
├── frontend/              # React frontend application
│   ├── public/            # Static assets
│   └── src/               # Source code
│       ├── Components/    # React components by domain
│       │   ├── Appointment Component/
│       │   ├── Doctor Component/
│       │   ├── Main Component/
│       │   ├── Nav Component/
│       │   ├── Novelty Component/
│       │   ├── Pharmacy Component/
│       │   └── User Component/
│       └── ...
```

---

## 💻 Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Python 3.8+ (for AI model)
- npm or yarn

### Backend Setup
```bash
# Navigate to backend directory
cd BACKEND

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm start
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### AI Model Setup
```bash
# Install Python dependencies
pip install -r BACKEND/ai-model/requirements.txt

# Start the AI service
uvicorn BACKEND.ai-model.main:app --reload --port 8000
```

---

## 🌟 Key Features Showcase

### Interactive Health Dashboard
The system provides personalized health analytics and metrics visualization for patients, helping them track their health journey over time.

### AI-Powered Appointment System
Automatically matches patients with the right specialists based on symptoms and medical history, optimizing hospital resources.

### Digital Medical Records
Secure, blockchain-based medical records ensure data integrity while providing easy access to authorized healthcare professionals.

### 3D Anatomical Models
Interactive 3D models help doctors explain conditions to patients and visualize symptoms for better understanding.

---

## 👥 Contributors

ITPM_Y3S1_WE_91 Group

---

## 📄 License

All Rights Reserved to MEDI FLOW