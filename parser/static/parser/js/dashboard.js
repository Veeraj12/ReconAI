// =====================================================
// Dashboard Elements
// =====================================================
// UI-only module: rendering, visibility, and panel state.
// No calculations happen here — all derived numbers come
// from statistics.js via calculateStatistics().
// =====================================================

const dashboard = document.getElementById("dashboard");

// Summary Cards (includes Match %)

const bankCount = document.getElementById("bankCount");
const tallyCount = document.getElementById("tallyCount");
const matchedCount = document.getElementById("matchedCount");
const mismatchCount = document.getElementById("mismatchCount");
const matchPercentage = document.getElementById("matchPercentage");

// Statistics

const referenceMatches =
    document.getElementById("referenceMatches");

const amountDateMatches =
    document.getElementById("amountDateMatches");

const duplicateEntries =
    document.getElementById("duplicateEntries");

// Upload Panel

const uploadButton =
    document.getElementById("uploadButton");

const bankFile =
    document.getElementById("bankFile");

const tallyFile =
    document.getElementById("tallyFile");

const newRecon =
    document.getElementById("newRecon");


// =====================================================
// Dashboard Visibility
// =====================================================

function showDashboard() {

    dashboard.classList.remove("d-none");

}

function hideDashboard() {

    dashboard.classList.add("d-none");

}


// =====================================================
// Upload Panel
// =====================================================

function lockUploadPanel() {

    bankFile.disabled = true;

    tallyFile.disabled = true;

    uploadButton.disabled = true;

    uploadButton.classList.remove("btn-primary");

    uploadButton.classList.add("btn-success");

    uploadButton.innerHTML =

        `<i class="bi bi-check-circle me-2"></i>
         Reconciliation Complete`;

    newRecon.classList.remove("d-none");

}

function unlockUploadPanel() {

    bankFile.disabled = false;

    tallyFile.disabled = false;

    uploadButton.disabled = false;

    uploadButton.classList.remove("btn-success");

    uploadButton.classList.add("btn-primary");

    uploadButton.innerHTML =

        `<i class="bi bi-play-fill me-2"></i>
         Start Reconciliation`;

    bankFile.value = "";

    tallyFile.value = "";

    newRecon.classList.add("d-none");

}


// =====================================================
// Summary Cards
// =====================================================
// summary  -> raw backend totals (bank/tally/matched counts)
// statistics -> derived values from statistics.js
//               (totalMismatch, matchPercentage)

function updateSummary(summary, statistics) {

    bankCount.textContent =
        summary.totalBankTransactions;

    tallyCount.textContent =
        summary.totalTallyTransactions;

    matchedCount.textContent =
        summary.matchedTransactions;

    mismatchCount.textContent =
        statistics.totalMismatch;

    matchPercentage.textContent =
        statistics.matchPercentage + "%";

}


// =====================================================
// Statistics Cards
// =====================================================

function updateStatistics(stats) {

    referenceMatches.textContent =
        stats.referenceMatches;

    amountDateMatches.textContent =
        stats.amountDateMatches;

    duplicateEntries.textContent =
        stats.duplicateEntries;

}


// =====================================================
// Reset Dashboard
// =====================================================

function resetDashboard() {

    hideDashboard();

    updateSummary(

        {

            totalBankTransactions: 0,

            totalTallyTransactions: 0,

            matchedTransactions: 0

        },

        {

            totalMismatch: 0,

            matchPercentage: "0.00"

        }

    );

    updateStatistics({

        referenceMatches: 0,

        amountDateMatches: 0,

        duplicateEntries: 0

    });

}


// =====================================================
// New Reconciliation
// =====================================================

newRecon.addEventListener("click", () => {

    unlockUploadPanel();

    resetDashboard();

});
