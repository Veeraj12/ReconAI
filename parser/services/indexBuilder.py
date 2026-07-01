from collections import defaultdict


class IndexBuilder:

    @staticmethod
    def build(transactions):

        indexes = {

            "reference":  defaultdict(list),

            "amount": defaultdict(list),

            "date": defaultdict(list)

        }

        for transaction in transactions:

            reference = transaction.get("reference")
            amount = transaction.get("amount")
            date = transaction.get("date")

            if reference:
                reference = str(reference).strip()
                indexes["reference"][reference].append(transaction)

            indexes["amount"][amount].append(transaction)

            indexes["date"][str(date)].append(transaction)

        return indexes