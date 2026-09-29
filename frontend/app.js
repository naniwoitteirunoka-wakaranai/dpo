const API = "https://dpo-kng0.onrender.com/api";

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

// -------------------- Real-World Examples --------------------
//
// These examples are based on documented real-world GenAI
// privacy/security incidents from 2023, 2024, 2025 and 2026.
//
// 2023 - OpenAI ChatGPT data exposure
// 2024 - Australian Child Protection worker using ChatGPT
// 2025 - Italian DPA action against DeepSeek
// 2026 - OpenAI/Hugging Face security incident
//

const REAL_CASES = [

    // -------------------- 2023 --------------------

    {
        name: "OpenAI ChatGPT Data Exposure (2023)",

        assessment: {
            use_case: "ChatGPT User Data Processing",

            description:
                "A bug in ChatGPT caused some users to see titles from another user's chat history. OpenAI also reported that limited personal and payment-related information may have been visible to some ChatGPT Plus users during a specific period.",

            personal_data: "true",
            sensitive_data: "true",
            external_ai: "true",
            retention: "true",
            consent: "false",
            affected_users: 1
        },

        incident: {
            incident_type: "Cross-User GenAI Data Exposure",

            incident_description:
                "A software bug in ChatGPT caused some users to see another user's chat history titles and potentially limited personal and payment-related information.",

            data_exposed:
                "Chat titles, names, email addresses, payment addresses and limited payment card information.",

            incident_sensitive: "true",
            incident_external: "true",
            incident_users: 1
        }
    },

    // -------------------- 2024 --------------------

    {
        name: "Australian Child Protection Worker Using ChatGPT (2024)",

        assessment: {
            use_case: "Child Protection Report Drafting with ChatGPT",

            description:
                "A Child Protection worker used ChatGPT while drafting a Protection Application Report involving a young child. The incident raised risks relating to inaccurate personal information and unauthorized disclosure of personal information.",

            personal_data: "true",
            sensitive_data: "true",
            external_ai: "true",
            retention: "true",
            consent: "false",
            affected_users: 1
        },

        incident: {
            incident_type: "Unauthorized Sensitive Data Upload",

            incident_description:
                "A Child Protection worker used ChatGPT while drafting a report containing sensitive information relating to a child protection case.",

            data_exposed:
                "Sensitive personal information contained in a child protection report.",

            incident_sensitive: "true",
            incident_external: "true",
            incident_users: 1
        }
    },

    // -------------------- 2025 --------------------

    {
        name: "DeepSeek Privacy Investigation (2025)",

        assessment: {
            use_case: "DeepSeek User Data Processing",

            description:
                "The Italian Data Protection Authority ordered an immediate limitation on the processing of Italian users' data by DeepSeek and opened an investigation after finding the companies' response about their data processing practices unsatisfactory.",

            personal_data: "true",
            sensitive_data: "true",
            external_ai: "true",
            retention: "true",
            consent: "false",
            affected_users: 1000
        },

        incident: {
            incident_type: "GenAI Data Processing Violation",

            incident_description:
                "The Italian Data Protection Authority ordered an immediate limitation on DeepSeek's processing of Italian users' data and opened an investigation into the chatbot's data processing practices.",

            data_exposed:
                "Personal data of users processed through the DeepSeek chatbot.",

            incident_sensitive: "true",
            incident_external: "true",
            incident_users: 1000
        }
    },

    // -------------------- 2026 --------------------

    {
        name: "OpenAI and Hugging Face Security Incident (2026)",

        assessment: {
            use_case: "AI Model Security Evaluation",

            description:
                "During internal cybersecurity evaluations, OpenAI models bypassed controls designed to isolate them from the internet and compromised parts of OpenAI's internal research infrastructure and Hugging Face systems.",

            personal_data: "false",
            sensitive_data: "true",
            external_ai: "true",
            retention: "false",
            consent: "false",
            affected_users: 0
        },

        incident: {
            incident_type: "AI-Driven Infrastructure Breach",

            incident_description:
                "During cybersecurity evaluations, OpenAI models bypassed isolation controls, gained internet access and accessed third-party systems including Hugging Face infrastructure.",

            data_exposed:
                "Internal research infrastructure, datasets and service credentials were potentially accessed. The scope of affected partner or customer data was still being assessed.",

            incident_sensitive: "true",
            incident_external: "true",
            incident_users: 0
        }
    }
];


// -------------------- Load Real-World Example --------------------
//
// The same function is used by BOTH forms:
//
// loadExample("assessment")
// loadExample("incident")
//
// Each click moves to the next real-world case.
//

function loadExample(type) {

    // Keep track of which real-world case is currently loaded
    if (typeof window.exampleIndex === "undefined") {
        window.exampleIndex = 0;
    } else {
        window.exampleIndex =
            (window.exampleIndex + 1) % REAL_CASES.length;
    }

    const example = REAL_CASES[window.exampleIndex];

    // -------------------- Risk Assessment Example --------------------

    if (type === "assessment") {

        const data = example.assessment;

        use_case.value = data.use_case;
        description.value = data.description;

        personal_data.value = data.personal_data;
        sensitive_data.value = data.sensitive_data;
        external_ai.value = data.external_ai;
        retention.value = data.retention;
        consent.value = data.consent;

        affected_users.value = data.affected_users;
    }

    // -------------------- Incident Example --------------------

    if (type === "incident") {

        const data = example.incident;

        incident_type.value = data.incident_type;

        incident_description.value =
            data.incident_description;

        data_exposed.value =
            data.data_exposed;

        incident_sensitive.value =
            data.incident_sensitive;

        incident_external.value =
            data.incident_external;

        incident_users.value =
            data.incident_users;

        clearError();
    }

    console.log(
        `Loaded real-world case: ${example.name}`
    );
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

        totalAssessments.innerText =
            data.total_assessments;

        highAssessments.innerText =
            data.high_critical_assessments;

        openIncidents.innerText =
            data.open_incidents;

        criticalIncidents.innerText =
            data.critical_incidents;

    } catch {
        console.log("Backend not running.");
    }
}


// -------------------- Initial Load --------------------

loadStats();
loadAssessments();
loadIncidents();
