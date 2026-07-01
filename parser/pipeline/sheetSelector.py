import pandas as pd


class SheetSelector:

    @staticmethod
    def select(sheets: dict) -> pd.DataFrame:

        selected_sheet = None
        selected_sheet_name = None

        max_rows = -1

        for name, df in sheets.items():

            if len(df) > max_rows:

                max_rows = len(df)

                selected_sheet = df

                selected_sheet_name = name

        return {
            "dataframe": selected_sheet,
            "sheetName": selected_sheet_name
}