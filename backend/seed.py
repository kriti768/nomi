"""
Database Seeding Script for Nomi
Populates an impressive showcase conversational form with all 8 question types
and realistic sample responses for analytics and demo testing.
"""

from app.database import SessionLocal, Base, engine
from app.models import FormModel, QuestionModel, ChoiceModel, ResponseModel, AnswerModel
from datetime import datetime, timezone, timedelta
import uuid

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    DEMO_FORM_ID = "eba8b334-7d15-42c0-b123-7f30686ff31b"

    # Check if demo form already exists
    existing_form = db.query(FormModel).filter(FormModel.id == DEMO_FORM_ID).first()
    if existing_form:
        print(f"Cleaning up existing demo form {DEMO_FORM_ID} for fresh seed...")
        db.delete(existing_form)
        db.commit()

    print("Seeding Nomi showcase form...")
    demo_form = FormModel(
        id=DEMO_FORM_ID,
        title="Product Feedback & Community Survey",
        description="A showcase conversational form designed to demonstrate all 8 question types, themes, and real-time response analytics.",
        status="published",
        language="en",
        theme={
            "preset": "forma_default",
            "primaryColor": "#c65a87",
            "backgroundColor": "#fff9f8",
            "textColor": "#29202c",
            "answerColor": "#ffffff",
            "fontFamily": "Plus Jakarta Sans",
            "cornerRadius": 14,
            "textAlignment": "left"
        },
        settings={
            "showProgressBar": True,
            "showQuestionNumbers": True,
            "keyboardNav": True,
            "autoSaveDraft": True,
            "progressStyle": "fraction",
            "completionMessage": "Thank you for completing our showcase survey! Your feedback shapes the future of Nomi.",
            "collectResponses": True
        }
    )
    db.add(demo_form)
    db.commit()
    db.refresh(demo_form)

    # Add all 8 question types
    questions_data = [
        {
            "type": "short_text",
            "title": "What is your full name?",
            "description": "Please introduce yourself so we know who we are talking to.",
            "required": True,
            "settings": {"placeholder": "e.g. Jane Doe"}
        },
        {
            "type": "email",
            "title": "What is your primary email address?",
            "description": "We will only use this to follow up if needed.",
            "required": True,
            "settings": {"placeholder": "jane@example.com"}
        },
        {
            "type": "multiple_choice",
            "title": "What type of product are you creating with Nomi?",
            "description": "Select the option that best matches your primary use case.",
            "required": True,
            "settings": {"allowMultiple": False},
            "choices": [
                "SaaS Web Application",
                "Design Portfolio",
                "Customer Onboarding Flow",
                "Community Feedback Survey"
            ]
        },
        {
            "type": "dropdown",
            "title": "Which industry best describes your organization?",
            "description": "Helps us tailor relevant feature updates.",
            "required": False,
            "choices": [
                "Technology & Software",
                "Design & Creative Arts",
                "Marketing & Growth",
                "Education & Research",
                "E-Commerce & Retail"
            ]
        },
        {
            "type": "rating",
            "title": "How would you rate the experience of conversational forms?",
            "description": "1 = Clunky, 5 = Delightfully effortless.",
            "required": True,
            "settings": {"ratingMax": 5, "ratingShape": "star"}
        },
        {
            "type": "number",
            "title": "How many members are on your product or design team?",
            "description": "Enter an estimated headcount.",
            "required": False,
            "settings": {"placeholder": "e.g. 8", "min": 1, "max": 500}
        },
        {
            "type": "yes_no",
            "title": "Would you recommend Nomi to a colleague or client?",
            "description": "We strive to create software people love sharing.",
            "required": True
        },
        {
            "type": "long_text",
            "title": "What is the single most valuable feature you look for in a form builder?",
            "description": "Feel free to share any thoughts, ideas, or wishlist items.",
            "required": False,
            "settings": {"placeholder": "Tell us what makes a form tool truly indispensable..."}
        }
    ]

    created_questions = []
    for idx, q_data in enumerate(questions_data):
        q = QuestionModel(
            form_id=demo_form.id,
            type=q_data["type"],
            title=q_data["title"],
            description=q_data.get("description", ""),
            required=q_data.get("required", False),
            position=idx,
            settings=q_data.get("settings", {}),
            logic=[]
        )
        db.add(q)
        db.commit()
        db.refresh(q)

        if "choices" in q_data:
            for c_idx, choice_label in enumerate(q_data["choices"]):
                c = ChoiceModel(
                    question_id=q.id,
                    label=choice_label,
                    position=c_idx
                )
                db.add(c)
            db.commit()
            db.refresh(q)

        created_questions.append(q)

    print(f"Created {len(created_questions)} questions across all 8 types.")

    # Seed 5 realistic submissions
    sample_responses = [
        {
            "submitted_offset_hours": 1,
            "answers": {
                0: "Elena Rostova",
                1: "elena.rostova@designcraft.io",
                2: "Design Portfolio",
                3: "Design & Creative Arts",
                4: 5,
                5: 4,
                6: "Yes",
                7: "The fluid, one-question-at-a-time pacing makes respondents feel listened to rather than interrogated."
            }
        },
        {
            "submitted_offset_hours": 3,
            "answers": {
                0: "Marcus Vance",
                1: "marcus@hypergrowth.tech",
                2: "SaaS Web Application",
                3: "Technology & Software",
                4: 5,
                5: 18,
                6: "Yes",
                7: "Fast keyboard navigation and instant analytics breakdowns without needing third-party integrations."
            }
        },
        {
            "submitted_offset_hours": 7,
            "answers": {
                0: "Sarah Jenkins",
                1: "sarah.j@academiaconnect.edu",
                2: "Community Feedback Survey",
                3: "Education & Research",
                4: 4,
                5: 6,
                6: "Yes",
                7: "Simplicity of customization and great accessibility on mobile screens."
            }
        },
        {
            "submitted_offset_hours": 12,
            "answers": {
                0: "Devon Brooks",
                1: "devon@shoptrend.co",
                2: "Customer Onboarding Flow",
                3: "E-Commerce & Retail",
                4: 5,
                5: 12,
                6: "Yes",
                7: "Clean visual themes and effortless reordering in the builder."
            }
        },
        {
            "submitted_offset_hours": 24,
            "answers": {
                0: "Aria Chen",
                1: "aria.chen@growthstudio.dev",
                2: "SaaS Web Application",
                3: "Marketing & Growth",
                4: 4,
                5: 9,
                6: "No",
                7: "Looking forward to webhook integrations and logic branching."
            }
        }
    ]

    for resp_data in sample_responses:
        sub_time = datetime.now(timezone.utc) - timedelta(hours=resp_data["submitted_offset_hours"])
        resp_model = ResponseModel(
            form_id=demo_form.id,
            submitted_at=sub_time
        )
        db.add(resp_model)
        db.commit()
        db.refresh(resp_model)

        for q_idx, ans_val in resp_data["answers"].items():
            if q_idx < len(created_questions):
                ans_model = AnswerModel(
                    response_id=resp_model.id,
                    question_id=created_questions[q_idx].id,
                    value=ans_val
                )
                db.add(ans_model)

        db.commit()

    print(f"Seeded {len(sample_responses)} sample responses with realistic answers.")
    print("Database seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed()
