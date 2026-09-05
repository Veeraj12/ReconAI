from functools import lru_cache

from sentence_transformers import SentenceTransformer


# ============================================================
# Configuration
# ============================================================

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# Starting values.
# We will calibrate these against the test dataset later.
# MIN_SIMILARITY = 0.55
# MIN_MARGIN = 0.08

MIN_SIMILARITY = 0.4
MIN_MARGIN = 0.04

# ============================================================
# Canonical Financial Fields
# ============================================================

CANONICAL_FIELDS = {
    "date": {
        "description": (
            "The date associated with a financial transaction, "
            "such as transaction date, posting date, value date, "
            "settlement date, processing date or voucher date."
        ),
        "examples": [
            "transaction date",
            "posting date",
            "value date",
            "settlement date",
            "processing date",
        ],
    },

    "reference": {
        "description": (
            "A unique identifier used to identify a financial transaction, "
            "payment, transfer, cheque, settlement or order."
        ),
        "examples": [
            "transaction id",
            "payment reference",
            "UTR",
            "RRN",
            "voucher number",
            "cheque number",
            "order id",
        ],
    },

    "amount": {
        "description": (
            "The monetary value of a financial transaction, "
            "payment, settlement, transfer or accounting entry."
        ),
        "examples": [
            "transaction amount",
            "payment amount",
            "settlement value",
            "net amount",
            "financial value",
        ],
    },

    "debit": {
        "description": (
            "The monetary amount representing money leaving an account "
            "or a debit-side accounting transaction."
        ),
        "examples": [
            "debit amount",
            "withdrawal",
            "money out",
            "dr amount",
        ],
    },

    "credit": {
        "description": (
            "The monetary amount representing money entering an account "
            "or a credit-side accounting transaction."
        ),
        "examples": [
            "credit amount",
            "deposit",
            "money in",
            "cr amount",
        ],
    },

    "transactionType": {
        "description": (
            "The direction or type of a financial transaction, "
            "indicating whether money is debited, credited, incoming, "
            "outgoing, paid or received."
        ),
        "examples": [
            "debit credit",
            "DR CR",
            "flow direction",
            "transaction direction",
            "incoming outgoing",
            "payment type",
        ],
    },

    "description": {
        "description": (
            "Text describing or explaining a financial transaction, "
            "including narration, remarks, particulars or details."
        ),
        "examples": [
            "narration",
            "remarks",
            "particulars",
            "transaction details",
            "description text",
        ],
    },

    "voucher": {
        "description": (
            "An accounting voucher identifier or voucher number "
            "associated with a financial entry."
        ),
        "examples": [
            "voucher number",
            "voucher id",
            "accounting voucher",
        ],
    },

    "ledger": {
        "description": (
            "The accounting ledger, account or ledger name "
            "associated with a financial transaction."
        ),
        "examples": [
            "ledger name",
            "account",
            "ledger account",
        ],
    },

    "balance": {
        "description": (
            "The remaining or closing monetary balance of an account "
            "after financial transactions."
        ),
        "examples": [
            "closing balance",
            "available balance",
            "account balance",
        ],
    },
}


# ============================================================
# Model Loading
# ============================================================

@lru_cache(maxsize=1)
def get_model():
    """
    Load the SentenceTransformer model once and reuse it.
    """
    return SentenceTransformer(MODEL_NAME)


# ============================================================
# Canonical Field Embeddings
# ============================================================

def build_field_text(field_name, metadata):
    """
    Convert a canonical field definition into semantic text.
    """

    examples = ", ".join(metadata["examples"])

    return (
        f"Financial spreadsheet field: {field_name}. "
        f"{metadata['description']} "
        f"Related terms include: {examples}."
    )


@lru_cache(maxsize=1)
def get_field_embeddings():
    """
    Generate embeddings for canonical fields once.
    """

    model = get_model()

    fields = list(CANONICAL_FIELDS.keys())

    field_texts = [
        build_field_text(
            field_name,
            CANONICAL_FIELDS[field_name],
        )
        for field_name in fields
    ]

    embeddings = model.encode(
        field_texts,
        normalize_embeddings=True,
    )

    return fields, embeddings


# ============================================================
# Unknown Column Representation
# ============================================================

def build_column_text(column_name, values):
    """
    Convert an unknown spreadsheet column into semantic text.

    Both the column name and representative values are supplied
    to the embedding model.
    """

    samples = [
        str(value).strip()
        for value in values
        if value is not None
    ][:5]

    sample_text = ", ".join(samples)

    return (
        f"Financial spreadsheet column named '{column_name}'. "
        f"Example values: {sample_text}."
    )


# ============================================================
# Candidate Ranking
# ============================================================

def rank_column_candidates(column_name, values):
    """
    Rank canonical fields according to semantic similarity.
    """

    model = get_model()

    fields, field_embeddings = get_field_embeddings()

    column_text = build_column_text(
        column_name,
        values,
    )

    column_embedding = model.encode(
        [column_text],
        normalize_embeddings=True,
    )[0]

    # Embeddings are normalized, therefore dot product
    # is equivalent to cosine similarity.
    scores = field_embeddings @ column_embedding

    ranked_candidates = sorted(
        zip(fields, scores),
        key=lambda item: item[1],
        reverse=True,
    )

    return ranked_candidates


# ============================================================
# Confidence Decision
# ============================================================

def resolve_column(column_name, values):
    """
    Decide whether an unknown column can be confidently mapped.

    Returns both the accepted mapping decision and enough
    information to explain why the decision was made.
    """

    ranked_candidates = rank_column_candidates(
        column_name,
        values,
    )

    if not ranked_candidates:
        return {
            "status": "ambiguous",
            "field": None,
            "confidence": 0.0,
            "second_best": None,
            "second_score": 0.0,
            "margin": 0.0,
            "candidates": [],
        }

    best_field, best_score = ranked_candidates[0]

    second_field = (
        ranked_candidates[1][0]
        if len(ranked_candidates) > 1
        else None
    )

    second_score = (
        float(ranked_candidates[1][1])
        if len(ranked_candidates) > 1
        else 0.0
    )

    best_score = float(best_score)
    margin = best_score - second_score

    candidates = [
        {
            "field": field,
            "score": float(score),
        }
        for field, score in ranked_candidates
    ]

    # --------------------------------------------------------
    # Below absolute similarity threshold
    # --------------------------------------------------------

    if best_score < MIN_SIMILARITY:
        return {
            "status": "unrecognized",
            "field": None,
            "confidence": best_score,
            "second_best": second_field,
            "second_score": second_score,
            "margin": margin,
            "candidates": candidates,
        }

    # --------------------------------------------------------
    # Too close to another candidate
    # --------------------------------------------------------

    if margin < MIN_MARGIN:
        return {
            "status": "ambiguous",
            "field": None,
            "confidence": best_score,
            "second_best": second_field,
            "second_score": second_score,
            "margin": margin,
            "candidates": candidates,
        }

    # --------------------------------------------------------
    # Confident mapping
    # --------------------------------------------------------

    return {
        "status": "mapped",
        "field": best_field,
        "confidence": best_score,
        "second_best": second_field,
        "second_score": second_score,
        "margin": margin,
        "candidates": candidates,
    }


# ============================================================
# Multi-Column Semantic Mapping
# ============================================================

def map_unknown_columns(df, known_columns):
    """
    Semantically map columns that were not already recognized
    by deterministic header aliases.

    Returns:

        {
            "mapping": {
                "Net Settlement Value": "amount",
                "Flow Direction": "transactionType",
            },

            "report": {
                "Net Settlement Value": {
                    "status": "mapped",
                    "field": "amount",
                    "confidence": 0.82,
                    ...
                }
            }
        }
    """

    mapped_columns = {}
    recognition_report = {}

    # Canonical fields already occupied by deterministic mapping
    # cannot be claimed again by an unknown column.
    used_fields = {
        column
        for column in known_columns
        if column in CANONICAL_FIELDS
    }

    for column_name in df.columns:

        # ----------------------------------------------------
        # 1. Skip columns already recognized deterministically
        # ----------------------------------------------------

        if column_name in known_columns:
            continue

        # ----------------------------------------------------
        # 2. Extract representative values
        # ----------------------------------------------------

        sample_values = (
            df[column_name]
            .dropna()
            .head(5)
            .tolist()
        )

        # ----------------------------------------------------
        # 3. Semantic recognition
        # ----------------------------------------------------

        result = resolve_column(
            column_name,
            sample_values,
        )

        print("\n========================================")
        print(f"SEMANTIC COLUMN: {column_name}")
        print(f"STATUS: {result['status']}")
        print(f"BEST FIELD: {result['field']}")
        print(f"CONFIDENCE: {result['confidence']:.4f}")
        print(f"SECOND BEST: {result['second_best']}")
        print(f"SECOND SCORE: {result['second_score']:.4f}")
        print(f"MARGIN: {result['margin']:.4f}")

        print("CANDIDATES:")
        for candidate in result["candidates"][:5]:
            print(
                f"  {candidate['field']}: "
                f"{candidate['score']:.4f}"
            )

        print("========================================\n")
        # Save the complete recognition decision even when
        # the mapper rejects the column.
        recognition_report[column_name] = result

        # ----------------------------------------------------
        # 4. Ignore uncertain/unrecognized columns
        # ----------------------------------------------------

        if result["status"] != "mapped":
            continue

        field = result["field"]

        # ----------------------------------------------------
        # 5. Prevent canonical-field collisions
        # ----------------------------------------------------

        if field in used_fields:

            result["status"] = "collision"
            result["reason"] = (
                f"Canonical field '{field}' is already "
                f"occupied by another column."
            )

            continue

        # ----------------------------------------------------
        # 6. Accept mapping
        # ----------------------------------------------------

        mapped_columns[column_name] = field
        used_fields.add(field)

    return {
        "mapping": mapped_columns,
        "report": recognition_report,
    }