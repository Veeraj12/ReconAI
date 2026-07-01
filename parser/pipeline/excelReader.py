import pandas as pd


class ExcelReader:

    @staticmethod
    def read(file):

        """
        Returns
        {
            "Sheet1": DataFrame,
            "Transactions": DataFrame
        }
        """

        try:

            sheets = pd.read_excel(
                file,
                sheet_name=None
            )

            return sheets

        except Exception as e:

            raise Exception(f"Unable to read excel file : {e}")