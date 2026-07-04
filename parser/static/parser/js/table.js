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

function populateMatchedTable(matches) {

    const rows = matches.map(match => {

        const bank =
            match.bankTransaction;

        const tally =
            match.tallyTransaction;

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

    });

    matchedTable.innerHTML = rows.join("");

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

    missingBankTable.innerHTML =
        transactions.map(missingRowHtml).join("");

}

function populateMissingTallyTable(transactions) {

    missingTallyTable.innerHTML =
        transactions.map(missingRowHtml).join("");

}


// =====================================================
// Exceptions (Amount Mismatches / Type Mismatches)
// =====================================================

function populateExceptionTables(exceptions) {

    // console.log("populateExceptionTables called");

    // console.log(exceptions);

    // console.log(exceptions.amountMismatches);

    // console.log(amountMismatchTable);

    const amountRows = exceptions.amountMismatches.map(pair => {
        // console.log("INSIDER called");
        const bank = pair.bankTransaction;
        const tally = pair.tallyTransaction;

        return `
            <tr style="5px solid red">
                <td>${bank.date ?? "-"}</td>
                <td>${bank.excelRow}</td>
                <td>${tally.excelRow}</td>
                <td>${bank.reference ?? "-"}</td>
                <td>${bank.amount ?? "-"}</td>
                <td>${tally.amount ?? "-"}</td>
                <td class="text-danger">${pair.amountDifference}</td>
            </tr>
        `;

    });

    amountMismatchTable.innerHTML = amountRows.join("");

    const typeRows = exceptions.typeMismatches.map(pair => {

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

    });

    typeMismatchTable.innerHTML = typeRows.join("");

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

    duplicateBankTable.innerHTML =
        duplicates.bank.map(duplicateRowHtml).join("");

    duplicateTallyTable.innerHTML =
        duplicates.tally.map(duplicateRowHtml).join("");

    duplicatesCount.textContent =
        duplicates.bank.length + duplicates.tally.length;

}


// =====================================================
// Sign Reversal Hints
// =====================================================

function populateHintsTable(hints) {

    const rows = hints.map(hint => {

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

    });

    hintsTable.innerHTML = rows.join("");

    hintsCount.textContent = hints.length;

}