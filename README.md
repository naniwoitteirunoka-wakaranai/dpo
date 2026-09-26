# System Architecture

```mermaid
flowchart LR
    A["Frontend (HTML/CSS/JavaScript)"] -->|"fetch() + JSON"| B["⚙️ Flask REST API"]

    B --> C["Privacy Risk Assessment Engine"]
    B --> D["Incident Severity Engine"]

    C --> E[(SQLite Database)]
    D --> E

    E --> F["Excel Report Export (.xlsx)"]

    B --> G["JSON Response"]
    G --> A
```

---

# DPO Privacy Workflow

```mermaid
flowchart TD
    A["GenAI Use Case Submitted"] --> B{"Personal Data Present?"}

    B -- "No" --> C["Low Privacy Review"]

    B -- "Yes" --> D["Perform Privacy Risk Assessment"]

    D --> E["Calculate Risk Score"]

    E --> F{"Risk Classification"}

    F -- "LOW" --> G["Approve with Basic Controls"]

    F -- "MEDIUM" --> H["Apply Privacy Controls"]

    F -- "HIGH" --> I["DPO Review Required"]

    F -- "CRITICAL" --> J["Escalate Before Deployment"]

    G --> K["Monitor Use Case"]
    H --> K
    I --> K
    J --> K
```

---

# Incident Management Workflow

```mermaid
flowchart TD
    A["Privacy Incident Detected"] --> B["Record Incident Details"]

    B --> C["Contain Incident"]

    C --> D["Identify Exposed Personal Data"]

    D --> E["Calculate Incident Severity"]

    E --> F{"Severity Level"}

    F -- "LOW" --> G["Document Incident"]

    F -- "MEDIUM" --> H["DPO Review"]

    F -- "HIGH" --> I["Escalation & Remediation"]

    F -- "CRITICAL" --> J["Immediate Escalation & Response"]

    G --> K["Close Incident"]
    H --> K
    I --> K
    J --> K
```

---

# Privacy Risk Assessment Model

```mermaid
flowchart TD
    A["Start Risk Assessment"] --> B{"Personal Data?"}

    B -- "Yes (+1)" --> C
    B -- "No (+0)" --> C

    C{"Sensitive Personal Data?"}
    C -- "Yes (+2)" --> D
    C -- "No (+0)" --> D

    D{"External GenAI Provider?"}
    D -- "Yes (+1)" --> E
    D -- "No (+0)" --> E

    E{"Data Retention Enabled?"}
    E -- "Yes (+1)" --> F
    E -- "No (+0)" --> F

    F{"Consent / Legal Basis Available?"}
    F -- "No (+1)" --> G
    F -- "Yes (+0)" --> G

    G["Risk Score = P + 2S + E + D + (1 − C)"] --> H{"Risk Level"}

    H -- "0–1" --> I["LOW"]
    H -- "2–3" --> J["MEDIUM"]
    H -- "4–5" --> K["HIGH"]
    H -- "6" --> L["CRITICAL"]
```

## Risk Assessment Mathematical Model

The GenAI DPO Privacy Framework uses a **deterministic weighted scoring model** to evaluate privacy risks associated with Generative AI use cases. Each privacy factor contributes a predefined weight to the overall risk score, making the assessment transparent and explainable.

### Privacy Risk Formula

\[
R = P + 2S + E + D + (1 - C)
\]

Where:

| Symbol | Description | Value |
|--------|-------------|-------|
| **P** | Personal Data is processed | 0 or 1 |
| **S** | Sensitive Personal Data is processed | 0 or 1 |
| **E** | External Generative AI provider is used | 0 or 1 |
| **D** | Data Retention is enabled | 0 or 1 |
| **C** | Consent or Legal Basis is available | 0 or 1 |

### Weight Justification

- **Personal Data (+1):** Processing personal information introduces privacy obligations.
- **Sensitive Personal Data (+2):** Sensitive information has a higher privacy impact and therefore receives a higher weight.
- **External AI Provider (+1):** Third-party AI services increase data-sharing and governance risk.
- **Data Retention (+1):** Retaining prompts or outputs increases long-term exposure.
- **No Consent (+1):** Lack of consent or legal basis increases compliance risk.

### Risk Classification

| Risk Score | Classification |
|------------|----------------|
| **0 – 1** | LOW |
| **2 – 3** | MEDIUM |
| **4 – 5** | HIGH |
| **6** | CRITICAL |

### Example Calculation

**Use Case:** Customer Support Ticket Summarization

| Privacy Factor | Value |
|----------------|-------|
| Personal Data | YES (+1) |
| Sensitive Data | YES (+2) |
| External AI Provider | YES (+1) |
| Data Retention | YES (+1) |
| Consent Available | NO (+1) |

**Risk Score**

\[
R = 1 + 2 + 1 + 1 + 1 = 6
\]

**Result:** **CRITICAL RISK**

The application generates mitigation recommendations such as data minimization, privacy review, DPO approval, and deployment escalation for high-risk use cases.

## Incident Severity Mathematical Model

The Incident Management module evaluates the severity of GenAI privacy incidents using a weighted scoring model based on the impact of the incident.

### Incident Severity Formula

\[
I = 2S + E + U + F
\]

Where:

| Symbol | Description | Score |
|--------|-------------|-------|
| **S** | Sensitive Personal Data exposed | +2 |
| **E** | External AI provider involved | +1 |
| **U** | Number of affected users | +1 (≥100), +2 (≥500) |
| **F** | Financial or account-related information exposed | +1 |

### Severity Classification

| Incident Score | Severity |
|---------------|----------|
| **0 – 1** | LOW |
| **2 – 3** | MEDIUM |
| **4 – 5** | HIGH |
| **6 or above** | CRITICAL |

### Example Calculation

**Incident:** Unauthorized GenAI Upload

| Incident Factor | Value |
|-----------------|-------|
| Sensitive Data | YES (+2) |
| External AI Used | YES (+1) |
| Affected Users | 250 (+1) |
| Account IDs Exposed | YES (+1) |

**Incident Score**

\[
I = 2 + 1 + 1 + 1 = 5
\]

**Result:** **HIGH SEVERITY**

The application recommends containment, DPO review, remediation, documentation, and escalation for high-severity incidents.
