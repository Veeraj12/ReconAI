// ==========================================
// Statistics Calculator
// ==========================================
//
// Single entry point: calculateStatistics(data)
// Derives referenceMatches, amountDateMatches, duplicateEntries,
// matchPercentage, totalMismatch and ruleCounts from the raw
// backend payload. This is the ONLY place these values are
// calculated — dashboard.js must not recompute any of them.
// ==========================================

// function calculateStatistics(data) {

//     const statistics = {

//         referenceMatches: 0,

//         amountDateMatches: 0,

//         duplicateEntries: 0,

//         matchPercentage: 0,

//         totalMismatch: 0,

//         ruleCounts: {}

//     };

//     // ==========================================
//     // Rule Counts
//     // ==========================================

//     data.matchedTransactions.forEach(match => {

//         const rule = match.matchingRule;

//         if (!statistics.ruleCounts[rule]) {

//             statistics.ruleCounts[rule] = 0;

//         }

//         statistics.ruleCounts[rule]++;

//     });

//     statistics.referenceMatches =
//         statistics.ruleCounts["REFERENCE"] || 0;

//     statistics.amountDateMatches =
//         statistics.ruleCounts["AMOUNT_DATE"] || 0;

//     // ==========================================
//     // Duplicate Entries
//     // ==========================================

//     const references = new Set();

//     data.missingInBank.forEach(transaction => {

//         const reference = transaction.reference;

//         if (!reference)
//             return;

//         if (references.has(reference)) {

//             statistics.duplicateEntries++;

//         }

//         else {

//             references.add(reference);

//         }

//     });

//     // ==========================================
//     // Match Percentage
//     // ==========================================

//     statistics.matchPercentage = (

//         data.summary.matchedTransactions

//         /

//         data.summary.totalBankTransactions

//     ) * 100;

//     statistics.matchPercentage =
//         statistics.matchPercentage.toFixed(2);

//     // ==========================================
//     // Total Mismatch
//     // ==========================================

//     statistics.totalMismatch =

//         data.summary.missingInBank +

//         data.summary.missingInTally;

//     return statistics;

// }

// ==========================================
// Statistics Calculator
// ==========================================
//
// Single entry point: calculateStatistics(data)
//
// referenceMatches, dateToleranceMatches, amountDateMatches,
// duplicateEntries and matchPercentage are now computed authoritatively
// by the backend (reconciliationService.py) — it has full visibility
// into duplicate detection and exception handling that the frontend
// doesn't. This function trusts that summary rather than recomputing
// an approximation, and only builds ruleCounts locally since that's
// purely a presentation concern for the Match Rules chart.
// ==========================================

function calculateStatistics(data) {

    const summary = data.summary;

    const statistics = {

        referenceMatches: summary.referenceMatches || 0,

        dateToleranceMatches: summary.dateToleranceMatches || 0,

        amountDateMatches: summary.amountDateMatches || 0,

        duplicateEntries: summary.duplicateEntries || 0,

        matchPercentage: summary.matchPercentage,

        totalMismatch: summary.missingInBank + summary.missingInTally,

        ruleCounts: {}

    };

    // ==========================================
    // Rule Counts (for the Match Rules chart)
    // ==========================================

    data.matchedTransactions.forEach(match => {

        const rule = match.matchingRule;

        statistics.ruleCounts[rule] =
            (statistics.ruleCounts[rule] || 0) + 1;

    });

    return statistics;

}