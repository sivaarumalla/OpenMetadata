#  Copyright 2021 Collate
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#  http://www.apache.org/licenses/LICENSE-2.0
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

"""
Validate the names in the registry match the ones of the test definition
"""


from unittest import TestCase

from metadata.generated.schema.entity.services.connections.metadata.openMetadataConnection import (
    OpenMetadataConnection,
)
from metadata.generated.schema.tests.testDefinition import TestDefinition
from metadata.ingestion.ometa.ometa_api import OpenMetadata
from metadata.test_suite.validations.core import validation_enum_registry

test_suite_config = {
    "source": {
        "type": "TestSuite",
        "serviceName": "TestSuiteWorkflow",
        "sourceConfig": {"config": {"type": "TestSuite"}},
    },
    "processor": {
        "type": "orm-test-runner",
        "config": {},
    },
    "sink": {"type": "metadata-rest", "config": {}},
    "workflowConfig": {
        "openMetadataServerConfig": {
            "hostPort": "http://localhost:8585/api",
        }
    },
}


class TestRegistryNamesMatchTestDefinition(TestCase):
    """Test the names in the registry match that of the ones in the Test Definition"""

    metadata = OpenMetadata(
        OpenMetadataConnection.parse_obj(
            test_suite_config["workflowConfig"]["openMetadataServerConfig"]
        )
    )

    def test_name_match(self):
        """test all the names in the registry match the ones from the test definition"""

        test_definition_names = {
            entity.name.__root__
            for entity in self.metadata.list_all_entities(
                entity=TestDefinition, params={"limit": "100"}
            )
        }

        assert set(validation_enum_registry.registry.keys()).issubset(
            test_definition_names
        )
