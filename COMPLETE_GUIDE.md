# 🎯 Handwritten Form Extraction - Complete Guide

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [CRUD Operations](#crud-operations)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Frontend Features](#frontend-features)
- [Troubleshooting](#troubleshooting)

---

## 🌟 Overview

**Handwritten Form Extraction** is an enterprise-grade AI-powered OCR system that extracts handwritten text from images and converts it into structured JSON data. The system features a premium modern UI with complete CRUD operations and SQLite database integration using SQLAlchemy.

---

## ✨ Features

### 🎨 Frontend Features
- **Premium Modern UI Design**
  - Gradient backgrounds (slate → blue → indigo)
  - Large, eye-catching icons
  - Smooth animations and transitions
  - Glass morphism effects
  - Responsive design for all devices

- **Upload System**
  - Drag & drop file upload
  - Live image preview
  - Progress bar with percentage
  - File validation (type & size)
  - Supported formats: JPG, PNG, PDF

- **Results Display**
  - Syntax-highlighted JSON viewer
  - Real-time extraction feedback
  - Success animations
  - Copy to clipboard functionality

### 🗄️ Database Management
- **Complete CRUD Operations**
  - ✅ **CREATE**: Upload and save extractions
  - 📖 **READ**: View all records with search
  - ✏️ **UPDATE**: Edit JSON data inline
  - 🗑️ **DELETE**: Remove records with confirmation

- **View Modes**
  - Card View: Visual card layout
  - Table View: Compact table format
  - Full-screen modal for detailed viewing

- **Search & Filter**
  - Real-time search by filename
  - Content-based filtering
  - Dynamic result count

### 🔧 Backend Features
- **AI-Powered Extraction**
  - Uses Ollama vision models (llava)
  - Fallback to HuggingFace API
  - Image preprocessing for accuracy
  - JSON structure validation

- **Database (SQLAlchemy + SQLite)**
  - Automatic table creation
  - Async database operations
  - Transaction management
  - Data persistence

- **Performance Tracking**
  - Processing time measurement
  - File size logging
  - Timestamp tracking (created/updated)

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS 4** - Styling framework
- **Vite** - Build tool
- **Axios** - HTTP client

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy 2.0** - ORM
- **SQLite** - Database (via aiosqlite)
- **Ollama** - AI vision model
- **Pillow** - Image processing
- **Python 3.10+**

---

## 📥 Installation

### Prerequisites
```bash
# Required Software
- Python 3.10 or higher
- Node.js 16 or higher
- npm or yarn
- Ollama (optional, for AI processing)
```

### Step 1: Backend Setup
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# The requirements include:
# - fastapi
# - uvicorn[standard]
# - sqlalchemy>=2.0.0
# - aiosqlite>=0.19.0
# - pillow
# - python-multipart
# - requests
# - langfuse
# - groq
# - openai
# - python-dotenv
```

### Step 2: Frontend Setup
```bash
cd frontend

# Install Node dependencies
npm install

# Dependencies include:
# - react
# - react-dom
# - axios
# - tailwindcss
# - vite
```

### Step 3: Environment Configuration
Create a `.env` file in the `backend` directory:
```env
# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llava:latest
OLLAMA_TIMEOUT_SECONDS=120
OLLAMA_TEMPERATURE=0.1
OLLAMA_NUM_PREDICT=2048

# Optional: HuggingFace & Groq APIs
HF_TOKEN=your_huggingface_token_here
GROQ_API_KEY=your_groq_api_key_here

# Optional: Langfuse Tracing
LANGFUSE_PUBLIC_KEY=your_public_key
LANGFUSE_SECRET_KEY=your_secret_key
LANGFUSE_HOST=https://cloud.langfuse.com

# Image Processing
ENABLE_IMAGE_PREPROCESSING=true
USE_CONSENSUS_MODE=true
```

---

## 🚀 Running the Application

### Option 1: Quick Start (Recommended)
```bash
# Double-click the batch file
START_ALL.bat

# This will:
# 1. Start backend server on http://localhost:8000
# 2. Start frontend server on http://localhost:5000
# 3. Open both in separate windows
```

### Option 2: Manual Start

#### Backend:
```bash
cd backend
python main.py

# Server will run on: http://localhost:8000
# API docs available at: http://localhost:8000/docs
```

#### Frontend:
```bash
cd frontend
npm run dev

# Server will run on: http://localhost:5000
```

---

## 🔄 CRUD Operations

### CREATE (Upload & Save)
1. Navigate to "Upload & Extract" tab
2. Drag & drop or click to upload an image
3. Click "Extract Text" button
4. Data is automatically saved to database
5. Record ID is displayed on success

### READ (View Records)
1. Navigate to "Database Manager" tab
2. View all records in Card or Table view
3. Use search bar to filter records
4. Click "View" button to see full details
5. Modal displays complete JSON data

### UPDATE (Edit Records)
1. In Database Manager, click "Edit" button
2. Edit modal opens with JSON editor
3. Modify the JSON data
4. Click "Format JSON" to validate syntax
5. Click "Save Changes" to update
6. Confirmation notification appears

### DELETE (Remove Records)
1. In Database Manager, click "Delete" button
2. Confirmation modal appears
3. Review record details
4. Click "Yes, Delete It" to confirm
5. Record is permanently removed
6. Success notification appears

---

## 🗃️ Database Schema

### Table: `extraction_results`

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key (auto-increment) |
| `filename` | VARCHAR(255) | Original filename (indexed) |
| `json_data` | TEXT | Extracted JSON data |
| `processing_time` | FLOAT | Time taken to process (seconds) |
| `file_size` | INTEGER | File size in bytes |
| `created_at` | DATETIME | Creation timestamp (UTC) |
| `updated_at` | DATETIME | Last update timestamp (UTC) |

### Database Location
```
backend/handwriting.db
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Upload File
```http
POST /upload
Content-Type: multipart/form-data

Form Data:
- file: (binary) Image file

Response:
{
  "success": true,
  "filename": "document.jpg",
  "message": "Extraction successful",
  "extracted_data": {...},
  "id": 1,
  "processing_time": 2.45,
  "file_size": 152340
}
```

#### 2. Get All Results
```http
GET /results

Response:
[
  {
    "id": 1,
    "filename": "document.jpg",
    "json_data": {...},
    "created_at": "2024-01-01T12:00:00",
    "updated_at": "2024-01-01T12:00:00"
  }
]
```

#### 3. Get Single Result
```http
GET /results/{id}

Response:
{
  "id": 1,
  "filename": "document.jpg",
  "json_data": {...},
  "created_at": "2024-01-01T12:00:00",
  "updated_at": "2024-01-01T12:00:00"
}
```

#### 4. Update Result
```http
PUT /results/{id}
Content-Type: application/json

Body:
{
  "field1": "updated_value",
  "field2": "new_value"
}

Response:
{
  "id": 1,
  "filename": "document.jpg",
  "json_data": {...},
  "created_at": "2024-01-01T12:00:00",
  "updated_at": "2024-01-01T12:30:00"
}
```

#### 5. Delete Result
```http
DELETE /results/{id}

Response:
{
  "message": "Result deleted"
}
```

#### 6. Health Check
```http
GET /health

Response:
{
  "status": "healthy",
  "agent_initialized": true,
  "ollama_host": "http://localhost:11434",
  "ollama_model": "llava",
  "langfuse_configured": false
}
```

---

## 🎨 Frontend Features Detail

### Navigation
- **Upload & Extract**: Main upload interface
- **Database Manager**: CRUD operations hub
- **Refresh Data**: Reload database records

### Upload Section
- **Left Panel**: File upload area
  - Drag & drop zone
  - File selection button
  - Format info display
  - Preview of selected file
  
- **Right Panel**: Results display
  - Success message with ID
  - Formatted JSON output
  - Copy to clipboard button
  - Upload another button

### Database Manager
- **Header**: Search bar & view toggle
- **Card View**:
  - Visual cards with file info
  - Date/time badges
  - JSON preview
  - View/Edit/Delete buttons
  
- **Table View**:
  - Compact table layout
  - Sortable columns
  - Action buttons
  - Truncated data preview

### Modals
- **View Modal**: Full JSON display
- **Edit Modal**: JSON editor with formatting
- **Delete Modal**: Confirmation with details

---

## 🔍 Troubleshooting

### Backend Issues

#### Error: "Module not found 'sqlalchemy'"
```bash
cd backend
pip install -r requirements.txt
```

#### Error: "Agent not initialized"
```bash
# Install and start Ollama
# Download from: https://ollama.ai
ollama pull llava
ollama serve
```

#### Error: "Database locked"
```bash
# Stop all running instances
# Delete handwriting.db
# Restart the backend
```

### Frontend Issues

#### Error: "npm install fails"
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Error: "Port 5000 already in use"
```bash
# Edit package.json and change port
"dev": "vite --host 0.0.0.0 --port 5001"
```

#### Error: "Cannot connect to backend"
```bash
# Ensure backend is running
# Check if http://localhost:8000/health returns OK
# Verify CORS settings in backend
```

### Database Issues

#### Reset Database
```bash
cd backend
rm handwriting.db
# Restart backend - database will be recreated
```

#### View Database Contents
```bash
cd backend
sqlite3 handwriting.db
.tables
SELECT * FROM extraction_results;
.exit
```

---

## 🎯 Best Practices

### For Accurate Extraction
1. Use high-quality scans (300 DPI minimum)
2. Ensure good lighting and contrast
3. Avoid blurry or rotated images
4. Preferred format: PNG or high-quality JPG

### For Database Management
1. Regularly backup `handwriting.db`
2. Validate JSON before saving edits
3. Use descriptive filenames
4. Delete old/unused records periodically

### For Performance
1. Keep file sizes under 5MB
2. Close unused modals
3. Clear browser cache if slow
4. Restart servers after prolonged use

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review API logs in terminal
3. Check browser console for errors
4. Verify all dependencies are installed

---

## 🎉 Enjoy Your Enterprise OCR System!

You now have a fully functional, production-ready handwritten form extraction system with:
- ✅ Modern, professional UI
- ✅ Complete CRUD operations
- ✅ SQLite database with SQLAlchemy
- ✅ AI-powered text extraction
- ✅ Real-time processing feedback
- ✅ Comprehensive error handling

Happy Extracting! 🚀
