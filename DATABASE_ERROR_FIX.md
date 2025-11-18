# 🔧 Database Error Fix Guide

## ❌ Error You're Seeing:
```
OperationalError: table extraction_results has no column named processing_time
```

## 🎯 Cause:
The database schema was updated to add new columns (`processing_time` and `file_size`), but your existing database doesn't have these columns.

---

## ✅ Solution (Choose ONE method)

### Method 1: Migrate Existing Database (Keep Your Data)

**Steps:**
1. **Stop the backend server** (Ctrl+C in the backend terminal)
2. **Double-click**: `FIX_DATABASE.bat`
3. Wait for migration to complete
4. **Restart backend server**

**Command line alternative:**
```bash
# Stop backend server first!
cd backend
python migrate_database.py
# Then restart backend
```

---

### Method 2: Reset Database (Fresh Start - Loses Data)

**Steps:**
1. **Stop the backend server** (Ctrl+C in the backend terminal)
2. **Double-click**: `RESET_DATABASE.bat`
3. Type `YES` to confirm
4. **Restart backend server**

**Command line alternative:**
```bash
# Stop backend server first!
cd backend
del handwriting.db
# Then restart backend
```

---

## 🚀 Step-by-Step Fix (Recommended)

### Step 1: Stop Backend Server
In the backend terminal window, press **Ctrl+C**

### Step 2: Run Migration
**Double-click this file:**
```
FIX_DATABASE.bat
```

OR run manually:
```bash
cd backend
python migrate_database.py
```

You should see:
```
Migrating database: handwriting.db
Current columns: ['id', 'filename', 'json_data', 'created_at', 'updated_at']
Adding processing_time column...
✅ Added processing_time column
Adding file_size column...
✅ Added file_size column

✅ Database migration completed successfully!
```

### Step 3: Restart Backend
```bash
cd backend
python main.py
```

### Step 4: Test Upload
1. Go to http://localhost:5000
2. Upload a test image
3. Should work without errors!

---

## 🆘 If Migration Fails

If `FIX_DATABASE.bat` doesn't work:

### Option A: Manual Database Reset
```bash
# 1. Stop backend completely
# 2. Open command prompt as Administrator
cd backend
taskkill /F /IM python.exe
del /F handwriting.db
# 3. Restart backend
python main.py
```

### Option B: Manual Migration
```bash
# 1. Stop backend
# 2. Open SQLite
cd backend
sqlite3 handwriting.db

# 3. Run these commands in SQLite:
ALTER TABLE extraction_results ADD COLUMN processing_time FLOAT DEFAULT 0.0;
ALTER TABLE extraction_results ADD COLUMN file_size INTEGER DEFAULT 0;
.exit

# 4. Restart backend
python main.py
```

---

## 🔍 Verify Fix Worked

After migration, verify the columns exist:
```bash
cd backend
sqlite3 handwriting.db
.schema extraction_results
.exit
```

Should show:
```sql
CREATE TABLE extraction_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename VARCHAR(255) NOT NULL,
    json_data TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    processing_time FLOAT DEFAULT 0.0,
    file_size INTEGER DEFAULT 0
);
```

---

## ✅ Checklist

- [ ] Stopped backend server
- [ ] Ran FIX_DATABASE.bat or migration script
- [ ] Saw success message
- [ ] Restarted backend server
- [ ] Uploaded test image successfully
- [ ] No more errors!

---

## 🎯 Quick Commands Cheat Sheet

```bash
# Method 1: Keep data (Run migration)
cd backend
python migrate_database.py

# Method 2: Fresh start (Delete & recreate)
cd backend
del handwriting.db

# Then restart backend:
python main.py
```

---

## 🚨 Common Issues

### Issue: "File is being used by another process"
**Solution**: You didn't stop the backend server
```bash
# Windows: Force stop Python
taskkill /F /IM python.exe
# Then try migration again
```

### Issue: "sqlite3 not found"
**Solution**: Use Python to run migration
```bash
cd backend
python migrate_database.py
```

### Issue: Migration script has errors
**Solution**: Just reset the database
```bash
# Stop backend
cd backend
del /F handwriting.db
# Restart backend - will recreate with correct schema
```

---

## 💡 Why This Happened

The database schema was enhanced to track:
- **processing_time**: How long extraction took
- **file_size**: Size of uploaded file

Old databases don't have these columns, so we need to add them (migrate) or recreate the database.

---

## ✅ After Fix

Once fixed, your uploads will now include:
- Processing time tracking
- File size information
- Better performance metrics

All displayed in the Database Manager!

---

## 🎉 You're Done!

After running the fix:
1. ✅ Database has new columns
2. ✅ Upload works correctly
3. ✅ No more errors
4. ✅ System fully functional

**Now run START_ALL.bat and enjoy!** 🚀
