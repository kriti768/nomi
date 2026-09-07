"""
Database Seeding Script for Nomi
Populates impressive showcase conversational forms with diverse question types,
themes, and realistic sample responses for analytics and demo testing.
"""

from app.database import SessionLocal, Base, engine
from app.models import FormModel, QuestionModel, ChoiceModel, ResponseModel, AnswerModel
from datetime import datetime, timezone, timedelta
import uuid

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    forms_data = [
        # 1. Product Feedback & Community Survey (Showcase Form)
        {
            "id": "eba8b334-7d15-42c0-b123-7f30686ff31b",
            "title": "Product Feedback & Community Survey",
            "description": "A showcase conversational form designed to demonstrate all 8 question types, themes, and real-time response analytics.",
            "status": "published",
            "language": "en",
            "theme": {
                "preset": "forma_default",
                "primaryColor": "#c65a87",
                "backgroundColor": "#fff9f8",
                "textColor": "#29202c",
                "answerColor": "#ffffff",
                "fontFamily": "Plus Jakarta Sans",
                "cornerRadius": 14,
                "textAlignment": "left"
            },
            "settings": {
                "showProgressBar": True,
                "showQuestionNumbers": True,
                "keyboardNav": True,
                "autoSaveDraft": True,
                "progressStyle": "fraction",
                "completionMessage": "Thank you for completing our showcase survey! Your feedback shapes the future of Nomi.",
                "collectResponses": True
            },
            "questions": [
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
            ],
            "responses": [
                {
                    "hours_ago": 1,
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
                    "hours_ago": 3,
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
                    "hours_ago": 7,
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
                    "hours_ago": 12,
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
                    "hours_ago": 24,
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
        },

        # 2. Customer Experience & NPS Pulse
        {
            "id": "7b23c914-5d09-408a-b89a-4e92a11b02d1",
            "title": "Customer Experience & NPS Pulse",
            "description": "Quarterly satisfaction check-in to measure customer happiness, onboarding flow, and service sentiment.",
            "status": "published",
            "language": "en",
            "theme": {
                "preset": "lavender_dream",
                "primaryColor": "#8B5CF6",
                "backgroundColor": "#F5F3FF",
                "textColor": "#4C1D95",
                "answerColor": "#FFFFFF",
                "fontFamily": "Plus Jakarta Sans",
                "cornerRadius": 16,
                "textAlignment": "left"
            },
            "settings": {
                "showProgressBar": True,
                "showQuestionNumbers": True,
                "keyboardNav": True,
                "autoSaveDraft": True,
                "progressStyle": "percentage",
                "completionMessage": "Thank you for sharing your feedback! Your insights help us continually level up our support and product.",
                "collectResponses": True
            },
            "questions": [
                {
                    "type": "rating",
                    "title": "Overall, how satisfied are you with our platform?",
                    "description": "Select from 1 (Needs Work) to 5 (Extremely Satisfied).",
                    "required": True,
                    "settings": {"ratingMax": 5, "ratingShape": "star"}
                },
                {
                    "type": "multiple_choice",
                    "title": "Which capability has brought the most value to your workflows?",
                    "description": "Choose the one that stands out the most.",
                    "required": True,
                    "choices": [
                        "Conversational Flow Editor",
                        "Instant Live Analytics & Charts",
                        "One-Click Theme Customizer",
                        "Keyboard-First Respondent Player"
                    ]
                },
                {
                    "type": "yes_no",
                    "title": "Did you receive prompt assistance whenever you contacted support?",
                    "description": "Our team aims to respond in under 15 minutes.",
                    "required": True
                },
                {
                    "type": "number",
                    "title": "How many hours per week do you estimate Nomi saves your team?",
                    "description": "Rough estimate across form creation and response sorting.",
                    "required": False,
                    "settings": {"placeholder": "e.g. 5", "min": 0, "max": 80}
                },
                {
                    "type": "long_text",
                    "title": "What is one feature or enhancement we should build next?",
                    "description": "We read every single submission directly during sprint planning.",
                    "required": False,
                    "settings": {"placeholder": "Tell us what would make your experience 10x better..."}
                },
                {
                    "type": "email",
                    "title": "Where should we send your VIP Community invitation?",
                    "description": "We will email you access to private beta releases.",
                    "required": True,
                    "settings": {"placeholder": "you@company.com"}
                }
            ],
            "responses": [
                {
                    "hours_ago": 2,
                    "answers": {
                        0: 5,
                        1: "Conversational Flow Editor",
                        2: "Yes",
                        3: 8,
                        4: "Ability to export CSV data with automated webhook alerts.",
                        5: "chloe@hyperion.design"
                    }
                },
                {
                    "hours_ago": 5,
                    "answers": {
                        0: 5,
                        1: "Keyboard-First Respondent Player",
                        2: "Yes",
                        3: 12,
                        4: "Pre-built CRM syncing with HubSpot and Notion.",
                        5: "daniel.k@solaris.app"
                    }
                },
                {
                    "hours_ago": 14,
                    "answers": {
                        0: 4,
                        1: "One-Click Theme Customizer",
                        2: "Yes",
                        3: 4,
                        4: "Custom domain mapping for respondents.",
                        5: "mona.lisa@artefact.studio"
                    }
                },
                {
                    "hours_ago": 36,
                    "answers": {
                        0: 5,
                        1: "Instant Live Analytics & Charts",
                        2: "Yes",
                        3: 6,
                        4: "Everything has been seamless so far!",
                        5: "tariq@pulseanalytics.io"
                    }
                }
            ]
        },

        # 3. Design Sprint & Creative Brief Intake
        {
            "id": "9c45e821-3a1b-417c-a612-8e13f44c03e2",
            "title": "Design Sprint & Creative Brief Intake",
            "description": "Onboarding intake questionnaire for new design sprint clients, brand workshops, and UX discovery.",
            "status": "published",
            "language": "en",
            "theme": {
                "preset": "electric_sunset",
                "primaryColor": "#F97316",
                "backgroundColor": "#FFFBEB",
                "textColor": "#78350F",
                "answerColor": "#FFFFFF",
                "fontFamily": "Plus Jakarta Sans",
                "cornerRadius": 16,
                "textAlignment": "left"
            },
            "settings": {
                "showProgressBar": True,
                "showQuestionNumbers": True,
                "keyboardNav": True,
                "autoSaveDraft": True,
                "progressStyle": "fraction",
                "completionMessage": "Creative brief submitted! Our design lead will review your answers and schedule our kick-off call.",
                "collectResponses": True
            },
            "questions": [
                {
                    "type": "short_text",
                    "title": "What is the project or company name?",
                    "description": "The brand or venture we are designing for.",
                    "required": True,
                    "settings": {"placeholder": "e.g. Luminary AI"}
                },
                {
                    "type": "dropdown",
                    "title": "What is the primary aesthetic direction you envision?",
                    "description": "Select the visual mood that best captures your aspirations.",
                    "required": True,
                    "choices": [
                        "Editorial & Typographic (High Elegance)",
                        "Vibrant & Playful (Modern Web3 / Neo-Pop)",
                        "Clean & Minimalist (Swiss Grid / Scandinavian)",
                        "Futuristic & Cyber (Dark Mode / High Contrast)",
                        "Organic & Warm (Earthy / Tactile)"
                    ]
                },
                {
                    "type": "multiple_choice",
                    "title": "What deliverables are highest priority for this sprint?",
                    "description": "Select the core deliverable required for milestone 1.",
                    "required": True,
                    "choices": [
                        "Full Brand Identity & Design System",
                        "Marketing Landing Page & Micro-Interactions",
                        "Web App Product UI / UX Redesign",
                        "Mobile Application Design (iOS / Android)"
                    ]
                },
                {
                    "type": "rating",
                    "title": "How tight is your target launch schedule?",
                    "description": "1 = Very flexible timeline, 5 = Urgent sprint launch within 2 weeks.",
                    "required": True,
                    "settings": {"ratingMax": 5, "ratingShape": "star"}
                },
                {
                    "type": "yes_no",
                    "title": "Do you already have existing brand assets or vector logos?",
                    "description": "Helps us know if we are building from scratch or refining an existing base.",
                    "required": True
                },
                {
                    "type": "long_text",
                    "title": "Tell us about your target audience and the primary message you want to communicate.",
                    "description": "Feel free to share links to moodboards, inspirations, or competitor benchmarks.",
                    "required": False,
                    "settings": {"placeholder": "Who are they, what problem are we solving for them, and how should they feel?"}
                }
            ],
            "responses": [
                {
                    "hours_ago": 4,
                    "answers": {
                        0: "Vesper Studios",
                        1: "Editorial & Typographic (High Elegance)",
                        2: "Marketing Landing Page & Micro-Interactions",
                        3: 4,
                        4: "Yes",
                        5: "High-net-worth creators looking for bespoke portfolio staging. They care deeply about aesthetics and micro-animations."
                    }
                },
                {
                    "hours_ago": 16,
                    "answers": {
                        0: "Aura Health",
                        1: "Organic & Warm (Earthy / Tactile)",
                        2: "Mobile Application Design (iOS / Android)",
                        3: 3,
                        4: "Yes",
                        5: "Mindfulness and sleep tracking app designed for professionals seeking calm routines."
                    }
                },
                {
                    "hours_ago": 28,
                    "answers": {
                        0: "Kinetix Robotics",
                        1: "Futuristic & Cyber (Dark Mode / High Contrast)",
                        2: "Web App Product UI / UX Redesign",
                        3: 5,
                        4: "No",
                        5: "Industrial robotics telemetry console for hardware engineers."
                    }
                }
            ]
        },

        # 4. Developer Tooling & API Experience
        {
            "id": "5d89f132-8b4e-462a-9e73-1f67d25a04f3",
            "title": "Developer Tooling & API Experience",
            "description": "Developer ergonomics study covering SDK preferences, documentation readability, and latency requirements.",
            "status": "published",
            "language": "en",
            "theme": {
                "preset": "cyber_neon",
                "primaryColor": "#22C55E",
                "backgroundColor": "#050811",
                "textColor": "#F0FDF4",
                "answerColor": "#0F172A",
                "fontFamily": "Plus Jakarta Sans",
                "cornerRadius": 14,
                "textAlignment": "left"
            },
            "settings": {
                "showProgressBar": True,
                "showQuestionNumbers": True,
                "keyboardNav": True,
                "autoSaveDraft": True,
                "progressStyle": "percentage",
                "completionMessage": "Thanks for sharing your developer insights! We are actively tuning our SDKs based on your feedback.",
                "collectResponses": True
            },
            "questions": [
                {
                    "type": "short_text",
                    "title": "What is your primary programming language or framework?",
                    "description": "e.g. TypeScript / Next.js, Python / FastAPI, Rust, Go",
                    "required": True,
                    "settings": {"placeholder": "e.g. TypeScript / Next.js"}
                },
                {
                    "type": "multiple_choice",
                    "title": "How do you prefer to consume API integrations?",
                    "description": "Select the interface that integrates most cleanly into your stack.",
                    "required": True,
                    "choices": [
                        "Type-safe SDK client (npm / pip)",
                        "Standard RESTful JSON endpoints with OpenAPI spec",
                        "GraphQL Query & Mutation Schema",
                        "Server-Sent Events & Realtime WebSockets"
                    ]
                },
                {
                    "type": "dropdown",
                    "title": "Where do you primarily host and deploy your services?",
                    "description": "Helps us optimize our edge distribution regions.",
                    "required": False,
                    "choices": [
                        "Vercel / Next.js Edge",
                        "AWS (ECS / Lambda / Fargate)",
                        "Cloudflare Workers & Pages",
                        "Google Cloud Platform (Cloud Run / GKE)",
                        "Self-hosted Docker / Kubernetes"
                    ]
                },
                {
                    "type": "rating",
                    "title": "How would you rate the speed and clarity of our API documentation?",
                    "description": "1 = Incomplete / confusing, 5 = Crystal clear interactive docs.",
                    "required": True,
                    "settings": {"ratingMax": 5, "ratingShape": "star"}
                },
                {
                    "type": "yes_no",
                    "title": "Would you like early access to our official TypeScript CLI & Webhook Simulator?",
                    "description": "Test and replay events locally during development.",
                    "required": True
                },
                {
                    "type": "email",
                    "title": "What is your GitHub or engineering email?",
                    "description": "We will send your developer beta invite key here.",
                    "required": True,
                    "settings": {"placeholder": "dev@company.io"}
                }
            ],
            "responses": [
                {
                    "hours_ago": 3,
                    "answers": {
                        0: "TypeScript / Next.js 14",
                        1: "Type-safe SDK client (npm / pip)",
                        2: "Vercel / Next.js Edge",
                        3: 5,
                        4: "Yes",
                        5: "alex.dev@stackflow.io"
                    }
                },
                {
                    "hours_ago": 9,
                    "answers": {
                        0: "Python / FastAPI",
                        1: "Standard RESTful JSON endpoints with OpenAPI spec",
                        2: "AWS (ECS / Lambda / Fargate)",
                        3: 4,
                        4: "Yes",
                        5: "kenji@neuralcore.ai"
                    }
                },
                {
                    "hours_ago": 22,
                    "answers": {
                        0: "Go / Gin",
                        1: "Server-Sent Events & Realtime WebSockets",
                        2: "Google Cloud Platform (Cloud Run / GKE)",
                        3: 5,
                        4: "Yes",
                        5: "sophia.g@streamline.tech"
                    }
                },
                {
                    "hours_ago": 48,
                    "answers": {
                        0: "Rust / Axum",
                        1: "Type-safe SDK client (npm / pip)",
                        2: "Cloudflare Workers & Pages",
                        3: 5,
                        4: "Yes",
                        5: "devon@hyperedge.network"
                    }
                }
            ]
        }
    ]

    for form_info in forms_data:
        form_id = form_info["id"]
        # Delete existing form with this ID if present for clean idempotent seeding
        existing_form = db.query(FormModel).filter(FormModel.id == form_id).first()
        if existing_form:
            print(f"Cleaning up existing form {form_id} ({form_info['title']})...")
            db.delete(existing_form)
            db.commit()

        print(f"Seeding form: '{form_info['title']}' ({form_id})...")
        form_model = FormModel(
            id=form_id,
            title=form_info["title"],
            description=form_info["description"],
            status=form_info["status"],
            language=form_info["language"],
            theme=form_info["theme"],
            settings=form_info["settings"]
        )
        db.add(form_model)
        db.commit()
        db.refresh(form_model)

        created_questions = []
        for idx, q_data in enumerate(form_info["questions"]):
            q = QuestionModel(
                form_id=form_model.id,
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

        # Seed responses
        for resp_data in form_info.get("responses", []):
            sub_time = datetime.now(timezone.utc) - timedelta(hours=resp_data.get("hours_ago", 1))
            resp_model = ResponseModel(
                form_id=form_model.id,
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

        print(f"  -> Added {len(created_questions)} questions and {len(form_info.get('responses', []))} responses.")

    print("\nDatabase seeding completed successfully for all 4 published forms!")
    db.close()

if __name__ == "__main__":
    seed()
