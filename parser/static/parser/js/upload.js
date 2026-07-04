// =====================================================
// Upload Form
// =====================================================

const form = document.getElementById("uploadForm");

const csrfToken =
    document.querySelector("[name=csrfmiddlewaretoken]").value;


// =====================================================
// Upload Event
// =====================================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const bank =
        document.getElementById("bankFile").files[0];

    const tally =
        document.getElementById("tallyFile").files[0];

    if (!bank || !tally) {

        alert("Please select both files.");

        return;

    }

    uploadButton.disabled = true;

    uploadButton.innerHTML = `

        <span class="spinner-border spinner-border-sm me-2"></span>

        Processing...

    `;

    const formData = new FormData();

    formData.append("bank_file", bank);

    formData.append("tally_file", tally);

    try {

        const response = await fetch(

            "/api/upload/",

            {

                method: "POST",

                headers: {

                    "X-CSRFToken": csrfToken

                },

                body: formData

            }

        );

        if (!response.ok) {

            throw new Error("Upload Failed");

        }

        const data = await response.json();

        console.log(data);

        // ==========================================
        // Calculate Statistics
        // ==========================================

        const statistics =

            calculateStatistics(data);

        // ==========================================
        // Dashboard
        // ==========================================

        showDashboard();

        lockUploadPanel();

        updateSummary(

            data.summary,

            statistics

        );

        updateStatistics(

            statistics

        );

        // ==========================================
        // Tables
        // ==========================================

        populateTables(

            data

        );

        // ==========================================
        // Charts
        // ==========================================

        renderCharts(

            data,

            statistics

        );

    }

    catch (error) {

        console.error(error);

        alert("Something went wrong.");

        uploadButton.disabled = false;

        uploadButton.innerHTML =

            `<i class="bi bi-play-fill me-2"></i>
             Start Reconciliation`;

    }

});