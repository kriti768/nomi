import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class FormModel(Base):
    __tablename__ = "forms"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False, default="Untitled Form")
    description = Column(Text, nullable=True, default="")
    status = Column(String(50), nullable=False, default="draft")  # "draft" | "published"
    language = Column(String(10), nullable=False, default="en")
    theme = Column(JSON, nullable=True, default=dict)
    settings = Column(JSON, nullable=True, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    questions = relationship("QuestionModel", back_populates="form", cascade="all, delete-orphan", order_by="QuestionModel.position")
    responses = relationship("ResponseModel", back_populates="form", cascade="all, delete-orphan")

class QuestionModel(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    form_id = Column(String(36), ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)
    title = Column(Text, nullable=False, default="Untitled Question")
    description = Column(Text, nullable=True, default="")
    required = Column(Boolean, nullable=False, default=False)
    position = Column(Integer, nullable=False, default=0)
    settings = Column(JSON, nullable=True, default=dict)
    logic = Column(JSON, nullable=True, default=list)

    form = relationship("FormModel", back_populates="questions")
    choices = relationship("ChoiceModel", back_populates="question", cascade="all, delete-orphan", order_by="ChoiceModel.position")

class ChoiceModel(Base):
    __tablename__ = "question_choices"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    label = Column(String(255), nullable=False)
    position = Column(Integer, nullable=False, default=0)

    question = relationship("QuestionModel", back_populates="choices")

class ResponseModel(Base):
    __tablename__ = "responses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    form_id = Column(String(36), ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    form = relationship("FormModel", back_populates="responses")
    answers = relationship("AnswerModel", back_populates="response", cascade="all, delete-orphan")

class AnswerModel(Base):
    __tablename__ = "answers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    response_id = Column(String(36), ForeignKey("responses.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    value = Column(JSON, nullable=True)

    response = relationship("ResponseModel", back_populates="answers")
