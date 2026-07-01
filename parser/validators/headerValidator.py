class HeaderValidator:

    def __init__(self, config):
        """
        Stores the validation rules from the configuration.
        """

        self.required_headers = config["requiredHeaders"]

    def validate(self, mapped_headers):
        """
        Validates extracted headers against configuration.
        """

        found_headers = list(mapped_headers.keys())

        critical_missing = []
        recommended_missing = []
        optional_missing = []

        # -----------------------------
        # Check Critical Headers
        # -----------------------------

        for header in self.required_headers.get("critical", []):

            if header not in mapped_headers:

                critical_missing.append(header)

        # -----------------------------
        # Check Recommended Headers
        # -----------------------------

        for header in self.required_headers.get("recommended", []):

            if header not in mapped_headers:

                recommended_missing.append(header)

        # -----------------------------
        # Check Optional Headers
        # -----------------------------

        for header in self.required_headers.get("optional", []):

            if header not in mapped_headers:

                optional_missing.append(header)

        # -----------------------------
        # Prepare Warnings
        # -----------------------------

        warnings = []

        if recommended_missing:

            warnings.append(
                f"Recommended headers missing: {', '.join(recommended_missing)}"
            )

        # -----------------------------
        # Final Result
        # -----------------------------

        return {

            "canContinue": len(critical_missing) == 0,

            "foundHeaders": found_headers,

            "criticalMissing": critical_missing,

            "recommendedMissing": recommended_missing,

            "optionalMissing": optional_missing,

            "warnings": warnings

        }