class MatchingEngine:

    @staticmethod
    def match(bank_transaction, indexes):

        reference = bank_transaction.get("reference")
        amount = bank_transaction.get("amount")
        transaction_type = bank_transaction.get("transactionType")
        date = bank_transaction.get("date")

        # ----------------------------------
        # Rule 1 : Reference + Amount + Type
        # ----------------------------------

        if reference:

            # candidate = indexes["reference"].get(
            #     str(reference).strip()
            # )
            reference = str(reference).strip()
            candidates = indexes["reference"].get(reference, [])
            for candidate in candidates:
                if (
                    candidate
                    and not candidate["matchInfo"]["matched"]
                    and float(candidate["amount"]) == float(amount)
                    and candidate["transactionType"] == transaction_type
                ):

                    return {

                        "matched": True,

                        "candidate": candidate,

                        "rule": "REFERENCE"

                    }

        # ----------------------------------
        # Rule 2 : Amount + Date + Type
        # ----------------------------------

        candidates = indexes["amount"].get(amount, [])

        for candidate in candidates:

            if candidate["matchInfo"]["matched"]:
                continue

            if (
                candidate["date"] == date
                and candidate["transactionType"] == transaction_type
            ):

                return {

                    "matched": True,

                    "candidate": candidate,

                    "rule": "AMOUNT_DATE"

                }

        return {

            "matched": False,

            "candidate": None,

            "rule": None

        }