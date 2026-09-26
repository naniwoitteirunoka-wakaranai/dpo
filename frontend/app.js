const API = "http://localhost:5000/api";

// -------------------- Navigation --------------------

function showTab(tab) {
    document.querySelectorAll(".tab").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(tab).classList.add("active");

    if (tab === "assessmentHistory") loadAssessments();
    if (tab === "incidentHistory") loadIncidents();
}

// -------------------- Helpers --------------------

function yesNo(id) {
    return document.getElementById(id).value === "true";
}

function badge(level) {
    return `<span class="badge ${level}">${level}</span>`;
}

function showError(message) {
    let box = document.getElementById("errorBox");

    if (!box) {
        box = document.createElement("div");
        box.id = "errorBox";
        box.style.background = "#7f1d1d";
        box.style.border = "1px solid #dc2626";
        box.style.color = "#fecaca";
        box.style.padding = "12px";
        box.style.borderRadius = "10px";
        box.style.marginBottom = "18px";

        document.querySelector("main").prepend(box);
    }

    box.innerText = message;
    box.style.display = "block";
}

function clearError() {
    const box = document.getElementById("errorBox");
    if (box) box.style.display = "none";
}

// -------------------- Example --------------------

function loadExample() {
    use_case.value = "Customer Support Ticket Summarization";
    description.value =
        "An organization uses an external Generative AI service to summarize customer-support tickets.";

    personal_data.value = "true";
    sensitive_data.value = "true";
    external_ai.value = "true";
    retention.value = "true";
    consent.value = "false";

    affected_users.value = 250;
}

// -------------------- Incident Example --------------------

function loadIncidentExample() {

    incident_type.value = "Unauthorized GenAI Upload";

    incident_description.value =
        "An employee accidentally uploaded a customer database to an external Generative AI service.";

    data_exposed.value =
        "Customer names, email addresses, phone numbers and account IDs.";

    incident_sensitive.value = "true";
    incident_external.value = "true";

    incident_users.value = 250;

    clearError();
}

// -------------------- Risk Assessment --------------------

async function submitAssessment() {

    clearError();

    const useCase = use_case.value.trim();
    const desc = description.value.trim();
    const users = Number(affected_users.value || 0);

    if (!useCase) {
        showError("Please enter a Use Case Name.");
        use_case.focus();
        return;
    }

    if (!desc) {
        showError("Please enter a Description.");
        description.focus();
        return;
    }

    if (users < 0) {
        showError("Affected Users cannot be negative.");
        affected_users.focus();
        return;
    }

    const button = event.target;
    button.disabled = true;
    button.innerText = "Calculating...";

    const payload = {
        use_case: useCase,
        description: desc,
        personal_data: yesNo("personal_data"),
        sensitive_data: yesNo("sensitive_data"),
        external_ai: yesNo("external_ai"),
        retention: yesNo("retention"),
        consent: yesNo("consent"),
        affected_users: users
    };

    try {
        const response = await fetch(`${API}/assess`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }

        clearError();

        riskResult.classList.remove("hidden");

        riskResult.innerHTML = `
            <h2>Risk Assessment Result</h2>

            ${badge(data.risk_level)}

            <h3>Risk Score = ${data.risk_score} / 6</h3>

            <h4>Recommended DPO Actions</h4>

            <ul>
                ${data.recommendations
                    .map(item => `<li>${item}</li>`)
                    .join("")}
            </ul>
        `;

        loadStats();
        loadAssessments();

    } catch (error) {
        showError(error.message || "Unable to calculate risk.");
    }

    button.disabled = false;
    button.innerText = "Calculate Risk";
}

// -------------------- Incident Management --------------------

async function submitIncident() {

    clearError();

    const type = incident_type.value.trim();
    const desc = incident_description.value.trim();
    const exposed = data_exposed.value.trim();
    const users = Number(incident_users.value || 0);

    if (!type) {
        showError("Please enter an Incident Type.");
        incident_type.focus();
        return;
    }

    if (!desc) {
        showError("Please enter an Incident Description.");
        incident_description.focus();
        return;
    }

    if (!exposed) {
        showError("Please enter the Data Exposed.");
        data_exposed.focus();
        return;
    }

    if (users < 0) {
        showError("Affected Users cannot be negative.");
        incident_users.focus();
        return;
    }

    const button = event.target;
    button.disabled = true;
    button.innerText = "Assessing...";

    const payload = {
        incident_type: type,
        description: desc,
        data_exposed: exposed,
        sensitive_data: yesNo("incident_sensitive"),
        external_ai: yesNo("incident_external"),
        affected_users: users
    };

    try {
        const response = await fetch(`${API}/incidents`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }

        clearError();

        incidentResult.classList.remove("hidden");

        incidentResult.innerHTML = `
            <h2>Incident Severity Result</h2>

            ${badge(data.severity)}

            <h3>Incident Score = ${data.incident_score}</h3>

            <h4>Recommended Response Actions</h4>

            <ul>
                ${data.actions
                    .map(item => `<li>${item}</li>`)
                    .join("")}
            </ul>
        `;

        loadStats();
        loadIncidents();

    } catch (error) {
        showError(error.message || "Unable to assess incident.");
    }

    button.disabled = false;
    button.innerText = "Assess Incident";
}

// -------------------- Assessment History --------------------

async function loadAssessments() {

    try {

        const response = await fetch(`${API}/assessments`);
        const data = await response.json();

        assessmentTable.innerHTML = "";

        data.data.forEach(item => {

            assessmentTable.innerHTML += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.use_case}</td>
                    <td>${badge(item.risk_level)}</td>
                    <td>${item.risk_score}</td>
                    <td>${item.created_at}</td>
                </tr>
            `;
        });

    } catch {
        assessmentTable.innerHTML =
            "<tr><td colspan='5'>Unable to load assessments.</td></tr>";
    }
}

// -------------------- Incident History --------------------

async function loadIncidents() {

    try {

        const response = await fetch(`${API}/incidents`);
        const data = await response.json();

        incidentTable.innerHTML = "";

        data.data.forEach(item => {

            incidentTable.innerHTML += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.incident_type}</td>
                    <td>${badge(item.severity)}</td>
                    <td>${item.status}</td>
                    <td>${item.created_at}</td>
                </tr>
            `;
        });

    } catch {
        incidentTable.innerHTML =
            "<tr><td colspan='5'>Unable to load incidents.</td></tr>";
    }
}

// -------------------- Dashboard Stats --------------------

async function loadStats() {

    try {

        const response = await fetch(`${API}/stats`);
        const data = await response.json();

        totalAssessments.innerText = data.total_assessments;
        highAssessments.innerText = data.high_critical_assessments;
        openIncidents.innerText = data.open_incidents;
        criticalIncidents.innerText = data.critical_incidents;

    } catch {
        console.log("Backend not running.");
    }
}

// -------------------- Initial Load --------------------

loadStats();
loadAssessments();
loadIncidents();