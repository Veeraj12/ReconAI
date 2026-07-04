// =====================================================
// Chart Instances
// =====================================================

let summaryChart = null;
let ruleChart = null;

// Fixed label set for the rule-distribution chart so the axis
// stays stable across reconciliations, even when a rule has
// zero matches for a given run.

const RULE_LABELS = {

    REFERENCE: "Reference",

    REFERENCE_DATE_TOLERANCE: "Reference (Date Tolerance)",

    AMOUNT_DATE: "Amount / Date"

};


// =====================================================
// Destroy Existing Charts
// =====================================================

function destroyCharts() {

    if (summaryChart) {

        summaryChart.destroy();

    }

    if (ruleChart) {

        ruleChart.destroy();

    }

}


// =====================================================
// Render All Charts
// =====================================================

function renderCharts(data, statistics) {

    destroyCharts();

    renderSummaryChart(data.summary);

    renderRuleChart(statistics.ruleCounts);

}


// =====================================================
// Summary Pie Chart
// =====================================================

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


// =====================================================
// Rule Distribution
// =====================================================

function renderRuleChart(ruleCounts) {

    const ctx = document
        .getElementById("ruleChart")
        .getContext("2d");

    const ruleKeys = Object.keys(RULE_LABELS);

    ruleChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: ruleKeys.map(key => RULE_LABELS[key]),

            datasets: [

                {

                    label: "Matched Transactions",

                    data: ruleKeys.map(key => ruleCounts[key] || 0)

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

                    beginAtZero: true,

                    ticks: {

                        precision: 0

                    }

                }

            }

        }

    });

}