from parser.utils.configLoader import ConfigLoader


class HeaderMapper:

    def __init__(self, config):

        self.config = config

        self.header_mapping = config["headerMapping"]

    @staticmethod
    def normalize(text):

        return (
            str(text)
            .strip()
            .lower()
            .replace("_", " ")
        )

    def map_headers(self, dataframe):

        mapped = {}

        headers = list(dataframe.columns)

        for header in headers:

            normalized_header = self.normalize(header)

            for standard, aliases in self.header_mapping.items():

                aliases = [
                    self.normalize(alias)
                    for alias in aliases
                ]

                if normalized_header in aliases:

                    mapped[standard] = header

                    break

        return mapped