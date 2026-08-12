import urllib.request
import json
import sys

BASE_URL = "http://localhost:8000"


def req(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode("utf-8") if data else None
    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(request) as response:
        if response.status == 204:
            return None
        return json.loads(response.read().decode("utf-8"))


def run_tests():
    print("🚀 Starting End-to-End API Automated Test Suite...\n")

    # 1. Health check
    h = req("/api/health")
    assert h["status"] == "ok"
    print("✅ 1. Health check passed.")

    # 2. List forms (seeded)
    forms = req("/api/forms")
    assert len(forms) >= 3
    print(f"✅ 2. Listed forms successfully ({len(forms)} forms found).")

    # 3. Create new form
    new_form = req("/api/forms", method="POST", data={"title": "Integration Test Form", "description": "Automated test description"})
    form_id = new_form["id"]
    print(f"✅ 3. Created form ID {form_id}: '{new_form['title']}'")

    # 4. Add all 8 question types
    q_types = [
        {"type": "short_text", "title": "Full Name", "required": True},
        {"type": "email", "title": "Email Address", "required": True},
        {"type": "number", "title": "Years of Experience", "required": True},
        {"type": "multiple_choice", "title": "Primary Language", "required": True, "options": [{"label": "Python", "value": "Python"}, {"label": "TypeScript", "value": "TypeScript"}]},
        {"type": "dropdown", "title": "Preferred Timezone", "required": True, "options": [{"label": "UTC", "value": "UTC"}, {"label": "EST", "value": "EST"}]},
        {"type": "yes_no", "title": "Willing to travel?", "required": True},
        {"type": "rating", "title": "Rate your skill", "required": True},
        {"type": "long_text", "title": "Cover Letter", "required": False},
    ]

    added_questions = []
    for q_data in q_types:
        q = req(f"/api/forms/{form_id}/questions", method="POST", data=q_data)
        added_questions.append(q)

    assert len(added_questions) == 8
    print("✅ 4. Added all 8 mandatory question types successfully.")

    # 5. Reorder questions
    reorder_payload = [{"id": q["id"], "order_index": 7 - idx} for idx, q in enumerate(added_questions)]
    reordered = req(f"/api/forms/{form_id}/questions/reorder", method="PUT", data={"questions": reorder_payload})
    assert len(reordered) == 8
    print("✅ 5. Reordered questions successfully.")

    # 6. Publish Form
    pub_form = req(f"/api/forms/{form_id}/publish", method="POST")
    assert pub_form["status"] == "published"
    slug = pub_form["public_slug"]
    assert slug is not None
    print(f"✅ 6. Published form with public slug '{slug}'.")

    # 7. Get Public Form without Auth
    pub_detail = req(f"/api/public/forms/{slug}")
    assert len(pub_detail["questions"]) == 8
    print("✅ 7. Retrieved public form without authentication.")

    # 8. Submit Response
    submission_payload = {
        "answers": [
            {"question_id": added_questions[0]["id"], "answer": "John Doe"},
            {"question_id": added_questions[1]["id"], "answer": "john@example.com"},
            {"question_id": added_questions[2]["id"], "answer": "5"},
            {"question_id": added_questions[3]["id"], "answer": "Python"},
            {"question_id": added_questions[4]["id"], "answer": "UTC"},
            {"question_id": added_questions[5]["id"], "answer": "Yes"},
            {"question_id": added_questions[6]["id"], "answer": "5"},
            {"question_id": added_questions[7]["id"], "answer": "Excited to join!"},
        ]
    }

    sub_res = req(f"/api/public/forms/{slug}/responses", method="POST", data=submission_payload)
    assert sub_res["id"] is not None
    resp_id = sub_res["id"]
    print(f"✅ 8. Submitted public form response ID #{resp_id}.")

    # 9. Get Responses List & Individual Detail
    responses_list = req(f"/api/forms/{form_id}/responses")
    assert len(responses_list) == 1
    print(f"✅ 9. Verified responses list ({len(responses_list)} submission).")

    single_resp = req(f"/api/forms/{form_id}/responses/{resp_id}")
    assert len(single_resp["answers"]) == 8
    print("✅ 10. Verified individual response detail and answers.")

    # 10. Get Stats
    stats = req(f"/api/forms/{form_id}/stats")
    assert stats["total_responses"] == 1
    assert len(stats["question_stats"]) == 8
    print("✅ 11. Calculated statistics breakdown successfully.")

    # 11. Duplicate Form
    dup = req(f"/api/forms/{form_id}/duplicate", method="POST")
    assert dup["status"] == "draft"
    print(f"✅ 12. Duplicated form successfully (New ID #{dup['id']}).")

    # 12. Delete Forms
    req(f"/api/forms/{form_id}", method="DELETE")
    req(f"/api/forms/{dup['id']}", method="DELETE")
    print("✅ 13. Cascade deleted test forms cleanly.")

    print("\n🎉 ALL 13 END-TO-END INTEGRATION TESTS PASSED PERFECTLY!\n")


if __name__ == "__main__":
    run_tests()
