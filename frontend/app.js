const API = "https://dpo-kng0.onrender.com/api";

function showTab(tab){
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    document.getElementById(tab).classList.add("active");

    if(tab==="assessmentHistory") loadAssessments();
    if(tab==="incidentHistory") loadIncidents();
}

function yesNo(id){
    return document.getElementById(id).value==="true";
}

function badge(level){
    return `<span class="badge ${level}">${level}</span>`;
}

// ------------------- Example Button --------------------

function loadExample(){

    use_case.value="Customer Support Ticket Summarization";

    description.value="Organization uses an external Generative AI service to summarize customer support tickets.";

    personal_data.value="true";
    sensitive_data.value="true";
    external_ai.value="true";
    retention.value="true";
    consent.value="false";

    affected_users.value=250;
}

// ------------------- Risk Assessment --------------------

async function submitAssessment(){

    const btn=event.target;
    btn.disabled=true;
    btn.innerText="Calculating...";

    const payload={
        use_case:use_case.value,
        description:description.value,
        personal_data:yesNo("personal_data"),
        sensitive_data:yesNo("sensitive_data"),
        external_ai:yesNo("external_ai"),
        retention:yesNo("retention"),
        consent:yesNo("consent"),
        affected_users:Number(affected_users.value||0)
    };

    try{

        const res=await fetch(`${API}/assess`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(payload)
        });

        const data=await res.json();

        if(!data.success) throw Error(data.error);

        riskResult.classList.remove("hidden");

        riskResult.innerHTML=`
            <h2>Risk Assessment Result</h2>
            ${badge(data.risk_level)}
            <h3>Risk Score : ${data.risk_score}/6</h3>

            <h4>Recommended DPO Actions</h4>

            <ul>
                ${data.recommendations.map(r=>`<li>${r}</li>`).join("")}
            </ul>
        `;

        loadStats();

    }catch(err){
        alert(err.message);
    }

    btn.disabled=false;
    btn.innerText="Calculate Risk";
}

// ------------------- Incident --------------------

async function submitIncident(){

    const btn=event.target;
    btn.disabled=true;
    btn.innerText="Assessing...";

    const payload={
        incident_type:incident_type.value,
        description:incident_description.value,
        data_exposed:data_exposed.value,
        sensitive_data:yesNo("incident_sensitive"),
        external_ai:yesNo("incident_external"),
        affected_users:Number(incident_users.value||0)
    };

    try{

        const res=await fetch(`${API}/incidents`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(payload)
        });

        const data=await res.json();

        if(!data.success) throw Error(data.error);

        incidentResult.classList.remove("hidden");

        incidentResult.innerHTML=`
            <h2>Incident Severity Result</h2>

            ${badge(data.severity)}

            <h3>Incident Score : ${data.incident_score}</h3>

            <h4>Recommended Response Actions</h4>

            <ul>
                ${data.actions.map(a=>`<li>${a}</li>`).join("")}
            </ul>
        `;

        loadStats();

    }catch(err){
        alert(err.message);
    }

    btn.disabled=false;
    btn.innerText="Assess Incident";
}

// ------------------- History --------------------

async function loadAssessments(){

    const res=await fetch(`${API}/assessments`);
    const json=await res.json();

    assessmentTable.innerHTML="";

    json.data.forEach(item=>{
        assessmentTable.innerHTML+=`
        <tr>
            <td>${item.id}</td>
            <td>${item.use_case}</td>
            <td>${badge(item.risk_level)}</td>
            <td>${item.risk_score}</td>
            <td>${item.created_at}</td>
        </tr>`;
    });
}

async function loadIncidents(){

    const res=await fetch(`${API}/incidents`);
    const json=await res.json();

    incidentTable.innerHTML="";

    json.data.forEach(item=>{
        incidentTable.innerHTML+=`
        <tr>
            <td>${item.id}</td>
            <td>${item.incident_type}</td>
            <td>${badge(item.severity)}</td>
            <td>${item.status}</td>
            <td>${item.created_at}</td>
        </tr>`;
    });
}

// ------------------- Dashboard Stats --------------------

async function loadStats(){

    try{

        const res=await fetch(`${API}/stats`);
        const data=await res.json();

        totalAssessments.innerText=data.total_assessments;
        highAssessments.innerText=data.high_critical_assessments;
        openIncidents.innerText=data.open_incidents;
        criticalIncidents.innerText=data.critical_incidents;

    }catch(e){
        console.log("Backend not running");
    }
}

loadStats();
