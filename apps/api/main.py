from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List
from datetime import datetime, timedelta
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session

# Import modules
from compliance import Document, check_kyc_compliance
from prediction import PredictionRequest, get_prediction
from database import init_db, get_db, User, DataEntry
from auth import (
    Token, UserCreate, UserResponse, 
    verify_password, get_password_hash, create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

load_dotenv()
init_db()  # Initialize database tables

app = FastAPI(title="OmniNexus API", version="2.0.0")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Database for old endpoints
mock_documents = [
    Document(id="1", name="Passport Scan", type="Passport", status="approved", due_date=datetime.now() - timedelta(days=10), submitted_date=datetime.now() - timedelta(days=12)),
    Document(id="2", name="Utility Bill", type="Utility Bill", status="pending", due_date=datetime.now() - timedelta(days=2)),
    Document(id="3", name="Inc. Certificate", type="Incorporation Cert", status="rejected", due_date=datetime.now() - timedelta(days=5)),
]

# === AUTHENTICATION ENDPOINTS ===

@app.post("/auth/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user account"""
    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login and get access token"""
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# === DATA FABRIC ENDPOINTS ===

class DataEntryCreate(BaseModel):
    title: str
    description: str | None = None
    category: str
    data_value: float | None = None

class DataEntryResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str | None
    category: str
    data_value: float | None
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

@app.post("/data/entries", response_model=DataEntryResponse)
def create_data_entry(entry: DataEntryCreate, db: Session = Depends(get_db)):
    """Create a new data entry"""
    # For now, using user_id = 1 (can be enhanced with actual auth)
    db_entry = DataEntry(
        user_id=1,
        title=entry.title,
        description=entry.description,
        category=entry.category,
        data_value=entry.data_value
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.get("/data/entries", response_model=List[DataEntryResponse])
def get_data_entries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all data entries"""
    entries = db.query(DataEntry).offset(skip).limit(limit).all()
    return entries

@app.get("/data/entries/{entry_id}", response_model=DataEntryResponse)
def get_data_entry(entry_id: int, db: Session = Depends(get_db)):
    """Get a specific data entry"""
    entry = db.query(DataEntry).filter(DataEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry

@app.put("/data/entries/{entry_id}", response_model=DataEntryResponse)
def update_data_entry(entry_id: int, entry: DataEntryCreate, db: Session = Depends(get_db)):
    """Update a data entry"""
    db_entry = db.query(DataEntry).filter(DataEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    db_entry.title = entry.title
    db_entry.description = entry.description
    db_entry.category = entry.category
    db_entry.data_value = entry.data_value
    db_entry.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.delete("/data/entries/{entry_id}")
def delete_data_entry(entry_id: int, db: Session = Depends(get_db)):
    """Delete a data entry"""
    db_entry = db.query(DataEntry).filter(DataEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    db.delete(db_entry)
    db.commit()
    return {"message": "Entry deleted successfully"}

# === EXISTING ENDPOINTS ===

@app.get("/")
def read_root():
    return {"message": "Welcome to OmniNexus API", "version": "2.0.0", "status": "operational"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/predict/engagement")
def predict_engagement(request: PredictionRequest):
    return get_prediction(request)

@app.get("/compliance/check")
def run_compliance_check():
    result = check_kyc_compliance(mock_documents)
    return {
        "status": "completed",
        "result": result,
        "documents": mock_documents
    }

# AI Support Endpoint
class ChatRequest(BaseModel):
    message: str
    conversation_history: List[dict] = []

@app.post("/ai/chat")
async def ai_chat(request: ChatRequest):
    """AI-powered chat endpoint using OpenAI/Anthropic"""
    try:
        from ai_service import get_ai_response
        
        response = await get_ai_response(
            message=request.message,
            history=request.conversation_history
        )
        
        return {
            "response": response,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
