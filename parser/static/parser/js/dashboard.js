// ==========================================
// Dashboard Elements
// ==========================================

const dashboard = document.getElementById("dashboard");

const bankCount = document.getElementById("bankCount");
const tallyCount = document.getElementById("tallyCount");
const matchedCount = document.getElementById("matchedCount");
const mismatchCount = document.getElementById("mismatchCount");

const mismatchTable = document.getElementById("mismatchTable");

const uploadButton = document.getElementById("uploadButton");
const bankFile = document.getElementById("bankFile");
const tallyFile = document.getElementById("tallyFile");
const newRecon = document.getElementById("newRecon");


// ==========================================
// Show Dashboard
// ==========================================

function showDashboard() {

    dashboard.classList.remove("d-none");

}


// ==========================================
// Hide Dashboard
// ==========================================

function hideDashboard() {

    dashboard.classList.add("d-none");

}


// ==========================================
// Lock Upload Panel
// ==========================================

function lockUploadPanel() {

    bankFile.disabled = true;

    tallyFile.disabled = true;

    uploadButton.disabled = true;

    uploadButton.classList.remove("btn-primary");

    uploadButton.classList.add("btn-success");

    uploadButton.innerHTML = "Reconciliation Complete";

    newRecon.classList.remove("d-none");

}


// ==========================================
// Unlock Upload Panel
// ==========================================

function unlockUploadPanel() {

    bankFile.disabled = false;

    tallyFile.disabled = false;

    uploadButton.disabled = false;

    uploadButton.innerText = "Start Reconciliation";

    bankFile.value = "";

    tallyFile.value = "";

    newRecon.classList.add("d-none");

}


// ==========================================
// Update Summary Cards
// ==========================================

function updateSummary(summary) {

    bankCount.innerText =
        summary.totalBankTransactions;

    tallyCount.innerText =
        summary.totalTallyTransactions;

    matchedCount.innerText =
        summary.matchedTransactions;

    mismatchCount.innerText =
        summary.missingInBank +
        summary.missingInTally;

}


// ==========================================
// Populate Mismatch Table
// ==========================================

function populateMismatchTable(data) {

    mismatchTable.innerHTML = "";

    // Missing In Bank

    data.missingInBank.forEach(transaction => {

        mismatchTable.innerHTML += `

        <tr>

            <td>-</td>

            <td>${transaction.excelRow}</td>

            <td>${transaction.reference ?? "-"}</td>

            <td>${transaction.amount ?? "-"}</td>

            <td>

                <span class="badge bg-warning">

                    Missing In Bank

                </span>

            </td>

        </tr>

        `;

    });


    // Missing In Tally

    data.missingInTally.forEach(transaction => {

        mismatchTable.innerHTML += `

        <tr>

            <td>${transaction.excelRow}</td>

            <td>-</td>

            <td>${transaction.reference ?? "-"}</td>

            <td>${transaction.amount ?? "-"}</td>

            <td>

                <span class="badge bg-danger">

                    Missing In Tally

                </span>

            </td>

        </tr>

        `;

    });

}


// ==========================================
// Reset Dashboard
// ==========================================

function resetDashboard() {

    hideDashboard();

    mismatchTable.innerHTML = "";

    bankCount.innerText = 0;

    tallyCount.innerText = 0;

    matchedCount.innerText = 0;

    mismatchCount.innerText = 0;

}


// ==========================================
// New Reconciliation
// ==========================================

newRecon.addEventListener("click", () => {

    unlockUploadPanel();

    resetDashboard();

});