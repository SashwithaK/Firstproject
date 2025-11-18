"""
Database Migration Script
Adds processing_time and file_size columns to existing database
"""
import sqlite3
import os

def migrate_database():
    db_path = "handwriting.db"
    
    if not os.path.exists(db_path):
        print("No database found. Will be created with correct schema on first run.")
        return
    
    print(f"Migrating database: {db_path}")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if columns exist
        cursor.execute("PRAGMA table_info(extraction_results)")
        columns = [col[1] for col in cursor.fetchall()]
        
        print(f"Current columns: {columns}")
        
        # Add processing_time column if it doesn't exist
        if "processing_time" not in columns:
            print("Adding processing_time column...")
            cursor.execute("ALTER TABLE extraction_results ADD COLUMN processing_time FLOAT DEFAULT 0.0")
            print("✅ Added processing_time column")
        else:
            print("✅ processing_time column already exists")
        
        # Add file_size column if it doesn't exist
        if "file_size" not in columns:
            print("Adding file_size column...")
            cursor.execute("ALTER TABLE extraction_results ADD COLUMN file_size INTEGER DEFAULT 0")
            print("✅ Added file_size column")
        else:
            print("✅ file_size column already exists")
        
        conn.commit()
        conn.close()
        
        print("\n✅ Database migration completed successfully!")
        print("You can now restart the backend server.")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        print("\nAlternative: Delete the database and let it recreate:")
        print("1. Stop the backend server")
        print("2. Delete handwriting.db")
        print("3. Restart the backend server")

if __name__ == "__main__":
    migrate_database()
