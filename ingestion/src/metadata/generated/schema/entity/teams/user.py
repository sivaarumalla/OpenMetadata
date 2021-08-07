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
#   filename:  schema/entity/teams/user.json
#   timestamp: 2021-07-31T17:12:10+00:00

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field, constr

from metadata.generated.schema.type import basic, entityReference


class UserName(BaseModel):
    __root__: constr(min_length=1, max_length=64) = Field(
        ...,
        description='Unique name of the user typically the user ID from the identify provider. Example - uid from ldap.',
    )


class UserEntity(BaseModel):
    id: basic.Uuid = Field(
        ..., description='Unique identifier that identifies an entity instance'
    )
    name: UserName
    displayName: Optional[str] = Field(
        None, description="Name used for display purposes. Example 'FirstName LastName'"
    )
    email: basic.Email
    href: basic.Href = Field(
        ..., description='Link to the resource corresponding to this entity'
    )
    timezone: Optional[str] = Field(None, description='Timezone of the user')
    deactivated: Optional[bool] = None
    isBot: Optional[bool] = None
    isAdmin: Optional[bool] = Field(
        None,
        description='When true indicates user is an adiministrator for the sytem with superuser privileges',
    )
    profile: Optional[
        profile.TypeUsedToCaptureProfileOfAUserTeamOrAnOrganization
    ] = None
    teams: Optional[entityReference.EntityReferenceList] = Field(
        None, description='Teams that the user belongs to'
    )
    owns: Optional[entityReference.EntityReferenceList] = Field(
        None, description='Entities owned by the user'
    )
    follows: Optional[entityReference.EntityReferenceList] = Field(
        None, description='Entities followed by the user'
    )
