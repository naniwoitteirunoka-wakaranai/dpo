from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime
from openpyxl import Workbook
from openpyxl.styles import Font

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXPORT_DIR = os.path.join(BASE_DIR, "exports")

os.makedirs(EXPORT_DIR, exist_ok=True)

# ==========================================================
# DATABASE
# ==========================================================

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS assessments(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            use_case TEXT NOT NULL,
            description TEXT NOT NULL,
            personal_data INTEGER,
            sensitive_data INTEGER,
            external_ai INTEGER,
            retention INTEGER,
            consent INTEGER,
            affected_users INTEGER,
            risk_score INTEGER,
            risk_level TEXT,
            created_at TEXT
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS incidents(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_type TEXT NOT NULL,
            description TEXT NOT NULL,
            data_exposed TEXT,
            sensitive_data INTEGER,
            external_ai INTEGER,
            affected_users INTEGER,
            incident_score INTEGER,
            severity TEXT,
            status TEXT DEFAULT 'OPEN',
            created_at TEXT
        )
    """)

    conn.commit()
    conn.close()


init_db()

# ==========================================================
# RISK ENGINE
# Formula:
# R = P + 2S + E + D + (1-C)
# ==========================================================

def calculate_risk_score(personal, sensitive, external, retention, consent):
    P = int(personal)
    S = int(sensitive)
    E = int(external)
    D = int(retention)
    C = int(consent)

    score = P + (2 * S) + E + D + (1 - C)
    return score


def classify_risk(score):
    if score <= 1:
        return "LOW"
    elif score <= 3:
        return "MEDIUM"
    elif score <= 5:
        return "HIGH"
    return "CRITICAL"


def generate_recommendations(data, level):
    recs = []

    if data["personal_data"]:
        recs.extend([
            "Apply data minimization before sending prompts to GenAI.",
            "Restrict access to personal information.",
            "Review prompt content for unnecessary identifiers."
        ])

    if data["sensitive_data"]:
        recs.extend([
            "Conduct an additional privacy impact review.",
            "Apply stronger security controls for sensitive information."
        ])

    if data["external_ai"]:
        recs.extend([
            "Review the external GenAI provider before deployment.",
            "Verify data-processing agreements with the provider.",
            "Avoid sending unnecessary personal information."
        ])

    if data["retention"]:
        recs.append("Review retention and deletion policies for GenAI outputs.")

    if not data["consent"]:
        recs.append("Require DPO or legal approval before deployment.")

    if level in ["HIGH", "CRITICAL"]:
        recs.extend([
            "Perform a formal privacy risk assessment.",
            "Implement monitoring before production deployment."
        ])

    if level == "CRITICAL":
        recs.extend([
            "Escalate the use case to senior privacy governance.",
            "Block deployment until mitigation controls are completed."
        ])

    return list(dict.fromkeys(recs))

# ==========================================================
# INCIDENT ENGINE
# ==========================================================

FINANCIAL_KEYWORDS = [
    "account",
    "bank",
    "upi",
    "card",
    "credit",
    "debit",
    "financial"
]


def calculate_incident_score(sensitive, external, users, exposed_text):
    score = 0

    if sensitive:
        score += 2

    if external:
        score += 1

    if users >= 500:
        score += 2
    elif users >= 100:
        score += 1

    text = exposed_text.lower()

    if any(word in text for word in FINANCIAL_KEYWORDS):
        score += 1

    return score


def classify_incident(score):
    if score <= 1:
        return "LOW"
    elif score <= 3:
        return "MEDIUM"
    elif score <= 5:
        return "HIGH"
    return "CRITICAL"


def incident_actions(severity, data):
    actions = [
        "Contain the incident immediately.",
        "Identify exposed personal data.",
        "Estimate affected individuals.",
        "Document the incident for DPO review."
    ]

    if data["sensitive_data"]:
        actions.append("Assess impact of sensitive data exposure.")

    if data["external_ai"]:
        actions.append("Review external AI provider interaction and logs.")

    if severity in ["HIGH", "CRITICAL"]:
        actions.extend([
            "Escalate incident for DPO review.",
            "Review notification and escalation requirements.",
            "Begin remediation activities."
        ])

    if severity == "CRITICAL":
        actions.extend([
            "Pause affected GenAI workflow until investigation completes.",
            "Perform root-cause analysis.",
            "Implement additional privacy safeguards."
        ])

    actions.append("Close incident after remediation is verified.")

    return list(dict.fromkeys(actions))

# ==========================================================
# HELPERS
# ==========================================================

def validation_error(message):
    return jsonify({
        "success": False,
        "error": message
    }), 400


def current_time():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def bool_value(value):
    return bool(value)


def serialize_rows(rows):
    return [dict(row) for row in rows]
# ==========================================================
# HEALTH API
# ==========================================================

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "GenAI DPO Framework API"
    })


# ==========================================================
# RISK ASSESSMENT API
# ==========================================================

@app.route("/api/assess", methods=["POST"])
def assess():

    data = request.get_json(silent=True)

    if not data:
        return validation_error("Invalid JSON body.")

    required = [
        "use_case",
        "description",
        "personal_data",
        "sensitive_data",
        "external_ai",
        "retention",
        "consent"
    ]

    for field in required:
        if field not in data:
            return validation_error(f"Missing field: {field}")

    score = calculate_risk_score(
        data["personal_data"],
        data["sensitive_data"],
        data["external_ai"],
        data["retention"],
        data["consent"]
    )

    level = classify_risk(score)

    recommendations = generate_recommendations(data, level)

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO assessments(
            use_case,
            description,
            personal_data,
            sensitive_data,
            external_ai,
            retention,
            consent,
            affected_users,
            risk_score,
            risk_level,
            created_at
        )
        VALUES(?,?,?,?,?,?,?,?,?,?,?)
    """, (
        data["use_case"],
        data["description"],
        int(data["personal_data"]),
        int(data["sensitive_data"]),
        int(data["external_ai"]),
        int(data["retention"]),
        int(data["consent"]),
        data.get("affected_users", 0),
        score,
        level,
        current_time()
    ))

    conn.commit()
    assessment_id = cur.lastrowid
    conn.close()

    return jsonify({
        "success": True,
        "assessment_id": assessment_id,
        "risk_score": score,
        "risk_level": level,
        "recommendations": recommendations
    })


@app.route("/api/assessments", methods=["GET"])
def assessments():

    conn = get_db()
    rows = conn.execute("""
        SELECT *
        FROM assessments
        ORDER BY id DESC
    """).fetchall()

    conn.close()

    return jsonify({
        "success": True,
        "count": len(rows),
        "data": serialize_rows(rows)
    })


# ==========================================================
# INCIDENT MANAGEMENT API
# ==========================================================

@app.route("/api/incidents", methods=["POST"])
def incidents():

    data = request.get_json(silent=True)

    if not data:
        return validation_error("Invalid JSON body.")

    required = [
        "incident_type",
        "description",
        "data_exposed",
        "sensitive_data",
        "external_ai",
        "affected_users"
    ]

    for field in required:
        if field not in data:
            return validation_error(f"Missing field: {field}")

    users = int(data["affected_users"])

    score = calculate_incident_score(
        data["sensitive_data"],
        data["external_ai"],
        users,
        data["data_exposed"]
    )

    severity = classify_incident(score)

    actions = incident_actions(severity, data)

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO incidents(
            incident_type,
            description,
            data_exposed,
            sensitive_data,
            external_ai,
            affected_users,
            incident_score,
            severity,
            status,
            created_at
        )
        VALUES(?,?,?,?,?,?,?,?,?,?)
    """, (
        data["incident_type"],
        data["description"],
        data["data_exposed"],
        int(data["sensitive_data"]),
        int(data["external_ai"]),
        users,
        score,
        severity,
        "OPEN",
        current_time()
    ))

    conn.commit()
    incident_id = cur.lastrowid
    conn.close()

    return jsonify({
        "success": True,
        "incident_id": incident_id,
        "incident_score": score,
        "severity": severity,
        "actions": actions
    })


@app.route("/api/incidents", methods=["GET"])
def get_incidents():

    conn = get_db()
    rows = conn.execute("""
        SELECT *
        FROM incidents
        ORDER BY id DESC
    """).fetchall()

    conn.close()

    return jsonify({
        "success": True,
        "count": len(rows),
        "data": serialize_rows(rows)
    })


# ==========================================================
# DASHBOARD STATS
# ==========================================================

@app.route("/api/stats", methods=["GET"])
def stats():

    conn = get_db()

    total_assessments = conn.execute(
        "SELECT COUNT(*) FROM assessments"
    ).fetchone()[0]

    high_assessments = conn.execute("""
        SELECT COUNT(*)
        FROM assessments
        WHERE risk_level IN ('HIGH','CRITICAL')
    """).fetchone()[0]

    open_incidents = conn.execute("""
        SELECT COUNT(*)
        FROM incidents
        WHERE status='OPEN'
    """).fetchone()[0]

    critical_incidents = conn.execute("""
        SELECT COUNT(*)
        FROM incidents
        WHERE severity='CRITICAL'
    """).fetchone()[0]

    conn.close()

    return jsonify({
        "success": True,
        "total_assessments": total_assessments,
        "high_critical_assessments": high_assessments,
        "open_incidents": open_incidents,
        "critical_incidents": critical_incidents
    })


# ==========================================================
# EXCEL EXPORT
# ==========================================================

@app.route("/api/export", methods=["GET"])
def export_excel():

    conn = get_db()

    assessments = conn.execute("""
        SELECT *
        FROM assessments
        ORDER BY id DESC
    """).fetchall()

    incidents = conn.execute("""
        SELECT *
        FROM incidents
        ORDER BY id DESC
    """).fetchall()

    conn.close()

    wb = Workbook()

    ws = wb.active
    ws.title = "Risk Assessments"

    headers = [
        "ID",
        "Use Case",
        "Description",
        "Personal Data",
        "Sensitive Data",
        "External AI",
        "Retention",
        "Consent",
        "Risk Score",
        "Risk Level",
        "Created At"
    ]

    for col, header in enumerate(headers, start=1):
        cell = ws.cell(row=1, column=col)
        cell.value = header
        cell.font = Font(bold=True)

    row_no = 2

    for item in assessments:
        ws.append([
            item["id"],
            item["use_case"],
            item["description"],
            "YES" if item["personal_data"] else "NO",
            "YES" if item["sensitive_data"] else "NO",
            "YES" if item["external_ai"] else "NO",
            "YES" if item["retention"] else "NO",
            "YES" if item["consent"] else "NO",
            item["risk_score"],
            item["risk_level"],
            item["created_at"]
        ])
        row_no += 1

    ws2 = wb.create_sheet("Incidents")

    headers2 = [
        "ID",
        "Incident Type",
        "Description",
        "Sensitive Data",
        "External AI",
        "Affected Users",
        "Incident Score",
        "Severity",
        "Status",
        "Created At"
    ]

    for col, header in enumerate(headers2, start=1):
        cell = ws2.cell(row=1, column=col)
        cell.value = header
        cell.font = Font(bold=True)

    for item in incidents:
        ws2.append([
            item["id"],
            item["incident_type"],
            item["description"],
            "YES" if item["sensitive_data"] else "NO",
            "YES" if item["external_ai"] else "NO",
            item["affected_users"],
            item["incident_score"],
            item["severity"],
            item["status"],
            item["created_at"]
        ])

    filename = os.path.join(
        EXPORT_DIR,
        f"GenAI_DPO_Assessments_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    )

    wb.save(filename)

    return send_file(
        filename,
        as_attachment=True,
        download_name="GenAI_DPO_Framework_Report.xlsx"
    )


# ==========================================================
# ROOT API
# ==========================================================

@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "message": "GenAI DPO Framework Backend Running",
        "frontend": "http://localhost:5500",
        "health": "/api/health"
    })


# ==========================================================
# APP RUNNER
# ==========================================================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
