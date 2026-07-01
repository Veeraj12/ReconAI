import pandas as pd
import re

class TransactionExtractor:

    DEBIT = "DEBIT"
    CREDIT = "CREDIT"
    UNKNOWN = "UNKNOWN"
    @staticmethod
    def normalizeAmount(value):

        if value is None:
            return None

        value = str(value).strip()

        value = value.replace(",", "")
        value = value.replace("₹", "")

        negative = value.startswith("(") and value.endswith(")")
        value = value.replace("(", "").replace(")", "")
        amount = float(value)
        if negative:

            amount *= -1
        try:
            return amount
        except ValueError:
            return None
    
    @staticmethod
    def normalizeDate(value):

        if value is None:
            return None

        try:

            return pd.to_datetime(value).strftime("%Y-%m-%d")

        except Exception:

            return None
    
    @staticmethod
    def normalizeReference(value):

        if value is None:
            return None

        value = str(value).upper().strip()

        value = value.replace("-", "")

        value = value.replace("/", "")

        value = re.sub(r"\s+", "", value)

        return value

    @staticmethod
    def extract(dataframe, mapped_headers, source):

        transactions = []

        total_rows = len(dataframe)

        parsed_rows = 0

        empty_rows = 0

        transaction_id = 1

        for index, row in dataframe.iterrows():

            transaction = {}

            transaction["matchInfo"] = {
                "matched": False,
                "matchedWith": None,
                "rule": None,
                "confidence": 0
            }
            
            is_empty = True

            for standard_name, excel_column in mapped_headers.items():

                value = row.get(excel_column)

                if pd.isna(value):
                    value = None
                else:
                    is_empty = False
                    if standard_name == "date":
                        value = TransactionExtractor.normalizeDate(value)

                    elif standard_name == "reference":
                        value = TransactionExtractor.normalizeReference(value)

                    elif standard_name in ["debit", "credit"]:
                        value = TransactionExtractor.normalizeAmount(value)

                transaction[standard_name] = value

            if is_empty:

                empty_rows += 1
                continue

            # Normalize Amount : meaning as per the availability we set  transaction types

            debit = transaction.get("debit")
            credit = transaction.get("credit")

            if debit is not None:

                transaction["amount"] = debit

                transaction["transactionType"] = "DEBIT"

            elif credit is not None:

                transaction["amount"] = credit

                transaction["transactionType"] = "CREDIT"

            else:

                transaction["amount"] = None

                transaction["transactionType"] = None

            transaction["transactionId"] = transaction_id
            transaction["source"] = source
            transaction["excelRow"] = index + 2

            transaction_id += 1

            parsed_rows += 1

            transactions.append(transaction)

        return {

            "transactions": transactions,

            "statistics": {

                "totalRows": total_rows,

                "parsedRows": parsed_rows,

                "emptyRows": empty_rows

            }

        }