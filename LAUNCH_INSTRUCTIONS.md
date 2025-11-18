# 🚀 Launch Instructions - Handwritten Form Extraction

## ⚡ Quick Launch (Easiest Method)

### Just Double-Click This File:
```
📁 START_ALL.bat
```

**That's it!** Both servers will start automatically.

---

## 📋 What Happens When You Run START_ALL.bat

1. **Backend Server** opens in a new window
   - Initializes AI agent
   - Creates/connects to database
   - Starts on http://localhost:8000

2. **Frontend Server** opens in a new window
   - Installs dependencies (first time only)
   - Starts development server
   - Opens on http://localhost:5000

3. **Your Browser** - Go to:
   ```
   http://localhost:5000
   ```

---

## 🎯 Alternative Launch Methods

### Method 1: Separate Terminals

#### Terminal 1 - Backend:
```bash
cd backend
python main.py
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm install  # First time only
npm run dev
```

### Method 2: Individual Batch Files

**Backend Only:**
```
📁 START_BACKEND.bat
```

**Frontend Only:**
```
📁 START_FRONTEND.bat
```

---

## ✅ Verification Checklist

After starting, verify everything is working:

### 1. Check Backend
Open: http://localhost:8000/health

Should see:
```json
{
  "status": "healthy",
  "agent_initialized": true,
  "ollama_host": "http://localhost:11434",
  "ollama_model": "llava"
}
```

### 2. Check Frontend
Open: http://localhost:5000

Should see:
- **Header**: "Handwritten Form Extraction" in large gradient text
- **Navigation**: Upload & Extract | Database Manager buttons
- **Upload area**: Drag & drop zone

### 3. Check Database
After first upload, check:
```bash
cd backend
dir handwriting.db  # Windows
ls handwriting.db   # Mac/Linux
```

File should exist.

---

## 🎨 First Time Using the System

### Step 1: Upload Your First Document
1. Click "Upload & Extract" tab (already selected)
2. Drag an image file OR click "Choose File"
3. Supported: JPG, PNG (PDF requires extra setup)
4. Click "Extract Text" button
5. Wait for AI processing (may take 10-60 seconds)

### Step 2: View Results
1. See extracted JSON in right panel
2. Note the Record ID (e.g., ID: 1)
3. Click "Copy JSON" to copy data
4. Or click "Upload Another" to process more files

### Step 3: Manage Database
1. Click "Database Manager" tab
2. See your uploaded record(s)
3. Try the CRUD operations:
   - **View**: Click eye icon to see full data
   - **Edit**: Click pencil icon to modify JSON
   - **Delete**: Click trash icon to remove

### Step 4: Test Search
1. In Database Manager, use search bar
2. Type filename or any text from JSON
3. Results filter in real-time

---

## 🔧 If Something Goes Wrong

### Backend Won't Start

**Error: "ModuleNotFoundError"**
```bash
cd backend
pip install -r requirements.txt
```

**Error: "Port 8000 already in use"**
```bash
# Find and stop the process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# Mac/Linux:
lsof -i :8000
kill -9 <process_id>
```

**Error: "Ollama not available"**
```bash
# The system will still work using fallback APIs
# Or install Ollama from: https://ollama.ai
ollama pull llava
ollama serve
```

### Frontend Won't Start

**Error: "npm not found"**
```bash
# Install Node.js from: https://nodejs.org
# Then run:
cd frontend
npm install
npm run dev
```

**Error: "Port 5000 already in use"**
```bash
# Edit package.json:
"dev": "vite --host 0.0.0.0 --port 5001"
```

**Error: "Cannot connect to backend"**
1. Make sure backend is running (check http://localhost:8000)
2. Check if firewall is blocking
3. Restart both servers

---

## 🎯 Expected Performance

### Upload & Processing Time
- **Small images** (< 1MB): 5-15 seconds
- **Medium images** (1-3MB): 15-30 seconds
- **Large images** (3-10MB): 30-60 seconds

*Times vary based on:*
- Image complexity
- Handwriting clarity
- System performance
- Ollama/API speed

### Database Operations
- **Create**: Instant (after processing)
- **Read**: < 1 second
- **Update**: < 1 second
- **Delete**: < 1 second

---

## 📊 System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.15+, Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 500MB free space
- **CPU**: Dual-core 2.0GHz+
- **Internet**: Required for AI APIs (if not using Ollama)

### Recommended Spec
- **RAM**: 16GB
- **CPU**: Quad-core 3.0GHz+
- **GPU**: Optional (improves Ollama speed)
- **SSD**: For faster database operations

---

## 🎨 Browser Compatibility

### Fully Supported
- ✅ Google Chrome 90+
- ✅ Microsoft Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

### Features Used
- Drag & Drop API
- Clipboard API
- Fetch API
- CSS Grid & Flexbox
- CSS Gradients
- CSS Animations

---

## 📱 Screen Size Support

### Desktop
- **Optimal**: 1920x1080 and above
- **Minimum**: 1366x768

### Tablet
- **Portrait**: 768x1024
- **Landscape**: 1024x768

### Mobile
- **Large**: 414x896 (iPhone 11 Pro)
- **Medium**: 375x812 (iPhone X)
- **Small**: 360x640 (Android)

*UI adapts automatically to screen size*

---

## 🔒 Security Notes

### Data Privacy
- All data stored locally (SQLite)
- No data sent to cloud (unless using APIs)
- Files deleted after processing
- Database stored in backend folder

### Recommended Setup
1. Use Ollama for fully local processing
2. Keep .env file secure
3. Don't commit API keys to git
4. Regular database backups

---

## 💡 Pro Tips

### For Best Results
1. **Image Quality**
   - Use 300 DPI scans
   - Ensure good lighting
   - Avoid blur/shadows
   - Keep text horizontal

2. **File Management**
   - Use descriptive filenames
   - Keep images under 5MB
   - Convert PDFs to images first

3. **Database Maintenance**
   - Backup handwriting.db regularly
   - Delete test/demo records
   - Monitor database size

### Keyboard Shortcuts
- **Ctrl/Cmd + V**: Paste image (in upload area)
- **Escape**: Close modals
- **Ctrl/Cmd + C**: Copy (when text selected)

---

## 🎊 You're All Set!

### Your Complete System Includes:

✅ **AI-Powered Extraction**
- Ollama integration
- HuggingFace fallback
- Groq API support

✅ **Modern Frontend**
- React 18
- Tailwind CSS 4
- Premium UI design

✅ **Robust Backend**
- FastAPI
- SQLAlchemy ORM
- Async operations

✅ **Complete CRUD**
- Create (Upload)
- Read (View/Search)
- Update (Edit)
- Delete (Remove)

✅ **Database**
- SQLite
- Auto-schema creation
- Transaction safety

---

## 🚀 Ready to Launch!

1. **Double-click**: `START_ALL.bat`
2. **Wait**: 5-10 seconds for servers to start
3. **Open**: http://localhost:5000
4. **Upload**: Your first handwritten document
5. **Enjoy**: Your enterprise-grade OCR system!

---

## 📞 Need Help?

Check these files:
- `COMPLETE_GUIDE.md` - Full documentation
- `WHATS_NEW.md` - Feature overview
- `README_QUICK_START.md` - Quick reference

---

# 🎉 Happy Extracting! 🚀📝✨

Your professional handwritten form extraction system is ready to use!
