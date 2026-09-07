from sqlalchemy.orm import Session
from sqlalchemy import asc
from app.models import FormModel, QuestionModel, ChoiceModel, ResponseModel, AnswerModel
from app.schemas import FormCreate, FormUpdate, QuestionCreate, QuestionUpdate, ReorderItem, ResponseCreate
from datetime import datetime, timezone

# Form Operations
def get_forms(db: Session):
    return db.query(FormModel).order_by(FormModel.updated_at.desc()).all()

def get_form(db: Session, form_id: str):
    return db.query(FormModel).filter(FormModel.id == form_id).first()

def create_form(db: Session, form: FormCreate):
    db_form = FormModel(
        title=form.title,
        description=form.description,
        language=form.language or "en",
        theme=form.theme.model_dump() if form.theme else {},
        settings=form.settings or {},
        status="draft"
    )
    db.add(db_form)
    db.commit()
    db.refresh(db_form)
    return db_form

def update_form(db: Session, form_id: str, form_update: FormUpdate):
    db_form = get_form(db, form_id)
    if not db_form:
        return None
    if form_update.title is not None:
        db_form.title = form_update.title
    if form_update.description is not None:
        db_form.description = form_update.description
    if form_update.language is not None:
        db_form.language = form_update.language
    if form_update.theme is not None:
        db_form.theme = form_update.theme.model_dump()
    if form_update.settings is not None:
        db_form.settings = form_update.settings
    db_form.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_form)
    return db_form

def publish_form(db: Session, form_id: str):
    db_form = get_form(db, form_id)
    if not db_form:
        return None
    db_form.status = "published"
    db_form.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_form)
    return db_form

def unpublish_form(db: Session, form_id: str):
    db_form = get_form(db, form_id)
    if not db_form:
        return None
    db_form.status = "draft"
    db_form.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_form)
    return db_form

def delete_form(db: Session, form_id: str):
    db_form = get_form(db, form_id)
    if not db_form:
        return False
    db.delete(db_form)
    db.commit()
    return True

# Question Operations
def create_question(db: Session, form_id: str, question: QuestionCreate):
    db_form = get_form(db, form_id)
    if not db_form:
        return None

    # Calculate position
    current_count = db.query(QuestionModel).filter(QuestionModel.form_id == form_id).count()
    pos = question.position if question.position is not None and question.position >= 0 else current_count

    db_question = QuestionModel(
        form_id=form_id,
        type=question.type,
        title=question.title,
        description=question.description or "",
        required=question.required,
        position=pos,
        settings=question.settings or {},
        logic=question.logic or []
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)

    if question.choices:
        for idx, choice in enumerate(question.choices):
            c_pos = choice.position if choice.position is not None else idx
            db_choice = ChoiceModel(
                question_id=db_question.id,
                label=choice.label,
                position=c_pos
            )
            db.add(db_choice)
        db.commit()
        db.refresh(db_question)

    return db_question

def update_question(db: Session, question_id: str, question_update: QuestionUpdate):
    db_question = db.query(QuestionModel).filter(QuestionModel.id == question_id).first()
    if not db_question:
        return None

    if question_update.type is not None:
        db_question.type = question_update.type
    if question_update.title is not None:
        db_question.title = question_update.title
    if question_update.description is not None:
        db_question.description = question_update.description
    if question_update.required is not None:
        db_question.required = question_update.required
    if question_update.settings is not None:
        db_question.settings = question_update.settings

    if question_update.choices is not None:
        # Delete existing choices and replace
        db.query(ChoiceModel).filter(ChoiceModel.question_id == question_id).delete()
        for idx, choice in enumerate(question_update.choices):
            c_pos = choice.position if choice.position is not None else idx
            db_choice = ChoiceModel(
                question_id=question_id,
                label=choice.label,
                position=c_pos
            )
            db.add(db_choice)

    db.commit()
    db.refresh(db_question)
    return db_question

def reorder_questions(db: Session, form_id: str, items: list[ReorderItem]):
    for item in items:
        db.query(QuestionModel).filter(
            QuestionModel.id == item.id,
            QuestionModel.form_id == form_id
        ).update({"position": item.position})
    db.commit()

    db_form = get_form(db, form_id)
    return db_form.questions if db_form else []

def delete_question(db: Session, question_id: str):
    db_question = db.query(QuestionModel).filter(QuestionModel.id == question_id).first()
    if not db_question:
        return False
    form_id = db_question.form_id
    db.delete(db_question)
    db.commit()

    # Re-index remaining positions
    remaining = db.query(QuestionModel).filter(QuestionModel.form_id == form_id).order_by(asc(QuestionModel.position)).all()
    for idx, q in enumerate(remaining):
        q.position = idx
    db.commit()
    return True

def duplicate_form(db: Session, form_id: str):
    source_form = get_form(db, form_id)
    if not source_form:
        return None

    new_form = FormModel(
        title=f"{source_form.title} (Copy)",
        description=source_form.description or "",
        language=source_form.language or "en",
        theme=source_form.theme or {},
        settings=source_form.settings or {},
        status="draft"
    )
    db.add(new_form)
    db.commit()
    db.refresh(new_form)

    # Duplicate questions and choices
    for q in source_form.questions:
        new_q = QuestionModel(
            form_id=new_form.id,
            type=q.type,
            title=q.title,
            description=q.description or "",
            required=q.required,
            position=q.position,
            settings=q.settings or {},
            logic=q.logic or []
        )
        db.add(new_q)
        db.commit()
        db.refresh(new_q)

        for c in q.choices:
            new_c = ChoiceModel(
                question_id=new_q.id,
                label=c.label,
                position=c.position
            )
            db.add(new_c)

    db.commit()
    db.refresh(new_form)
    return new_form

# Response Operations
import re

def validate_response_answers(form: FormModel, answers: list):
    """
    Validates submitted answers against form question definitions.
    Returns (is_valid, error_message)
    """
    questions_by_id = {q.id: q for q in form.questions}
    answers_by_qid = {ans.question_id: ans.value for ans in answers}

    for q in form.questions:
        val = answers_by_qid.get(q.id)

        # 1. Required check
        if q.required:
            if val is None or val == "" or (isinstance(val, list) and len(val) == 0):
                return False, f"Question '{q.title}' is required."

        if val is not None and val != "":
            # 2. Email validation
            if q.type == "email":
                email_str = str(val).strip()
                if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email_str):
                    return False, f"Invalid email format for '{q.title}'."

            # 3. Number validation
            if q.type == "number":
                try:
                    num_val = float(val)
                    q_settings = q.settings or {}
                    min_val = q_settings.get("min")
                    max_val = q_settings.get("max")
                    if min_val is not None and num_val < min_val:
                        return False, f"Value for '{q.title}' must be at least {min_val}."
                    if max_val is not None and num_val > max_val:
                        return False, f"Value for '{q.title}' must be no more than {max_val}."
                except (ValueError, TypeError):
                    return False, f"Value for '{q.title}' must be a valid number."

    return True, None

def create_response(db: Session, form_id: str, response_data: ResponseCreate):
    db_form = get_form(db, form_id)
    if not db_form:
        return None

    db_response = ResponseModel(form_id=form_id)
    db.add(db_response)
    db.commit()
    db.refresh(db_response)

    for ans in response_data.answers:
        db_ans = AnswerModel(
            response_id=db_response.id,
            question_id=ans.question_id,
            value=ans.value
        )
        db.add(db_ans)

    db.commit()
    db.refresh(db_response)
    return db_response

def get_responses(db: Session, form_id: str):
    return db.query(ResponseModel).filter(ResponseModel.form_id == form_id).order_by(ResponseModel.submitted_at.desc()).all()

def clear_form_responses(db: Session, form_id: str):
    db_form = get_form(db, form_id)
    if not db_form:
        return False
    db.query(ResponseModel).filter(ResponseModel.form_id == form_id).delete()
    db.commit()
    return True


