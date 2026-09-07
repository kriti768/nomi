import unittest
from fastapi.testclient import TestClient
from app.main import app

class TestFormaAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_01_health_check(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("status"), "ok")

    def test_02_form_crud_and_duplication(self):
        # 1. Create Form
        create_res = self.client.post("/api/forms", json={
            "title": "Customer Feedback Survey",
            "description": "Tell us what you think of Nomi",
            "language": "en",
            "theme": {
                "preset": "forma_default",
                "primaryColor": "#6366F1",
                "backgroundColor": "#FFFFFF",
                "textColor": "#0F172A",
                "fontFamily": "Plus Jakarta Sans"
            }
        })
        self.assertEqual(create_res.status_code, 201)
        form = create_res.json()
        form_id = form["id"]
        self.assertEqual(form["title"], "Customer Feedback Survey")
        self.assertEqual(form["status"], "draft")

        # 2. Get Form
        get_res = self.client.get(f"/api/forms/{form_id}")
        self.assertEqual(get_res.status_code, 200)
        self.assertEqual(get_res.json()["id"], form_id)

        # 3. Update Form
        update_res = self.client.put(f"/api/forms/{form_id}", json={
            "title": "Updated Customer Survey"
        })
        self.assertEqual(update_res.status_code, 200)
        self.assertEqual(update_res.json()["title"], "Updated Customer Survey")

        # 4. Duplicate Form
        dup_res = self.client.post(f"/api/forms/{form_id}/duplicate")
        self.assertEqual(dup_res.status_code, 201)
        dup_form = dup_res.json()
        self.assertEqual(dup_form["title"], "Updated Customer Survey (Copy)")
        self.assertNotEqual(dup_form["id"], form_id)

        # Clean up duplicated form
        del_dup = self.client.delete(f"/api/forms/{dup_form['id']}")
        self.assertEqual(del_dup.status_code, 200)

        # Clean up original form
        del_orig = self.client.delete(f"/api/forms/{form_id}")
        self.assertEqual(del_orig.status_code, 200)

    def test_03_questions_and_reordering(self):
        # Create Form
        form_res = self.client.post("/api/forms", json={"title": "Product Questionnaire"})
        form_id = form_res.json()["id"]

        # Add Short Text
        q1_res = self.client.post(f"/api/forms/{form_id}/questions", json={
            "type": "short_text",
            "title": "What is your name?",
            "required": True,
            "position": 0
        })
        self.assertEqual(q1_res.status_code, 201)
        q1 = q1_res.json()

        # Add Multiple Choice
        q2_res = self.client.post(f"/api/forms/{form_id}/questions", json={
            "type": "multiple_choice",
            "title": "How did you hear about us?",
            "required": False,
            "position": 1,
            "choices": [
                {"label": "Search Engine", "position": 0},
                {"label": "Social Media", "position": 1},
                {"label": "Friend Referral", "position": 2}
            ]
        })
        self.assertEqual(q2_res.status_code, 201)
        q2 = q2_res.json()
        self.assertEqual(len(q2["choices"]), 3)

        # Reorder Questions
        reorder_res = self.client.put(f"/api/forms/{form_id}/questions/reorder", json=[
            {"id": q2["id"], "position": 0},
            {"id": q1["id"], "position": 1}
        ])
        self.assertEqual(reorder_res.status_code, 200)
        reordered = reorder_res.json()
        self.assertEqual(reordered[0]["id"], q2["id"])
        self.assertEqual(reordered[1]["id"], q1["id"])

        # Delete question
        del_q = self.client.delete(f"/api/questions/{q2['id']}")
        self.assertEqual(del_q.status_code, 200)

        # Clean up form
        self.client.delete(f"/api/forms/{form_id}")

    def test_04_public_flow_and_response_validation(self):
        # Create form with multiple validated fields
        form_res = self.client.post("/api/forms", json={"title": "Validated Registration Form"})
        form_id = form_res.json()["id"]

        # Required text
        q_name_res = self.client.post(f"/api/forms/{form_id}/questions", json={
            "type": "short_text",
            "title": "Full Name",
            "required": True,
            "position": 0
        })
        q_name_id = q_name_res.json()["id"]

        # Required email
        q_email_res = self.client.post(f"/api/forms/{form_id}/questions", json={
            "type": "email",
            "title": "Work Email",
            "required": True,
            "position": 1
        })
        q_email_id = q_email_res.json()["id"]

        # Number with min and max
        q_num_res = self.client.post(f"/api/forms/{form_id}/questions", json={
            "type": "number",
            "title": "Team Size",
            "required": False,
            "position": 2,
            "settings": {"min": 1, "max": 100}
        })
        q_num_id = q_num_res.json()["id"]

        # Public access before publish should return 403
        pub_check_draft = self.client.get(f"/api/forms/{form_id}/public")
        self.assertEqual(pub_check_draft.status_code, 403)

        # Publish form
        pub_res = self.client.post(f"/api/forms/{form_id}/publish")
        self.assertEqual(pub_res.status_code, 200)
        self.assertEqual(pub_res.json()["status"], "published")

        # Public access after publish should return 200
        pub_check_ok = self.client.get(f"/api/forms/{form_id}/public")
        self.assertEqual(pub_check_ok.status_code, 200)

        # 1. Test missing required field -> 422
        sub_fail_req = self.client.post(f"/api/forms/{form_id}/responses", json={
            "answers": [
                {"question_id": q_email_id, "value": "alice@example.com"}
            ]
        })
        self.assertEqual(sub_fail_req.status_code, 422)

        # 2. Test invalid email -> 422
        sub_fail_email = self.client.post(f"/api/forms/{form_id}/responses", json={
            "answers": [
                {"question_id": q_name_id, "value": "Alice Smith"},
                {"question_id": q_email_id, "value": "not-an-email"}
            ]
        })
        self.assertEqual(sub_fail_email.status_code, 422)

        # 3. Test invalid number out of bounds -> 422
        sub_fail_num = self.client.post(f"/api/forms/{form_id}/responses", json={
            "answers": [
                {"question_id": q_name_id, "value": "Alice Smith"},
                {"question_id": q_email_id, "value": "alice@example.com"},
                {"question_id": q_num_id, "value": 500}
            ]
        })
        self.assertEqual(sub_fail_num.status_code, 422)

        # 4. Test valid submission -> 201
        sub_valid = self.client.post(f"/api/forms/{form_id}/responses", json={
            "answers": [
                {"question_id": q_name_id, "value": "Alice Smith"},
                {"question_id": q_email_id, "value": "alice@example.com"},
                {"question_id": q_num_id, "value": 12}
            ]
        })
        self.assertEqual(sub_valid.status_code, 201)

        # 5. Fetch responses
        responses_res = self.client.get(f"/api/forms/{form_id}/responses")
        self.assertEqual(responses_res.status_code, 200)
        self.assertEqual(len(responses_res.json()), 1)

        # 6. Clear responses
        clear_res = self.client.delete(f"/api/forms/{form_id}/responses")
        self.assertEqual(clear_res.status_code, 200)

        # Check responses empty
        responses_after = self.client.get(f"/api/forms/{form_id}/responses")
        self.assertEqual(len(responses_after.json()), 0)

        # Clean up
        self.client.delete(f"/api/forms/{form_id}")

if __name__ == "__main__":
    unittest.main()
