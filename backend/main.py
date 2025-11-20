import os
import shutil
import json
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from dotenv import load_dotenv
from agent import HandwritingExtractionAgent
from database import init_db, get_db, ExtractionResult

# Load .env file from the backend directory
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf"}
MAX_FILE_SIZE = 10 * 1024 * 1024

agent = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global agent
    try:
        agent = HandwritingExtractionAgent()
        print("[OK] Handwriting Extraction Agent initialized")
    except Exception as e:
        print(f"[WARNING] Agent initialization failed: {e}")
        print("Please ensure Ollama is running and reachable (see README)")
    await init_db()
    print("[OK] Database initialized")
    yield
    # Shutdown (if needed)
    pass

app = FastAPI(
    title="Handwriting Extraction API",
    description="AI-powered handwritten text extraction using Ollama (vision model) and Langfuse",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Handwriting Extraction API",
        "version": "1.0.0",
        "endpoints": {
            "/upload": "POST - Upload handwritten image for extraction",
            "/results": "GET - Get all extraction results",
            "/results/{id}": "GET - Get specific result by ID",
            "/results/{id}": "PUT - Update result by ID",
            "/results/{id}": "DELETE - Delete result by ID",
            "/health": "GET - Health check"
        }
    }

@app.get("/health")
async def health_check():
    ollama_host = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    ollama_model = os.getenv("OLLAMA_MODEL", "llava")
    langfuse_available = bool(os.getenv("LANGFUSE_PUBLIC_KEY") and os.getenv("LANGFUSE_SECRET_KEY"))
    if hasattr(agent, 'langfuse') and agent and agent.langfuse:
        langfuse_configured = True
    else:
        langfuse_configured = False
    return {
        "status": "healthy",
        "agent_initialized": agent is not None,
        "ollama_host": ollama_host,
        "ollama_model": ollama_model,
        "langfuse_available": langfuse_available,
        "langfuse_configured": langfuse_configured
    }

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    import time
    start_time = time.time()
    
    if not agent:
        raise HTTPException(
            status_code=503,
            detail="Agent not initialized. Please ensure the Ollama service is running."
        )

    filename = file.filename or "unknown.jpg"
    file_ext = Path(filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_ext} not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    if file_ext == ".pdf":
        raise HTTPException(
            status_code=400,
            detail="PDF processing requires additional setup with poppler-utils. Please upload JPG or PNG images."
        )

    file_path = None
    try:
        contents = await file.read()
        file_size = len(contents)

        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds maximum allowed size of {MAX_FILE_SIZE / (1024*1024)}MB"
            )

        file_path = UPLOAD_DIR / filename
        with open(file_path, "wb") as f:
            f.write(contents)

        result = agent.extract_handwriting(str(file_path), filename)

        try:
            os.remove(file_path)
        except Exception as e:
            print(f"[WARNING] Failed to delete temporary file: {e}")

        processing_time = time.time() - start_time

        if result["success"]:
            db_result = ExtractionResult(
                filename=result["filename"],
                json_data=json.dumps(result["extracted_data"]),
                processing_time=round(processing_time, 2),
                file_size=file_size
            )
            db.add(db_result)
            await db.commit()
            await db.refresh(db_result)

            formatted_result = {
                "success": result["success"],
                "filename": result["filename"],
                "message": result["message"],
                "extracted_data": result["extracted_data"],
                "id": db_result.id,
                "processing_time": round(processing_time, 2),
                "file_size": file_size
            }
            return JSONResponse(
                content=formatted_result,
                media_type="application/json"
            )
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Extraction failed"))

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_details = str(e)
        error_type = type(e).__name__
        print(f"[ERROR] Upload error: {error_type}: {error_details}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")

        # Write error to log file for debugging
        try:
            with open("error_log.txt", "a") as log_file:
                import datetime
                log_file.write(f"\n[{datetime.datetime.now()}] Error processing file {filename if 'filename' in locals() else 'unknown'}:\n")
                log_file.write(f"{error_type}: {error_details}\n")
                log_file.write(traceback.format_exc())
        except:
            pass

        if file_path and file_path.exists():
            try:
                os.remove(file_path)
            except:
                pass

        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {error_type}: {error_details}"
        )

@app.get("/results")
async def get_results(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ExtractionResult))
    results = result.scalars().all()
    return [
        {
            "id": r.id,
            "filename": r.filename,
            "json_data": json.loads(r.json_data),
            "created_at": r.created_at.isoformat(),
            "updated_at": r.updated_at.isoformat()
        }
        for r in results
    ]

@app.get("/results/{result_id}")
async def get_result(result_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ExtractionResult).where(ExtractionResult.id == result_id))
    r = result.scalar_one_or_none()
    if not r:
        raise HTTPException(status_code=404, detail="Result not found")
    return {
        "id": r.id,
        "filename": r.filename,
        "json_data": json.loads(r.json_data),
        "created_at": r.created_at.isoformat(),
        "updated_at": r.updated_at.isoformat()
    }

@app.put("/results/{result_id}")
async def update_result(result_id: int, json_data: dict, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ExtractionResult).where(ExtractionResult.id == result_id))
    r = result.scalar_one_or_none()
    if not r:
        raise HTTPException(status_code=404, detail="Result not found")
    r.json_data = json.dumps(json_data)
    await db.commit()
    await db.refresh(r)
    return {
        "id": r.id,
        "filename": r.filename,
        "json_data": json.loads(r.json_data),
        "created_at": r.created_at.isoformat(),
        "updated_at": r.updated_at.isoformat()
    }

@app.delete("/results/{result_id}")
async def delete_result(result_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ExtractionResult).where(ExtractionResult.id == result_id))
    r = result.scalar_one_or_none()
    if not r:
        raise HTTPException(status_code=404, detail="Result not found")
    await db.delete(r)
    await db.commit()
    return {"message": "Result deleted"}

@app.delete("/cleanup")
async def cleanup_uploads():
    try:
        deleted = 0
        for file_path in UPLOAD_DIR.glob("*"):
            if file_path.is_file():
                os.remove(file_path)
                deleted += 1
        return {"message": f"Cleaned up {deleted} files"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
