from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os

from app.database import engine, Base, get_db, SessionLocal
from app import crud, schemas
from app.models import FormModel

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nomi API", version="1.0.0")

# Enable CORS for Next.js frontend (allow any origin safely)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def auto_seed_if_needed():
    """Automatically seed sample forms if database is empty on cloud startup"""
    try:
        db = SessionLocal()
        count = db.query(FormModel).count()
        db.close()
        if count == 0:
            print("Database is empty on startup. Running auto-seed...")
            from seed import seed
            seed()
    except Exception as e:
        print(f"Auto-seed check warning: {e}")

@app.on_event("startup")
def on_startup():
    auto_seed_if_needed()

@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "Nomi Backend", "version": "1.0.0"}

@app.post("/api/seed")
def trigger_seed():
    """Manual trigger to re-seed demo forms anytime"""
    try:
        from seed import seed
        seed()
        return {"status": "success", "message": "Forms seeded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Form Endpoints ---
@app.get("/api/forms", response_model=List[schemas.FormSchema])
def list_forms(db: Session = Depends(get_db)):
    return crud.get_forms(db)

@app.post("/api/forms", response_model=schemas.FormSchema, status_code=status.HTTP_201_CREATED)
def create_form(form: schemas.FormCreate, db: Session = Depends(get_db)):
    return crud.create_form(db, form)

@app.get("/api/forms/{form_id}", response_model=schemas.FormSchema)
def get_form(form_id: str, db: Session = Depends(get_db)):
    db_form = crud.get_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form

@app.put("/api/forms/{form_id}", response_model=schemas.FormSchema)
def update_form(form_id: str, form_update: schemas.FormUpdate, db: Session = Depends(get_db)):
    db_form = crud.update_form(db, form_id, form_update)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form

@app.post("/api/forms/{form_id}/duplicate", response_model=schemas.FormSchema, status_code=status.HTTP_201_CREATED)
def duplicate_form(form_id: str, db: Session = Depends(get_db)):
    db_form = crud.duplicate_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form

@app.post("/api/forms/{form_id}/publish", response_model=schemas.FormSchema)
def publish_form(form_id: str, db: Session = Depends(get_db)):
    db_form = crud.publish_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form

@app.post("/api/forms/{form_id}/unpublish", response_model=schemas.FormSchema)
def unpublish_form(form_id: str, db: Session = Depends(get_db)):
    db_form = crud.unpublish_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_form

@app.delete("/api/forms/{form_id}")
def delete_form(form_id: str, db: Session = Depends(get_db)):
    success = crud.delete_form(db, form_id)
    if not success:
        raise HTTPException(status_code=404, detail="Form not found")
    return {"message": "Form deleted successfully"}

# --- Question Endpoints ---
@app.post("/api/forms/{form_id}/questions", response_model=schemas.QuestionSchema, status_code=status.HTTP_201_CREATED)
def create_question(form_id: str, question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    db_question = crud.create_question(db, form_id, question)
    if not db_question:
        raise HTTPException(status_code=404, detail="Form not found")
    return db_question

@app.put("/api/questions/{question_id}", response_model=schemas.QuestionSchema)
def update_question(question_id: str, question_update: schemas.QuestionUpdate, db: Session = Depends(get_db)):
    db_question = crud.update_question(db, question_id, question_update)
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question

@app.put("/api/forms/{form_id}/questions/reorder", response_model=List[schemas.QuestionSchema])
def reorder_questions(form_id: str, items: List[schemas.ReorderItem], db: Session = Depends(get_db)):
    return crud.reorder_questions(db, form_id, items)

@app.delete("/api/questions/{question_id}")
def delete_question(question_id: str, db: Session = Depends(get_db)):
    success = crud.delete_question(db, question_id)
    if not success:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"message": "Question deleted successfully"}

# --- Public Respondent & Submission Endpoints ---
@app.get("/api/forms/{form_id}/public", response_model=schemas.FormSchema)
def get_public_form(form_id: str, db: Session = Depends(get_db)):
    db_form = crud.get_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    if db_form.status != "published":
        raise HTTPException(status_code=403, detail="This form is currently not accepting responses")
    return db_form

@app.post("/api/forms/{form_id}/responses", response_model=schemas.ResponseSchema, status_code=status.HTTP_201_CREATED)
def submit_response(form_id: str, response_data: schemas.ResponseCreate, db: Session = Depends(get_db)):
    db_form = crud.get_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    if db_form.status != "published":
        raise HTTPException(status_code=403, detail="Form is not published")
    if db_form.settings and db_form.settings.get("collectResponses", True) is False:
        raise HTTPException(status_code=403, detail="This form is not currently accepting responses")
    
    # Server-side answer validation against form schema
    is_valid, err_msg = crud.validate_response_answers(db_form, response_data.answers)
    if not is_valid:
        raise HTTPException(status_code=422, detail=err_msg)

    db_resp = crud.create_response(db, form_id, response_data)
    return db_resp

@app.get("/api/forms/{form_id}/responses", response_model=List[schemas.ResponseSchema])
def get_responses(form_id: str, db: Session = Depends(get_db)):
    db_form = crud.get_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    return crud.get_responses(db, form_id)

@app.delete("/api/forms/{form_id}/responses")
def clear_responses(form_id: str, db: Session = Depends(get_db)):
    db_form = crud.get_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    crud.clear_form_responses(db, form_id)
    return {"message": "All responses cleared successfully"}
