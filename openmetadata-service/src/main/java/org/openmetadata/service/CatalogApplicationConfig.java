/*
 *  Copyright 2021 Collate
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package org.openmetadata.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.Configuration;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.health.conf.HealthConfiguration;
import io.federecio.dropwizard.swagger.SwaggerBundleConfiguration;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.openmetadata.schema.api.configuration.airflow.AirflowConfiguration;
import org.openmetadata.schema.api.configuration.elasticsearch.ElasticSearchConfiguration;
import org.openmetadata.schema.api.configuration.events.EventHandlerConfiguration;
import org.openmetadata.schema.api.fernet.FernetConfiguration;
import org.openmetadata.schema.api.security.AuthenticationConfiguration;
import org.openmetadata.schema.api.security.AuthorizerConfiguration;
import org.openmetadata.schema.api.security.jwt.JWTTokenConfiguration;
import org.openmetadata.schema.api.slackChat.SlackChatConfiguration;
import org.openmetadata.service.migration.MigrationConfiguration;
import org.openmetadata.service.secrets.SecretsManagerConfiguration;
import org.openmetadata.service.validators.AirflowConfigValidation;

@Getter
@Setter
public class CatalogApplicationConfig extends Configuration {
  @JsonProperty("database")
  @NotNull
  @Valid
  private DataSourceFactory dataSourceFactory;

  @JsonProperty("swagger")
  private SwaggerBundleConfiguration swaggerBundleConfig;

  @JsonProperty("authorizerConfiguration")
  private AuthorizerConfiguration authorizerConfiguration;

  @JsonProperty("authenticationConfiguration")
  private AuthenticationConfiguration authenticationConfiguration;

  @JsonProperty("jwtTokenConfiguration")
  private JWTTokenConfiguration jwtTokenConfiguration;

  @JsonProperty("elasticsearch")
  private ElasticSearchConfiguration elasticSearchConfiguration;

  @JsonProperty("eventHandlerConfiguration")
  private EventHandlerConfiguration eventHandlerConfiguration;

  @AirflowConfigValidation
  @NotNull
  @Valid
  @JsonProperty("airflowConfiguration")
  private AirflowConfiguration airflowConfiguration;

  @JsonProperty("migrationConfiguration")
  @NotNull
  private MigrationConfiguration migrationConfiguration;

  @JsonProperty("fernetConfiguration")
  private FernetConfiguration fernetConfiguration;

  @JsonProperty("health")
  @NotNull
  @Valid
  private HealthConfiguration healthConfiguration = new HealthConfiguration();

  @JsonProperty("sandboxModeEnabled")
  private boolean sandboxModeEnabled;

  @JsonProperty("slackChat")
  private SlackChatConfiguration slackChatConfiguration = new SlackChatConfiguration();

  @JsonProperty("secretsManagerConfiguration")
  private SecretsManagerConfiguration secretsManagerConfiguration;

  @JsonProperty("clusterName")
  private String clusterName;

  @Override
  public String toString() {
    return "catalogConfig{"
        + ", dataSourceFactory="
        + dataSourceFactory
        + ", swaggerBundleConfig="
        + swaggerBundleConfig
        + ", authorizerConfiguration="
        + authorizerConfiguration
        + '}';
  }
}
