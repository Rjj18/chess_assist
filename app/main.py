from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import os

app = FastAPI(title="Chess Assist API")

# Setup root directory for serving frontend files in the future
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Chess Assist Backend is running!"}

# Basic route to test that the server is alive
@app.get("/")
def read_root():
    return {"message": "Welcome to Chess Assist API. The backend is up!"}

