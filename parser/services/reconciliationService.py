from parser.services.indexBuilder import IndexBuilder
from parser.services.matchingEngine import MatchingEngine


class ReconciliationEngine:

    @staticmethod
    def reconcile(bank_transactions, tally_transactions):

        
        #Step 1 : Build Indexes
        

        indexes = IndexBuilder.build(tally_transactions)

        
        # Step 2: Match Transactions
        

        matched_transactions = []

        rule_counts = {}

        for bank_transaction in bank_transactions:

            result = MatchingEngine.match(
                bank_transaction,
                indexes
            )

            if not result["matched"]:
                continue

            candidate = result["candidate"]
            rule = result["rule"]

            
            # Update Bank Transaction
            

            bank_transaction["matchInfo"]["matched"] = True
            bank_transaction["matchInfo"]["matchedWith"] = candidate["transactionId"]
            bank_transaction["matchInfo"]["rule"] = rule
            bank_transaction["matchInfo"]["confidence"] = 100

            # Update Tally Transaction
            candidate["matchInfo"]["matched"] = True
            candidate["matchInfo"]["matchedWith"] = bank_transaction["transactionId"]
            candidate["matchInfo"]["rule"] = rule
            candidate["matchInfo"]["confidence"] = 100

            matched_transactions.append({

                "bankTransaction": bank_transaction,

                "tallyTransaction": candidate,

                "matchingRule": rule

            })

            rule_counts[rule] = rule_counts.get(rule, 0) + 1

        
        # Step 3 : Collect Unmatched
        unmatched_bank = [

            transaction

            for transaction in bank_transactions

            if not transaction["matchInfo"]["matched"]

        ]

        unmatched_tally = [

            transaction

            for transaction in tally_transactions

            if not transaction["matchInfo"]["matched"]

        ]

        
        #Step 4 : Duplicate Detection
        duplicate_count = 0

        seen_reference = set()

        for transaction in tally_transactions:

            reference = transaction.get("reference")

            if not reference:
                continue

            if reference in seen_reference:

                duplicate_count += 1

            else:

                seen_reference.add(reference)

        
        #Step 5 : Calculate Match Percentage
        

        total_bank = len(bank_transactions)

        total_tally = len(tally_transactions)

        matched = len(matched_transactions)

        match_percentage = 0

        if total_bank:

            match_percentage = round(
                (matched / total_bank) * 100,
                2
            )

        
        #Step 6 : Summary
        

        summary = {

            "totalBankTransactions": total_bank,

            "totalTallyTransactions": total_tally,

            "matchedTransactions": matched,

            "missingInBank": len(unmatched_tally),

            "missingInTally": len(unmatched_bank),

            "matchPercentage": match_percentage,

            "referenceMatches": rule_counts.get("REFERENCE", 0),

            "amountDateMatches": rule_counts.get("AMOUNT_DATE", 0),

            "duplicateEntries": duplicate_count

        }

        
        # Debug
        

        print("=" * 60)

        print("SUMMARY")

        print(summary)

        print()

        print("RULE COUNTS")

        print(rule_counts)

        print("=" * 60)

        
        # Final Response
        return {

            "success": True,

            "summary": summary,

            "matchedTransactions": matched_transactions,

            "missingInBank": unmatched_tally,

            "missingInTally": unmatched_bank

        }