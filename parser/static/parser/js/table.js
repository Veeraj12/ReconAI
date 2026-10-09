// =====================================================
// Pagination
// =====================================================
// Setting .innerHTML with tens or hundreds of thousands of <tr>
// elements is what actually freezes the browser on large
// reconciliations — not the backend, and not the network transfer.
// Every table renders at most PAGE_SIZE rows at a time; Previous/Next
// re-render just the current page from the already-fetched data
// (no additional network requests).

const PAGE_SIZE = 200;

function setupPaginatedTable(tableId, rows, rowRenderer) {

    const tbody = document.getElementById(tableId);
    const pager = document.getElementById(tableId + "Pager");

    const totalRows = rows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

    let currentPage = 0;

    function renderPage() {

        const start = currentPage * PAGE_SIZE;
        const pageRows = rows.slice(start, start + PAGE_SIZE);

        tbody.innerHTML = pageRows.map(rowRenderer).join("");

        if (pager) {

            const info = pager.querySelector(".page-info");
            const prevBtn = pager.querySelector(".prev-btn");
            const nextBtn = pager.querySelector(".next-btn");

            info.textContent = totalRows === 0
                ? "No rows"
                : `Showing ${start + 1}-${Math.min(start + PAGE_SIZE, totalRows)} of ${totalRows}`;

            prevBtn.disabled = currentPage === 0;
            nextBtn.disabled = currentPage >= totalPages - 1;

        }

    }

    if (pager) {

        const prevBtn = pager.querySelector(".prev-btn");
        const nextBtn = pager.querySelector(".next-btn");

        prevBtn.onclick = () => {
            if (currentPage > 0) {
                currentPage--;
                renderPage();
            }
        };

        nextBtn.onclick = () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                renderPage();
            }
        };

    }

    renderPage();

}


// =====================================================
// Table Elements
// =====================================================

const matchedTable =
    document.getElementById("matchedTable");

const missingBankTable =
    document.getElementById("missingBankTable");

const missingTallyTable =
    document.getElementById("missingTallyTable");

const amountMismatchTable =
    document.getElementById("amountMismatchTable");

const typeMismatchTable =
    document.getElementById("typeMismatchTable");

const duplicateBankTable =
    document.getElementById("duplicateBankTable");

const duplicateTallyTable =
    document.getElementById("duplicateTallyTable");

const hintsTable =
    document.getElementById("hintsTable");

const exceptionsCount =
    document.getElementById("exceptionsCount");

const duplicatesCount =
    document.getElementById("duplicatesCount");

const hintsCount =
    document.getElementById("hintsCount");


// =====================================================
// Populate All Tables
// =====================================================

function populateTables(data) {

    clearTables();

    populateMatchedTable(
        data.matchedTransactions
    );

    populateMissingBankTable(
        data.missingInBank
    );

    populateMissingTallyTable(
        data.missingInTally
    );

    populateExceptionTables(
        data.exceptions
    );

    populateDuplicateTables(
        data.duplicates
    );

    populateHintsTable(
        data.signReversalHints
    );

}


// =====================================================
// Clear Tables
// =====================================================

function clearTables() {

    matchedTable.innerHTML = "";
    missingBankTable.innerHTML = "";
    missingTallyTable.innerHTML = "";
    amountMismatchTable.innerHTML = "";
    typeMismatchTable.innerHTML = "";
    duplicateBankTable.innerHTML = "";
    duplicateTallyTable.innerHTML = "";
    hintsTable.innerHTML = "";

    exceptionsCount.textContent = "0";
    duplicatesCount.textContent = "0";
    hintsCount.textContent = "0";

}


// =====================================================
// Matched Transactions
// =====================================================

function matchedRowHtml(match) {

    const bank = match.bankTransaction;
    const tally = match.tallyTransaction;

    return `
        <tr>
            <td>${bank.date ?? "-"}</td>
            <td>${bank.excelRow}</td>
            <td>${tally.excelRow}</td>
            <td>${bank.reference ?? "-"}</td>
            <td>${bank.amount ?? "-"}</td>
            <td>
                <span class="badge bg-success">
                    ${match.matchingRule}
                </span>
            </td>
        </tr>
    `;

}

function populateMatchedTable(matches) {

    setupPaginatedTable("matchedTable", matches, matchedRowHtml);

}


// =====================================================
// Missing In Bank / Missing In Tally
// =====================================================
// A "missing" row may actually be the leftover copy of a same-file
// duplicate (see reconciliationService.py's duplicateArtifact flag) —
// shown here with a muted badge instead of presenting it as an
// unexplained gap.

function missingRowHtml(transaction) {

    const artifactBadge = transaction.duplicateArtifact
        ? `<span class="badge bg-secondary ms-2" title="${transaction.note ?? ""}">duplicate copy</span>`
        : "";

    return `
        <tr>
            <td>${transaction.date ?? "-"}</td>
            <td>${transaction.excelRow}</td>
            <td>${transaction.reference ?? "-"}</td>
            <td>${transaction.amount ?? "-"}${artifactBadge}</td>
        </tr>
    `;

}

function populateMissingBankTable(transactions) {

    setupPaginatedTable("missingBankTable", transactions, missingRowHtml);

}

function populateMissingTallyTable(transactions) {

    setupPaginatedTable("missingTallyTable", transactions, missingRowHtml);

}


// =====================================================
// Exceptions (Amount Mismatches / Type Mismatches)
// =====================================================

function amountMismatchRowHtml(pair) {

    const bank = pair.bankTransaction;
    const tally = pair.tallyTransaction;

    return `
        <tr>
            <td>${bank.date ?? "-"}</td>
            <td>${bank.excelRow}</td>
            <td>${tally.excelRow}</td>
            <td>${bank.reference ?? "-"}</td>
            <td>${bank.amount ?? "-"}</td>
            <td>${tally.amount ?? "-"}</td>
            <td class="text-danger">${pair.amountDifference}</td>
        </tr>
    `;

}

function typeMismatchRowHtml(pair) {

    const bank = pair.bankTransaction;
    const tally = pair.tallyTransaction;

    return `
        <tr>
            <td>${bank.date ?? "-"}</td>
            <td>${bank.excelRow}</td>
            <td>${tally.excelRow}</td>
            <td>${bank.reference ?? "-"}</td>
            <td>${bank.amount ?? "-"}</td>
            <td>${bank.transactionType ?? "-"}</td>
            <td>${tally.transactionType ?? "-"}</td>
        </tr>
    `;

}

function populateExceptionTables(exceptions) {

    setupPaginatedTable("amountMismatchTable", exceptions.amountMismatches, amountMismatchRowHtml);
    setupPaginatedTable("typeMismatchTable", exceptions.typeMismatches, typeMismatchRowHtml);

    exceptionsCount.textContent =
        exceptions.amountMismatches.length + exceptions.typeMismatches.length;

}


// =====================================================
// Duplicates
// =====================================================

function duplicateRowHtml(transaction) {

    return `
        <tr>
            <td>${transaction.date ?? "-"}</td>
            <td>${transaction.excelRow}</td>
            <td>${transaction.reference ?? "-"}</td>
            <td>${transaction.amount ?? "-"}</td>
            <td>${transaction.transactionType ?? "-"}</td>
        </tr>
    `;

}

function populateDuplicateTables(duplicates) {

    setupPaginatedTable("duplicateBankTable", duplicates.bank, duplicateRowHtml);
    setupPaginatedTable("duplicateTallyTable", duplicates.tally, duplicateRowHtml);

    duplicatesCount.textContent =
        duplicates.bank.length + duplicates.tally.length;

}


// =====================================================
// Sign Reversal Hints
// =====================================================

function hintRowHtml(hint) {

    const bank = hint.bankTransaction;
    const tally = hint.tallyTransaction;

    return `
        <tr>
            <td>${bank.date ?? "-"}</td>
            <td>${bank.excelRow}</td>
            <td>${tally.excelRow}</td>
            <td>${bank.amount ?? "-"}</td>
            <td>${bank.transactionType ?? "-"}</td>
            <td>${tally.transactionType ?? "-"}</td>
        </tr>
    `;

}

function populateHintsTable(hints) {

    setupPaginatedTable("hintsTable", hints, hintRowHtml);

    hintsCount.textContent = hints.length;

}