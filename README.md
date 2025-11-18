# 🎯 Handwritten Form Extraction System

## Enterprise-Grade AI-Powered OCR with Complete CRUD Operations

![Status](https://img.shields.io/badge/status-ready-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-React%2018-blue)
![Backend](https://img.shields.io/badge/backend-FastAPI-green)
![Database](https://img.shields.io/badge/database-SQLite-orange)

---

## ✨ Features at a Glance

### 🎨 Premium Modern UI
- **Large Icons**: 32px - 80px for maximum visibility
- **Gradient Themes**: Professional blue/indigo/purple color scheme
- **Smooth Animations**: Fade, slide, bounce, and scale effects
- **Glass Morphism**: Backdrop blur and modern styling
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🗄️ Complete CRUD Operations
- ✅ **CREATE**: Upload handwritten forms with drag & drop
- 📖 **READ**: View all records in card or table view
- ✏️ **UPDATE**: Edit JSON data with inline editor
- 🗑️ **DELETE**: Remove records with confirmation

### 💾 Robust Database
- **SQLAlchemy ORM**: Type-safe database operations
- **SQLite**: Lightweight, zero-configuration database
- **Async Operations**: High-performance data access
- **Auto Schema**: Database tables created automatically

### 🤖 AI-Powered Extraction
- **Ollama Integration**: Local AI processing
- **HuggingFace Fallback**: Cloud-based alternative
- **Image Preprocessing**: Enhanced accuracy
- **JSON Output**: Structured data extraction

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- npm or yarn

### Installation

#### 1. Clone/Download the project
```bash
cd Handwritten-Text-main
```

#### 2. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Running the Application

#### Easy Way: Just Double-Click
```
START_ALL.bat
```

#### Manual Way:
```bash
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📖 User Guide

### Upload & Extract
1. Click "Upload & Extract" tab
2. Drag & drop an image (JPG/PNG)
3. Click "Extract Text"
4. View extracted JSON data
5. Data automatically saved to database

### View Records
1. Click "Database Manager" tab
2. Switch between Card View and Table View
3. Use search bar to filter records
4. Click "View" to see full details

### Edit Records
1. In Database Manager, click "Edit" button
2. Modify JSON in the editor
3. Click "Format JSON" to validate
4. Click "Save Changes"

### Delete Records
1. Click "Delete" button on any record
2. Review record details
3. Confirm deletion
4. Record permanently removed

---

## 🏗️ Architecture

### Frontend Stack
```
React 18
├── Vite (Build Tool)
├── Tailwind CSS v3.4 (Styling)
├── Axios (HTTP Client)
└── Components
    ├── App.jsx (Main)
    ├── UploadSection.jsx
    ├── DatabaseManager.jsx
    ├── EditModal.jsx
    └── DeleteConfirmation.jsx
```

### Backend Stack
```
Python 3.10+
├── FastAPI (Web Framework)
├── SQLAlchemy 2.0 (ORM)
├── SQLite (Database)
├── Ollama (AI Vision)
├── Pillow (Image Processing)
└── aiosqlite (Async DB Driver)
```

### Database Schema
```sql
CREATE TABLE extraction_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename VARCHAR(255) NOT NULL,
    json_data TEXT NOT NULL,
    processing_time FLOAT DEFAULT 0.0,
    file_size INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
```

---

## 🎨 UI Design Highlights

### Color Scheme
- **Primary**: Blue (600-900), Indigo (500-900), Purple (600-900)
- **Success**: Green (500-600), Emerald (500-600)
- **Warning**: Amber (500-600), Orange (500-600)
- **Danger**: Red (500-600), Pink (500-600)
- **Neutral**: Gray (100-900), Slate (50-900)

### Typography
- **Headings**: 4xl (36px) - 7xl (72px)
- **Body**: lg (18px) - 2xl (24px)
- **Small**: sm (14px) - base (16px)
- **Weights**: Medium (500), Bold (700), Black (900)

### Spacing
- **Padding**: 6 (24px) - 12 (48px)
- **Gaps**: 4 (16px) - 10 (40px)
- **Margins**: 8 (32px) - 20 (80px)

### Shadows
- **sm**: Small elevation
- **xl**: Medium elevation  
- **2xl**: High elevation (cards, modals)

---

## 📚 API Documentation

### Endpoints

#### Upload File
```http
POST /upload
Content-Type: multipart/form-data

Response:
{
  "success": true,
  "filename": "document.jpg",
  "extracted_data": {...},
  "id": 1,
  "processing_time": 2.45,
  "file_size": 152340
}
```

#### Get All Results
```http
GET /results

Response: Array of extraction results
```

#### Get Single Result
```http
GET /results/{id}

Response: Single extraction result
```

#### Update Result
```http
PUT /results/{id}
Body: Updated JSON data

Response: Updated result
```

#### Delete Result
```http
DELETE /results/{id}

Response: {"message": "Result deleted"}
```

#### Health Check
```http
GET /health

Response: System health status
```

---

## 🔧 Configuration

### Backend (.env)
```env
# Ollama Settings
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llava:latest
OLLAMA_TIMEOUT_SECONDS=120
OLLAMA_TEMPERATURE=0.1

# Image Processing
ENABLE_IMAGE_PREPROCESSING=true
```

### Frontend (vite.config.js)
```javascript
export default {
  server: {
    host: '0.0.0.0',
    port: 5000
  }
}
```

---

## 🐛 Troubleshooting

### Tailwind CSS Errors
```bash
cd frontend
npm install tailwindcss@^3.4.0 postcss autoprefixer
```

### Backend Import Errors
```bash
cd backend
pip install --upgrade -r requirements.txt
```

### Port Already in Use
```bash
# Change frontend port in package.json
"dev": "vite --host 0.0.0.0 --port 5001"

# Change backend port in main.py
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Database Issues
```bash
cd backend
del handwriting.db
# Restart backend to recreate
```

---

## 📁 Project Structure

```
Handwritten-Text-main/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # SQLAlchemy models
│   ├── agent.py             # AI extraction agent
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment config
│   └── uploads/             # Temporary file storage
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main component
│   │   ├── components/      # UI components
│   │   ├── index.css        # Global styles
│   │   └── main.jsx         # Entry point
│   ├── index.html           # HTML template
│   ├── package.json         # Node dependencies
│   ├── tailwind.config.js   # Tailwind config
│   └── vite.config.js       # Vite config
├── START_ALL.bat            # Launch both servers
├── START_BACKEND.bat        # Launch backend only
├── START_FRONTEND.bat       # Launch frontend only
├── COMPLETE_GUIDE.md        # Full documentation
├── QUICK_FIX_GUIDE.md       # Issue resolution
└── README.md                # This file
```

---

## 📊 Performance

### Expected Processing Times
- **Small images** (< 1MB): 5-15 seconds
- **Medium images** (1-3MB): 15-30 seconds
- **Large images** (3-10MB): 30-60 seconds

### Database Operations
- **Create**: Instant after processing
- **Read**: < 1 second
- **Update**: < 1 second
- **Delete**: < 1 second

---

## 🔒 Security

- Files deleted after processing
- Local database storage
- No data sent to cloud (with Ollama)
- Secure API endpoints
- Input validation

---

## 🤝 Contributing

### Development Setup
```bash
# Backend development
cd backend
pip install -r requirements.txt
python main.py

# Frontend development
cd frontend
npm install
npm run dev
```

### Code Style
- **Python**: PEP 8
- **JavaScript**: ESLint
- **CSS**: Tailwind utilities

---

## 📄 License

This project is licensed under the MIT License.

---

## 🎉 Credits

- **React**: UI framework
- **FastAPI**: Backend framework
- **Tailwind CSS**: Styling framework
- **SQLAlchemy**: ORM
- **Ollama**: AI vision model
- **Vite**: Build tool

---

## 📞 Support

For issues or questions:
1. Check `COMPLETE_GUIDE.md` for detailed documentation
2. Check `QUICK_FIX_GUIDE.md` for common issues
3. Review `LAUNCH_INSTRUCTIONS.md` for setup help

---

## ⭐ Features Showcase

✅ **Premium UI** - Enterprise-grade design  
✅ **Large Icons** - 2x-4x bigger than standard  
✅ **CRUD Operations** - Complete data management  
✅ **Dual Views** - Cards & Table layouts  
✅ **Search** - Real-time filtering  
✅ **Animations** - Smooth transitions  
✅ **Responsive** - Mobile-friendly  
✅ **Database** - SQLAlchemy + SQLite  
✅ **AI-Powered** - Ollama integration  
✅ **Performance** - Async operations  

---

**Built with ❤️ for accuracy and user experience**

🚀 **Ready to extract handwritten forms like a pro!**
