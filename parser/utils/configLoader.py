import json
from pathlib import Path


class ConfigLoader:

    @staticmethod
    def load(config_name: str):

        config_path = (
            Path(__file__)
            .resolve()
            .parent.parent
            / "configs"
            / config_name
        )

        with open(config_path, "r", encoding="utf-8") as file:

            return json.load(file)