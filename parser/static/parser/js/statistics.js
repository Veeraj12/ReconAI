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

    return {

        referenceMatches: summary.referenceMatches || 0,

        dateToleranceMatches: summary.dateToleranceMatches || 0,

        amountDateMatches: summary.amountDateMatches || 0,

        duplicateEntries: summary.duplicateEntries || 0,

        matchPercentage: summary.matchPercentage,

        totalMismatch: summary.missingInBank + summary.missingInTally,

        // Sourced directly from summary — avoids looping the full
        // matchedTransactions array client-side, which can be
        // hundreds of thousands of rows on large reconciliations.
        ruleCounts: {

            REFERENCE: summary.referenceMatches || 0,

            REFERENCE_DATE_TOLERANCE: summary.dateToleranceMatches || 0,

            AMOUNT_DATE: summary.amountDateMatches || 0,

        },

    };

}