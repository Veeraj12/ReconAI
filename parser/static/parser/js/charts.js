// ==========================================
// Chart Instances
// ==========================================

let summaryChart = null;
let ruleChart = null;


// ==========================================
// Destroy Existing Charts
// ==========================================

function destroyCharts() {

    if (summaryChart) {

        summaryChart.destroy();

    }

    if (ruleChart) {

        ruleChart.destroy();

    }

}


// ==========================================
// Render Charts
// ==========================================

function renderCharts(data) {

    destroyCharts();

    renderSummaryChart(data.summary);

    renderRuleChart(data);

}


// ==========================================
// Summary Pie Chart
// ==========================================

function renderSummaryChart(summary) {

    const ctx = document
        .getElementById("summaryChart")
        .getContext("2d");

    summaryChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: [

                "Matched",

                "Missing In Bank",

                "Missing In Tally"

            ],

            datasets: [

                {

                    data: [

                        summary.matchedTransactions,

                        summary.missingInBank,

                        summary.missingInTally

                    ]

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}


// ==========================================
// Rule Distribution
// ==========================================

function renderRuleChart(data) {

    const ruleCount = {};

    data.matchedTransactions.forEach(match => {

        const rule = match.matchingRule;

        if (!ruleCount[rule]) {

            ruleCount[rule] = 0;

        }

        ruleCount[rule]++;

    });

    const ctx = document
        .getElementById("ruleChart")
        .getContext("2d");

    ruleChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: Object.keys(ruleCount),

            datasets: [

                {

                    label: "Matches",

                    data: Object.values(ruleCount)

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}