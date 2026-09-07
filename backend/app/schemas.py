from typing import Optional, List, Any, Dict
from datetime import datetime
from pydantic import BaseModel, ConfigDict

# Choice Schemas
class ChoiceBase(BaseModel):
    label: str
    position: Optional[int] = 0

class ChoiceCreate(ChoiceBase):
    pass

class ChoiceSchema(ChoiceBase):
    id: str
    question_id: str

    model_config = ConfigDict(from_attributes=True)

# Question Schemas
class QuestionBase(BaseModel):
    type: str
    title: str = "Untitled Question"
    description: Optional[str] = ""
    required: bool = False
    position: Optional[int] = 0
    settings: Optional[Dict[str, Any]] = None
    logic: Optional[List[Dict[str, Any]]] = None

class QuestionCreate(QuestionBase):
    choices: Optional[List[ChoiceCreate]] = []

class QuestionUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    required: Optional[bool] = None
    settings: Optional[Dict[str, Any]] = None
    choices: Optional[List[ChoiceCreate]] = None

class ReorderItem(BaseModel):
    id: str
    position: int

class QuestionSchema(QuestionBase):
    id: str
    form_id: str
    position: int
    choices: List[ChoiceSchema] = []

    model_config = ConfigDict(from_attributes=True)

# Form Theme & Settings Schemas
class FormThemeSchema(BaseModel):
    preset: Optional[str] = "forma_default"
    primaryColor: Optional[str] = "#6366F1"
    backgroundColor: Optional[str] = "#FFFFFF"
    textColor: Optional[str] = "#0F172A"
    answerColor: Optional[str] = "#F8FAFC"
    fontFamily: Optional[str] = "Plus Jakarta Sans"
    cornerRadius: Optional[int] = 12
    textAlignment: Optional[str] = "left"

class FormBase(BaseModel):
    title: str = "Untitled Form"
    description: Optional[str] = ""
    language: Optional[str] = "en"
    theme: Optional[FormThemeSchema] = FormThemeSchema()
    settings: Optional[Dict[str, Any]] = None

class FormCreate(FormBase):
    pass

class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    language: Optional[str] = None
    theme: Optional[FormThemeSchema] = None
    settings: Optional[Dict[str, Any]] = None

class FormSchema(FormBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime
    questions: List[QuestionSchema] = []

    model_config = ConfigDict(from_attributes=True)

# Answer Schemas
class AnswerCreate(BaseModel):
    question_id: str
    value: Any

class AnswerSchema(BaseModel):
    id: str
    question_id: str
    value: Any

    model_config = ConfigDict(from_attributes=True)

# Response Schemas
class ResponseCreate(BaseModel):
    answers: List[AnswerCreate]

class ResponseSchema(BaseModel):
    id: str
    form_id: str
    submitted_at: datetime
    answers: List[AnswerSchema] = []

    model_config = ConfigDict(from_attributes=True)
