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

    if (box) {
        box.style.display = "none";
    }
}



// ==========================================================
// AI RESULT RESET
// ==========================================================

function clearAIExtractedParameters() {

    // ======================================================
    // Clear AI Extracted Parameter Cards
    // ======================================================

    const aiParameters =
        document.getElementById(
            "aiExtractedParameters"
        );

    if (aiParameters) {
        aiParameters.classList.add("hidden");
    }


    // Reset YES / NO cards
    const cardIds = [
        "ai_personal_data",
        "ai_sensitive_data",
        "ai_external_ai",
        "ai_retention",
        "ai_consent"
    ];

    cardIds.forEach(id => {

        const card =
            document.getElementById(id);

        if (!card) {
            return;
        }

        card.textContent = "-";

        card.classList.remove(
            "yes",
            "no"
        );
    });


    // Reset affected users card
    const affectedUsers =
        document.getElementById(
            "ai_affected_users"
        );

    if (affectedUsers) {

        affectedUsers.textContent = "0";

        affectedUsers.classList.remove(
            "yes",
            "no",
            "number"
        );
    }


    // ======================================================
    // Clear AI Risk Assessment Result
    // ======================================================

    const riskResult =
        document.getElementById(
            "riskResult"
        );

    if (riskResult) {

        riskResult.classList.add(
            "hidden"
        );

        riskResult.innerHTML = "";
    }
}



// ==========================================================
// RISK ASSESSMENT INPUT TABS
// ==========================================================

function showRiskInputMode(mode) {

    // Clear previous AI extraction + risk result
    clearAIExtractedParameters();


    const manualMode =
        document.getElementById(
            "manualRiskMode"
        );

    const uploadMode =
        document.getElementById(
            "uploadRiskMode"
        );

    const manualTab =
        document.getElementById(
            "manualRiskTab"
        );

    const uploadTab =
        document.getElementById(
            "uploadRiskTab"
        );

    const loadExampleButton =
        document.getElementById(
            "assessmentLoadExampleButton"
        );


    // ======================================================
    // MANUAL MODE
    // ======================================================

    if (mode === "manual") {

        manualMode.classList.add(
            "active"
        );

        uploadMode.classList.remove(
            "active"
        );

        manualTab.classList.add(
            "active"
        );

        uploadTab.classList.remove(
            "active"
        );


        // Show Load Example only in Manual mode
        if (loadExampleButton) {

            loadExampleButton.classList.remove(
                "hidden"
            );
        }
    }


    // ======================================================
    // AI MODE
    // ======================================================

    if (mode === "upload") {

        manualMode.classList.remove(
            "active"
        );

        uploadMode.classList.add(
            "active"
        );

        manualTab.classList.remove(
            "active"
        );

        uploadTab.classList.add(
            "active"
        );


        // Hide Load Example in AI mode
        if (loadExampleButton) {

            loadExampleButton.classList.add(
                "hidden"
            );
        }
    }
}


// ==========================================================
// UPLOAD / TYPE INPUT TABS
// ==========================================================

function showDocumentInputMode(mode) {

    // ------------------------------------------------------
    // Clear previous AI extraction + risk result whenever
    // switching between Upload and Type.
    // ------------------------------------------------------

    clearAIExtractedParameters();


    const uploadMode =
        document.getElementById(
            "uploadDocumentMode"
        );

    const typeMode =
        document.getElementById(
            "typeDocumentMode"
        );

    const uploadTab =
        document.getElementById(
            "uploadDocumentTab"
        );

    const typeTab =
        document.getElementById(
            "typeDocumentTab"
        );


    if (mode === "upload") {

        uploadMode.classList.add(
            "active"
        );

        typeMode.classList.remove(
            "active"
        );

        uploadTab.classList.add(
            "active"
        );

        typeTab.classList.remove(
            "active"
        );
    }


    if (mode === "type") {

        uploadMode.classList.remove(
            "active"
        );

        typeMode.classList.add(
            "active"
        );

        uploadTab.classList.remove(
            "active"
        );

        typeTab.classList.add(
            "active"
        );
    }
}



// ==========================================================
// REAL-WORLD EXAMPLES
// ==========================================================

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
            incident_type:
                "Cross-User GenAI Data Exposure",

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
        name:
            "Australian Child Protection Worker Using ChatGPT (2024)",

        assessment: {
            use_case:
                "Child Protection Report Drafting with ChatGPT",

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
            incident_type:
                "Unauthorized Sensitive Data Upload",

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
        name:
            "DeepSeek Privacy Investigation (2025)",

        assessment: {
            use_case:
                "DeepSeek User Data Processing",

            description:
                "The Italian Data Protection Authority ordered an immediate limitation on the processing of Italian users' data by DeepSeek and opened an investigation after finding the company's response about its data processing practices unsatisfactory.",

            personal_data: "true",
            sensitive_data: "true",
            external_ai: "true",
            retention: "true",
            consent: "false",
            affected_users: 1000
        },

        incident: {
            incident_type:
                "GenAI Data Processing Violation",

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
        name:
            "OpenAI and Hugging Face Security Incident (2026)",

        assessment: {
            use_case:
                "AI Model Security Evaluation",

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
            incident_type:
                "AI-Driven Infrastructure Breach",

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



// ==========================================================
// LOAD REAL-WORLD EXAMPLE
// ==========================================================

function loadExample(type) {

    if (typeof window.exampleIndex === "undefined") {

        window.exampleIndex = 0;

    } else {

        window.exampleIndex =
            (window.exampleIndex + 1) %
            REAL_CASES.length;
    }


    const example =
        REAL_CASES[window.exampleIndex];


    // -------------------- Risk Assessment Example --------------------

    if (type === "assessment") {

        const data =
            example.assessment;


        use_case.value =
            data.use_case;


        description.value =
            data.description;


        personal_data.value =
            data.personal_data;


        sensitive_data.value =
            data.sensitive_data;


        external_ai.value =
            data.external_ai;


        retention.value =
            data.retention;


        consent.value =
            data.consent;


        affected_users.value =
            data.affected_users;


        // Clear stale AI cards + result
        clearAIExtractedParameters();
    }


    // -------------------- Incident Example --------------------

    if (type === "incident") {

        const data =
            example.incident;


        incident_type.value =
            data.incident_type;


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



// ==========================================================
// AI RISK ASSESSMENT
// ==========================================================
//
// Upload PDF / TXT
//        OR
// Type Description
//
//        ↓
//
// /api/assess-ai
//
//        ↓
//
// Text extraction / OCR
//
//        ↓
//
// Groq GPT-OSS-120B
//
//        ↓
//
// Extract parameters
//
//        ↓
//
// calculate_risk_score()
//
//        ↓
//
// Risk result
//
// ==========================================================



// -------------------- AI Value Card Helper --------------------

function setAIValueCard(
    elementId,
    value,
    isNumber = false
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    // -------------------- Affected Users --------------------

    if (isNumber) {

        element.textContent =
            value ?? 0;


        element.classList.remove(
            "yes",
            "no"
        );


        element.classList.add(
            "number"
        );


        return;
    }


    // -------------------- YES / NO --------------------

    const booleanValue =
        value === true ||
        value === "true";


    element.textContent =
        booleanValue
            ? "YES"
            : "NO";


    element.classList.remove(
        "yes",
        "no"
    );


    element.classList.add(
        booleanValue
            ? "yes"
            : "no"
    );
}



// -------------------- Populate AI Result --------------------

function populateAIResult(data) {

    const extracted =
        data.extracted_data;


    // ======================================================
    // Fill Existing Risk Assessment Form
    // ======================================================

    use_case.value =
        extracted.use_case || "";


    description.value =
        extracted.description || "";


    personal_data.value =
        String(
            extracted.personal_data
        );


    sensitive_data.value =
        String(
            extracted.sensitive_data
        );


    external_ai.value =
        String(
            extracted.external_ai
        );


    retention.value =
        String(
            extracted.retention
        );


    consent.value =
        String(
            extracted.consent
        );


    affected_users.value =
        extracted.affected_users ?? 0;


    // ======================================================
    // Populate AI Extracted Parameter Cards
    // ======================================================

    setAIValueCard(
        "ai_personal_data",
        extracted.personal_data
    );


    setAIValueCard(
        "ai_sensitive_data",
        extracted.sensitive_data
    );


    setAIValueCard(
        "ai_external_ai",
        extracted.external_ai
    );


    setAIValueCard(
        "ai_retention",
        extracted.retention
    );


    setAIValueCard(
        "ai_consent",
        extracted.consent
    );


    setAIValueCard(
        "ai_affected_users",
        extracted.affected_users ?? 0,
        true
    );


    // ======================================================
    // SHOW AI EXTRACTED PARAMETERS
    // ======================================================

    const aiParameters =
        document.getElementById(
            "aiExtractedParameters"
        );


    if (aiParameters) {

        aiParameters.classList.remove(
            "hidden"
        );
    }


    // ======================================================
    // Show Risk Result
    // ======================================================

    riskResult.classList.remove(
        "hidden"
    );


    riskResult.innerHTML = `

        <h2>
            AI Risk Assessment Result
        </h2>

        ${badge(data.risk_level)}

        <h3>
            Risk Score = ${data.risk_score} / 6
        </h3>

        <h4>
            Recommended DPO Actions
        </h4>

        <ul>

            ${data.recommendations
                .map(
                    item =>
                        `<li>${item}</li>`
                )
                .join("")}

        </ul>

    `;


    // ======================================================
    // Refresh Dashboard
    // ======================================================

    loadStats();
    loadAssessments();
}



// ==========================================================
// SEND DOCUMENT TO AI
// ==========================================================

async function analyzeDocument(file) {

    clearError();


    if (!file) {

        showError(
            "Please select a PDF or TXT file."
        );

        return;
    }


    // -------------------- File Validation --------------------

    const fileName =
        file.name.toLowerCase();


    const isPdf =
        file.type === "application/pdf" ||
        fileName.endsWith(".pdf");


    const isTxt =
        file.type === "text/plain" ||
        fileName.endsWith(".txt");


    if (!isPdf && !isTxt) {

        showError(
            "Only PDF and TXT files are supported."
        );

        return;
    }


    // -------------------- FormData --------------------

    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    try {

        const button =
            document.querySelector(
                "#uploadDocumentMode button"
            );


        if (button) {

            button.disabled = true;

            button.innerText =
                "Analyzing with AI...";
        }


        const response =
            await fetch(
                `${API}/assess-ai`,
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Unable to analyze document."
            );
        }


        clearError();

        populateAIResult(data);


    } catch (error) {

        showError(
            error.message ||
            "Unable to analyze document."
        );


    } finally {

        const button =
            document.querySelector(
                "#uploadDocumentMode button"
            );


        if (button) {

            button.disabled = false;

            button.innerText =
                "Analyze with AI";
        }
    }
}



// ==========================================================
// UPLOAD PDF / TXT
// ==========================================================

async function analyzeUploadedDocument() {

    const fileInput =
        document.getElementById(
            "incident_document"
        );


    const file =
        fileInput.files[0];


    await analyzeDocument(file);
}



// ==========================================================
// TYPE DESCRIPTION
// ==========================================================

async function analyzeTypedDescription() {

    clearError();


    const textarea =
        document.getElementById(
            "typed_incident_description"
        );


    const text =
        textarea.value.trim();


    if (!text) {

        showError(
            "Please enter an incident description."
        );

        textarea.focus();

        return;
    }


    if (text.length > 1000000) {

        showError(
            "Incident description cannot exceed 1,000,000 characters."
        );

        textarea.focus();

        return;
    }


    // ------------------------------------------------------
    // Turn typed text into a text/plain File.
    //
    // This reuses the exact same /api/assess-ai
    // backend endpoint used for uploaded TXT files.
    // ------------------------------------------------------

    const file =
        new File(
            [text],
            "typed_incident_description.txt",
            {
                type: "text/plain"
            }
        );


    await analyzeDocument(file);
}



// ==========================================================
// RISK ASSESSMENT
// ==========================================================

async function submitAssessment() {

    clearError();


    const useCase =
        use_case.value.trim();


    const desc =
        description.value.trim();


    const users =
        Number(
            affected_users.value || 0
        );


    if (!useCase) {

        showError(
            "Please enter a Use Case Name."
        );

        use_case.focus();

        return;
    }


    if (!desc) {

        showError(
            "Please enter a Description."
        );

        description.focus();

        return;
    }


    if (users < 0) {

        showError(
            "Affected Users cannot be negative."
        );

        affected_users.focus();

        return;
    }


    const button =
        event.target;


    button.disabled = true;

    button.innerText =
        "Calculating...";


    const payload = {

        use_case:
            useCase,

        description:
            desc,

        personal_data:
            yesNo("personal_data"),

        sensitive_data:
            yesNo("sensitive_data"),

        external_ai:
            yesNo("external_ai"),

        retention:
            yesNo("retention"),

        consent:
            yesNo("consent"),

        affected_users:
            users
    };


    try {

        const response =
            await fetch(
                `${API}/assess`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(payload)
                }
            );


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error
            );
        }


        clearError();


        riskResult.classList.remove(
            "hidden"
        );


        riskResult.innerHTML = `

            <h2>
                Risk Assessment Result
            </h2>

            ${badge(data.risk_level)}

            <h3>
                Risk Score =
                ${data.risk_score} / 6
            </h3>

            <h4>
                Recommended DPO Actions
            </h4>

            <ul>

                ${data.recommendations
                    .map(
                        item =>
                            `<li>${item}</li>`
                    )
                    .join("")}

            </ul>

        `;


        loadStats();

        loadAssessments();


    } catch (error) {

        showError(
            error.message ||
            "Unable to calculate risk."
        );
    }


    button.disabled = false;

    button.innerText =
        "Calculate Risk";
}



// ==========================================================
// INCIDENT MANAGEMENT
// ==========================================================

async function submitIncident() {

    clearError();


    const type =
        incident_type.value.trim();


    const desc =
        incident_description.value.trim();


    const exposed =
        data_exposed.value.trim();


    const users =
        Number(
            incident_users.value || 0
        );


    if (!type) {

        showError(
            "Please enter an Incident Type."
        );

        incident_type.focus();

        return;
    }


    if (!desc) {

        showError(
            "Please enter an Incident Description."
        );

        incident_description.focus();

        return;
    }


    if (!exposed) {

        showError(
            "Please enter the Data Exposed."
        );

        data_exposed.focus();

        return;
    }


    if (users < 0) {

        showError(
            "Affected Users cannot be negative."
        );

        incident_users.focus();

        return;
    }


    const button =
        event.target;


    button.disabled = true;

    button.innerText =
        "Assessing...";


    const payload = {

        incident_type:
            type,

        description:
            desc,

        data_exposed:
            exposed,

        sensitive_data:
            yesNo(
                "incident_sensitive"
            ),

        external_ai:
            yesNo(
                "incident_external"
            ),

        affected_users:
            users
    };


    try {

        const response =
            await fetch(
                `${API}/incidents`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(payload)
                }
            );


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error
            );
        }


        clearError();


        incidentResult.classList.remove(
            "hidden"
        );


        incidentResult.innerHTML = `

            <h2>
                Incident Severity Result
            </h2>

            ${badge(data.severity)}

            <h3>
                Incident Score =
                ${data.incident_score}
            </h3>

            <h4>
                Recommended Response Actions
            </h4>

            <ul>

                ${data.actions
                    .map(
                        item =>
                            `<li>${item}</li>`
                    )
                    .join("")}

            </ul>

        `;


        loadStats();

        loadIncidents();


    } catch (error) {

        showError(
            error.message ||
            "Unable to assess incident."
        );
    }


    button.disabled = false;

    button.innerText =
        "Assess Incident";
}



// ==========================================================
// ASSESSMENT HISTORY
// ==========================================================

async function loadAssessments() {

    try {

        const response =
            await fetch(
                `${API}/assessments`
            );


        const data =
            await response.json();


        assessmentTable.innerHTML =
            "";


        data.data.forEach(
            item => {

                assessmentTable.innerHTML += `

                    <tr>

                        <td>
                            ${item.id}
                        </td>

                        <td>
                            ${item.use_case}
                        </td>

                        <td>
                            ${badge(
                                item.risk_level
                            )}
                        </td>

                        <td>
                            ${item.risk_score}
                        </td>

                        <td>
                            ${item.created_at}
                        </td>

                    </tr>

                `;
            }
        );


    } catch {

        assessmentTable.innerHTML =
            "<tr><td colspan='5'>Unable to load assessments.</td></tr>";
    }
}



// ==========================================================
// INCIDENT HISTORY
// ==========================================================

async function loadIncidents() {

    try {

        const response =
            await fetch(
                `${API}/incidents`
            );


        const data =
            await response.json();


        incidentTable.innerHTML =
            "";


        data.data.forEach(
            item => {

                incidentTable.innerHTML += `

                    <tr>

                        <td>
                            ${item.id}
                        </td>

                        <td>
                            ${item.incident_type}
                        </td>

                        <td>
                            ${badge(
                                item.severity
                            )}
                        </td>

                        <td>
                            ${item.status}
                        </td>

                        <td>
                            ${item.created_at}
                        </td>

                    </tr>

                `;
            }
        );


    } catch {

        incidentTable.innerHTML =
            "<tr><td colspan='5'>Unable to load incidents.</td></tr>";
    }
}



// ==========================================================
// DASHBOARD STATS
// ==========================================================

async function loadStats() {

    try {

        const response =
            await fetch(
                `${API}/stats`
            );


        const data =
            await response.json();


        totalAssessments.innerText =
            data.total_assessments;


        highAssessments.innerText =
            data.high_critical_assessments;


        openIncidents.innerText =
            data.open_incidents;


        criticalIncidents.innerText =
            data.critical_incidents;


    } catch {

        console.log(
            "Backend not running."
        );
    }
}



// ==========================================================
// INITIAL LOAD
// ==========================================================

loadStats();
loadAssessments();
loadIncidents();
