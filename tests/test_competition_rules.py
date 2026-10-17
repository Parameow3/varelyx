import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RULES = json.loads((ROOT / "competition_rules.json").read_text())


def test_authoritative_rule_override_is_locked():
    assert RULES["authority"]["official_overrides_repo"] is True
    assert RULES["authority"]["portal_is_authoritative_for_final_form_fields"] is True


def test_eligibility_and_deadlines_are_locked():
    e = RULES["eligibility"]
    assert (e["team_min"], e["team_max"]) == (2, 4)
    assert e["minimum_age"] == 21
    assert e["region"] == "JAPAC"
    assert e["working_professionals_only"] is True
    assert e["students_eligible"] is False
    assert e["team_formation_deadline"] == "2026-10-17"
    assert RULES["timeline"]["prototype_submission_deadline"] == "2026-10-18"


def test_cardless_firebase_path_is_locked():
    v = RULES["varelyx"]
    assert v["theme"].startswith("Retail & Commerce")
    assert v["google_ai_required"] is True
    assert v["cloud_deployment_required"] is True
    assert v["primary_deployment"].startswith("Firebase Hosting")
    assert "Gemini Developer API" in v["primary_ai_path"]
    assert v["billing_account_required_for_primary_path"] is False
    assert v["payment_method_required_for_primary_path"] is False
    assert v["cloud_run_optional"] is True
    assert v["vertex_ai_optional"] is True
    assert v["vercel_required"] is False
    assert v["supabase_required"] is False
    assert v["live_google_ai_must_be_verified_before_submission"] is True


def test_submission_package_requirements_are_locked():
    s = RULES["submission"]
    assert s["working_prototype_required"] is True
    assert s["proposal_pdf_required"] is True
    assert s["public_demo_video_required"] is True
    assert (s["demo_video_min_minutes"], s["demo_video_max_minutes"]) == (3, 4)
    assert s["brief_description_max_characters"] == 1024
    assert s["deck_pdf_max_mb"] == 5
    assert s["english_materials_required"] is True
    assert s["public_repository_required"] is True
    assert s["brief_description_required"] is True
    assert s["prescribed_deck_template_required"] is True


def test_judging_weights_total_100():
    assert sum(RULES["judging"].values()) == 100


def test_integrity_guardrails_are_locked():
    assert all(RULES["integrity"].values())


def test_static_firebase_submission_assets_exist():
    for path in ["firebase.json", "database.rules.json", "public/index.html",
                 "public/app.js", "public/firebase-config.js", "public/core.mjs",
                 "public/session.mjs", "public/firebase-transport.mjs"]:
        assert (ROOT / path).exists()
    app = (ROOT / "public/app.js").read_text()
    core = (ROOT / "public/core.mjs").read_text()
    transport = (ROOT / "public/firebase-transport.mjs").read_text()
    assert "GoogleAIBackend" in app
    assert "gemini-3.5-flash-lite" in core
    assert "VerifiedSession" in app
    assert "createRestTransport" in app
    assert "X-Firebase-AppCheck" in transport
    assert "if-match" in transport
    # Functional persistence/constraint tests run in tests/web.test.mjs.
