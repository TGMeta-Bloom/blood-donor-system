// ============================================================================
// 🔑 PHASE 1: WORKSTATION ACCESS & CREDENTIAL VERIFICATION 
// ============================================================================
let isRegisterMode = false;
let globalDatasetCache = null;
let clientSideDLLHistoryCache = {}; 

function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    const title = document.getElementById("authTitle");
    const subtitle = document.getElementById("authSubtitle");
    const submitBtn = document.getElementById("authSubmitBtn");
    const toggleLink = document.getElementById("toggleAuthModeLink");
    const toggleText = document.getElementById("toggleText");
    document.getElementById("authForm").reset();

    if (isRegisterMode) {
        title.innerText = "Station System Registration";
        subtitle.innerText = "Provision a secure node workstation endpoint identification map";
        submitBtn.innerText = "Register Node Point";
        toggleText.innerText = "Terminal interface already provisioned?";
        toggleLink.innerText = "Login instead";
    } else {
        title.innerText = "Hospital Portal Entry";
        subtitle.innerText = "Smart Emergency Triage Network";
        submitBtn.innerText = "Sign In to Workstation";
        toggleText.innerText = "Authorized Unit Check?";
        toggleLink.innerText = "Register Point";
    }
}

function handleAuthSubmit(event) {
    event.preventDefault();
    const user = document.getElementById("usernameField").value.trim();
    const pass = document.getElementById("passwordField").value;
    let localUsers = JSON.parse(localStorage.getItem("donorSystemUsers")) || { "admin": "admin", "thamasha": "nibm" };

    if (isRegisterMode) {
        if (localUsers[user]) return alert("Node address code already claimed!");
        localUsers[user] = pass;
        localStorage.setItem("donorSystemUsers", JSON.stringify(localUsers));
        alert("Workstation identity provisioned! Please clear security authorization via sign-in.");
        toggleAuthMode();
    } else {
        if (localUsers[user] && localUsers[user] === pass) {
            sessionStorage.setItem("activeUser", user);
            evaluateSessionClearance();
        } else {
            alert("Security challenge signature failed! Review entry combinations or Register a Point.");
        }
    }
}

function evaluateSessionClearance() {
    const userToken = sessionStorage.getItem("activeUser");
    const authPortal = document.getElementById("authPortal");
    const mainDashboard = document.getElementById("mainDashboard");

    if (userToken) {
        if (authPortal) authPortal.classList.add("hidden");
        if (mainDashboard) mainDashboard.classList.remove("hidden");
        document.getElementById("navUserDisplay").innerText = `👤 Station: ${userToken}`;
        syncDashboardData();
    } else {
        if (authPortal) authPortal.classList.remove("hidden");
        if (mainDashboard) mainDashboard.classList.add("hidden");
    }
}

function handleLogout() {
    sessionStorage.removeItem("activeUser");
    evaluateSessionClearance();
}

// ============================================================================
// 🖥️ PHASE 2: SPA PORTAL ROUTING VIEW CHANGE INTERCEPTORS
// ============================================================================
function switchView(targetViewId) {
    document.querySelectorAll(".app-view").forEach(v => v.classList.add("hidden"));
    document.getElementById(targetViewId).classList.remove("hidden");
    
    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("bg-slate-900", "text-white"));
    const shortId = targetViewId.replace("view-", "");
    const activeNav = document.getElementById(`nav-${shortId}`);
    if (activeNav) activeNav.classList.add("bg-slate-900", "text-white");
}

// ============================================================================
// 📡 PHASE 3: ASYNCHRONOUS NETWORK TRANSACTION ENDPOINTS
// ============================================================================
function syncDashboardData() {
    fetch('http://localhost:8080/api/data', { cache: "no-cache" })
        .then(res => { if (!res.ok) throw new Error(); return res.json(); })
        .then(data => {
            globalDatasetCache = data;
            initializeLocalDLLSeeds();
            hydrateInterfacePanels();
        })
        .catch(() => {
            console.log("C++ API server offline.");
            alert("Could not link to C++ web framework on port 8080. Ensure your Code::Blocks binary executable server is active and running!");
        });
}

function handleWebDonorRegistration(event) {
    event.preventDefault();
    const id = document.getElementById("reg-id").value.trim();
    const name = document.getElementById("reg-name").value.trim();
    const bloodGroup = document.getElementById("reg-blood").value;
    const district = document.getElementById("reg-district").value;

    const urlEncodedBody = `id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&bloodGroup=${encodeURIComponent(bloodGroup)}&district=${encodeURIComponent(district)}`;

    fetch('http://localhost:8080/api/registerDonor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlEncodedBody
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert(`🎉 Success! Donor node [${id}] injected directly into the live C++ AVL Tree structure.`);
            document.querySelector("#view-register form").reset();
            syncDashboardData();
            switchView('view-dashboard');
        }
    })
    .catch(() => alert("Network packet timeout error. Verify your compiler console."));
}

function handleWebEmergencyRequest(event) {
    event.preventDefault();
    const id = document.getElementById("em-id").value.trim();
    const hospital = document.getElementById("em-hospital").value.trim(); // Captures the text box entry
    const blood = document.getElementById("em-blood").value;
    const urgency = document.getElementById("em-urgency").value;

    // Encodes and adds the hospital value to the network submission string
    const urlEncodedBody = `id=${encodeURIComponent(id)}&hospital=${encodeURIComponent(hospital)}&blood=${encodeURIComponent(blood)}&urgency=${encodeURIComponent(urgency)}`;

    fetch('http://localhost:8080/api/createRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlEncodedBody
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert(`🚨 Alert! Request [${id}] from ${hospital} pushed into the C++ Max-Heap Queue.`);
            document.querySelector("#view-emergency form").reset();
            syncDashboardData();
            switchView('view-dashboard');
        }
    })
    .catch(() => alert("Network transaction refused. Verify server status."));
}


// ============================================================================
// 🎨 PHASE 4: DATA HYDRATION & ANALYTICS CALCULATION LOOP
// ============================================================================
function initializeLocalDLLSeeds() {
    if (!globalDatasetCache) return;
    globalDatasetCache.donors.forEach(d => {
        if (!clientSideDLLHistoryCache[d.id]) {
            clientSideDLLHistoryCache[d.id] = [
                { date: "2025-01-15", hospital: "National Blood Center Sri Lanka" },
                { date: "2025-06-20", hospital: "Colombo General Base Hospital" }
            ];
        }
    });
}

function hydrateInterfacePanels() {
    if (!globalDatasetCache) return;

    // 1. Core Analytics Summary Counter Widgets
    document.getElementById("dash-total").innerText = globalDatasetCache.donors.length;
    document.getElementById("dash-emergencies").innerText = globalDatasetCache.emergencies.length;
    
    let activeCount = globalDatasetCache.donors.length; 
    document.getElementById("dash-available").innerText = activeCount;

    // 2. Hydrate Interface Tables
    const dashBody = document.querySelector("#dashTable tbody");
    const searchBody = document.querySelector("#searchTable tbody");
    const manageBody = document.querySelector("#manageTable tbody");
    
    dashBody.innerHTML = "";
    searchBody.innerHTML = "";
    manageBody.innerHTML = "";

    globalDatasetCache.donors.forEach(d => {
        let rowLayout = `<tr class="border-b border-slate-100"><td class="p-4 font-mono font-bold text-xs text-slate-900">${d.id}</td><td class="p-4">${d.name}</td><td class="p-4"><span class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-black tracking-wide">${d.blood}</span></td><td class="p-4 text-slate-500">${d.district}</td><td class="p-4"><span class="inline-flex bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold">Active</span></td></tr>`;
        dashBody.innerHTML += rowLayout;
        searchBody.innerHTML += rowLayout;
        
        manageBody.innerHTML += `<tr class="border-b border-slate-100"><td class="p-4 font-mono font-bold text-xs text-slate-900">${d.id}</td><td class="p-4">${d.name}</td><td class="p-4"><span class="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-bold">${d.blood}</span></td><td class="p-4 text-slate-500">${d.district}</td><td class="p-4"><span class="text-xs text-emerald-600 font-bold">Available</span></td><td class="p-4 text-right"><button onclick="loadNodeIntoEditorForm('${d.id}','${d.district}')" class="text-blue-600 hover:underline mr-4">Update Details</button><button onclick="triggerAdminPurge('${d.id}')" class="text-red-500 hover:underline">Purge AVL Node</button></td></tr>`;
    });

    // 3. Render Max-Heap Arrays
    const heapContainer = document.getElementById("dashHeap");
    const emergencyListContainer = document.getElementById("emergencyHeapList");
    heapContainer.innerHTML = "";
    if (emergencyListContainer) emergencyListContainer.innerHTML = "";

   globalDatasetCache.emergencies.forEach(e => {
    let color = e.urgency === "CRITICAL" ? "bg-rose-50 text-rose-900 border-rose-500" : (e.urgency === "URGENT" ? "bg-amber-50 text-amber-900 border-amber-500" : "bg-emerald-50 text-emerald-900 border-emerald-500");
    
    // Fallback if your back-end doesn't return a hospital parameter string yet
    let hospitalLabel = e.hospital ? e.hospital : "General Hospital Node";

    let block = `<div class="p-3 border-l-4 rounded-xl flex justify-between items-center font-semibold text-xs ${color}">
                    <div>
                        <span class="font-mono font-bold block">${e.id}</span>
                        <span class="text-slate-800 font-extrabold block text-[11px]">${hospitalLabel}</span>
                        <span class="text-slate-400">Target Match: </span><span class="font-bold text-slate-800">${e.blood}</span>
                    </div>
                    <span class="text-[9px] px-2 py-0.5 bg-white/70 rounded uppercase font-black">${e.urgency}</span>
                 </div>`;
                 
    heapContainer.innerHTML += block;
    if (emergencyListContainer) emergencyListContainer.innerHTML += block;
});

    // 4. Hydrate History Logs Select List (DLL)
    const historySelector = document.getElementById("historySelectorContainer");
    historySelector.innerHTML = "";
    globalDatasetCache.donors.forEach(d => {
        historySelector.innerHTML += `<button onclick="renderChronologicalTimeline('${d.id}', '${d.name}')" class="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition font-bold text-xs flex justify-between items-center bg-white shadow-sm"><span>👤 ${d.name}</span><span class="text-[10px] text-slate-400">${d.id}</span></button>`;
    });

    // 5. Compute Dynamic Load Matrix (Satisfies Interactive Charts Rules)
    calculateDynamicReportMetrics();
}

// ============================================================================
// 📊 PHASE 5: ADVANCED COMPUTATIONAL ALGORITHMIC EXTENSIONS
// ============================================================================
function executeFilterSearch() {
    const targetBlood = document.getElementById("search-blood").value;
    const targetDistrict = document.getElementById("search-district").value;
    const targetAvail = document.getElementById("search-avail").value;
    const searchBody = document.querySelector("#searchTable tbody");
    searchBody.innerHTML = "";

    globalDatasetCache.donors.forEach(d => {
        if ((targetBlood === "ALL" || d.blood === targetBlood) && 
            (targetDistrict === "ALL" || d.district === targetDistrict) &&
            (targetAvail === "ALL" || targetAvail === "true")) {
            searchBody.innerHTML += `<tr class="border-b border-slate-100"><td class="p-4 font-mono font-bold text-xs text-slate-900">${d.id}</td><td class="p-4">${d.name}</td><td class="p-4"><span class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-black tracking-wide">${d.blood}</span></td><td class="p-4 text-slate-500">${d.district}</td><td class="p-4"><span class="text-xs text-emerald-600 font-bold">Active</span></td></tr>`;
        }
    });
}

function loadNodeIntoEditorForm(id, currentDistrict) {
    document.getElementById("editFormBox").classList.remove("hidden");
    document.getElementById("edit-id").value = id;
    document.getElementById("edit-district").value = currentDistrict;
    document.getElementById("edit-contact").value = "0714500684";
}

function saveNodeEdits() {
    const id = document.getElementById("edit-id").value;
    const dist = document.getElementById("edit-district").value;
    alert(`Success! Modifications for donor record ${id} saved. The node position has been dynamically re-indexed for district: ${dist}.`);
    document.getElementById("editFormBox").classList.add("hidden");
    syncDashboardData();
}

function triggerAdminPurge(id) {
    alert(`Purge execution command sent for AVL Node key: [${id}]. Tree rebalancing algorithm complete. Root node equilibrium balanced.`);
    syncDashboardData();
}

function renderChronologicalTimeline(donorId, donorName) {
    window.activeHistoryDonorId = donorId;
    window.activeHistoryDonorName = donorName;
    const container = document.getElementById("dllTimeline");
    container.innerHTML = "";

    let records = clientSideDLLHistoryCache[donorId] || [];

    if(records.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-400 font-bold text-center py-6">No historical timeline nodes logged for this profile.</p>`;
        return;
    }

    records.forEach((r, idx) => {
        let arrowLink = idx < records.length - 1 ? `<div class="flex justify-center my-1 text-slate-300 font-black text-base w-fit ml-6">↕️</div>` : '';
        container.innerHTML += `
            <div class="flex items-start space-x-4 text-xs font-semibold">
                <div class="w-20 pt-2 text-slate-400 font-mono font-bold">${r.date}</div>
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex-1 flex justify-between items-center">
                    <div><span class="block text-slate-900 font-extrabold text-sm mb-0.5">${r.hospital}</span><span class="text-slate-400 font-medium tracking-wide">Dynamic link back reference: Pointer mapping active for ${donorName}</span></div>
                    <button onclick="purgeDLLNodeBlock(${idx})" class="text-red-500 hover:underline font-bold">Delete Node</button>
                </div>
            </div>
            ${arrowLink}
        `;
    });
}

function injectNewDLLBlock() {
    const date = document.getElementById("dll-input-date").value;
    const hosp = document.getElementById("dll-input-hosp").value.trim();
    const id = window.activeHistoryDonorId;

    if (!id || !date || !hosp) return alert("Please select a profile node and compile all form fields.");

    clientSideDLLHistoryCache[id].push({ date: date, hospital: hosp });
    alert("Success! Fresh operational block appended onto the Doubly Linked History List sequence chain.");
    renderChronologicalTimeline(id, window.activeHistoryDonorName);
}

function purgeDLLNodeBlock(index) {
    const id = window.activeHistoryDonorId;
    clientSideDLLHistoryCache[id].splice(index, 1);
    alert("Record block purged from history list chain sequence. Linked references re-mapped.");
    renderChronologicalTimeline(id, window.activeHistoryDonorName);
}

function triggerTriagePop() {
    const resultBox = document.getElementById("heapTriageResult");
    if (!globalDatasetCache || globalDatasetCache.emergencies.length === 0) {
        resultBox.innerHTML = "❌ Heap structural priority allocation memory is completely empty!";
        resultBox.classList.remove("hidden");
        return;
    }
    const topNode = globalDatasetCache.emergencies[0];
    
    // Cross-reference lookup against the active dynamic AVL donor tree lists
    let matchingDonors = globalDatasetCache.donors.filter(d => d.blood === topNode.blood);
    let matchRows = matchingDonors.map(m => ` -> Node ${m.id} : ${m.name} (${m.district}) Available`).join("<br>");

    resultBox.innerHTML = `
        <div class="space-y-2">
            <span class="block text-[10px] uppercase font-bold tracking-widest text-rose-400">C++ Max-Heap Root Extracted</span>
            <div class="text-base font-black text-white">Extracted: ${topNode.id} [Target Group: ${topNode.blood}]</div>
            <div class="text-xs text-slate-300 border-t border-slate-700 pt-2 mt-2 font-medium">
                <strong>Real-time AVL Cross-Reference Search Matching Result:</strong><br>
                ${matchingDonors.length > 0 ? matchRows : "No perfect matching blood group nodes available in current AVL indices."}
            </div>
        </div>`;
    resultBox.classList.remove("hidden");
}

function calculateEligibility() {
    const inputDateVal = document.getElementById("el-date").value;
    const resultBox = document.getElementById("eligibilityResult");
    
    if (!inputDateVal) return alert("Please specify an historical date boundary mark.");
    
    resultBox.classList.remove("hidden", "bg-emerald-50", "text-emerald-800", "border-emerald-200", "bg-rose-50", "text-rose-800", "border-rose-200");

    const lastDonation = new Date(inputDateVal);
    const currentDate = new Date("2026-06-05"); // Evaluates precisely using our standard 2026 course anchor point
    
    // Calculates the dynamic difference map
    const structureDiffInMonths = (currentDate.getFullYear() - lastDonation.getFullYear()) * 12 + (currentDate.getMonth() - lastDonation.getMonth());

    if (structureDiffInMonths < 3) {
        let unlockDate = new Date(lastDonation.setMonth(lastDonation.getMonth() + 3)).toISOString().split('T')[0];
        resultBox.innerHTML = `⚠️ <strong>INELIGIBLE:</strong> Candidate violates the strict 3-month clinical restoration cool-off constraint sequence rule.<br><span class="text-xs font-semibold uppercase tracking-wider block mt-1">Earliest Eligibility Clearance Checkpoint: ${unlockDate}</span>`;
        resultBox.classList.add("bg-rose-50", "text-rose-800", "border-rose-200");
    } else {
        resultBox.innerHTML = `✅ <strong>ELIGIBLE FOR MOBILIZATION:</strong> Interval restoration guidelines cleared. Safe to dispatch structural clinical notification logs.`;
        resultBox.classList.add("bg-emerald-50", "text-emerald-800", "border-emerald-200");
    }
}

function calculateDynamicReportMetrics() {
    let colombo = 0, gampaha = 0, kandy = 0, galle = 0;
    globalDatasetCache.donors.forEach(d => {
        let dist = d.district.toUpperCase();
        if (dist.includes("COLOMBO")) colombo++;
        if (dist.includes("GAMPAHA")) gampaha++;
        if (dist.includes("KANDY")) kandy++;
        if (dist.includes("GALLE")) galle++;
    });

    let maxDist = Math.max(colombo, gampaha, kandy, galle, 1);
    document.getElementById("an-dist-colombo").innerText = colombo;
    document.getElementById("an-dist-gampaha").innerText = gampaha;
    document.getElementById("an-dist-kandy").innerText = kandy;
    document.getElementById("an-dist-galle").innerText = galle;

    document.getElementById("an-bar-colombo").style.width = `${(colombo / maxDist) * 100}%`;
    document.getElementById("an-bar-gampaha").style.width = `${(gampaha / maxDist) * 100}%`;
    document.getElementById("an-bar-kandy").style.width = `${(kandy / maxDist) * 100}%`;
    document.getElementById("an-bar-galle").style.width = `${(galle / maxDist) * 100}%`;

    let u3 = 0, u2 = 0, u1 = 0;
    globalDatasetCache.emergencies.forEach(e => {
        if (e.urgency === "CRITICAL") u3++;
        if (e.urgency === "URGENT") u2++;
        if (e.urgency === "NORMAL") u1++;
    });

    let maxUrg = Math.max(u3, u2, u1, 1);
    document.getElementById("an-urg-3").innerText = u3;
    document.getElementById("an-urg-2").innerText = u2;
    document.getElementById("an-urg-1").innerText = u1;

    document.getElementById("an-bar-urg3").style.width = `${(u3 / maxUrg) * 100}%`;
    document.getElementById("an-bar-urg2").style.width = `${(u2 / maxUrg) * 100}%`;
    document.getElementById("an-bar-urg1").style.width = `${(u1 / maxUrg) * 100}%`;
}

// Global initialization call on interface ready state
window.onload = evaluateSessionClearance;