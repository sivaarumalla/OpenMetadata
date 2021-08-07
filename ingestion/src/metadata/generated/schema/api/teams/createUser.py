#  Licensed to the Apache Software Foundation (ASF) under one or more
#  contributor license agreements. See the NOTICE file distributed with
#  this work for additional information regarding copyright ownership.
#  The ASF licenses this file to You under the Apache License, Version 2.0
#  (the "License"); you may not use this file except in compliance with
#  the License. You may obtain a copy of the License at
#
#  http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

# generated by datamodel-codegen:
#   filename:  schema/api/teams/createUser.json
#   timestamp: 2021-07-31T17:12:10+00:00

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field

from metadata.generated.schema.entity.teams import user
from metadata.generated.schema.type import basic, profile


class RequestToCreateUserEntity(BaseModel):
    name: user.UserName
    displayName: Optional[str] = Field(
        None, description="Name used for display purposes. Example 'FirstName LastName'"
    )
    email: basic.Email
    timezone: Optional[str] = Field(None, description='Timezone of the user')
    isBot: Optional[bool] = Field(
        None,
        description='When true indicates user is a bot with appropriate privileges',
    )
    isAdmin: Optional[bool] = Field(
        False,
        description='When true indicates user is an adiministrator for the sytem with superuser privileges',
    )
    profile: Optional[
        profile.TypeUsedToCaptureProfileOfAUserTeamOrAnOrganization
    ] = None
    teams: Optional[List[basic.Uuid]] = Field(
        None, description='Teams that the user belongs to'
    )
