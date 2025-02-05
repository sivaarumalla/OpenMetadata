---
title: One Login SSO for Docker
slug: /deployment/security/one-login/docker
---

# One Login SSO for Docker

To enable security for the Docker deployment, follow the next steps:

## 1. Create an .env file

Create an `openmetadata_onelogin.env` file and add the following contents as an example. Use the information
generated when setting up the account.

```shell
# OpenMetadata Server Authentication Configuration
AUTHORIZER_CLASS_NAME=org.openmetadata.service.security.DefaultAuthorizer
AUTHORIZER_REQUEST_FILTER=org.openmetadata.service.security.JwtFilter
AUTHORIZER_ADMIN_PRINCIPALS=[admin]  # Your `name` from name@domain.com
AUTHORIZER_INGESTION_PRINCIPALS=[ingestion-bot]
AUTHORIZER_PRINCIPAL_DOMAIN=open-metadata.org # Update with your domain

AUTHENTICATION_PROVIDER=custom-oidc
AUTHENTICATION_PUBLIC_KEYS={public key url} # Update with your Public Key URL
AUTHENTICATION_AUTHORITY={issuer url} # Update with your Issuer URL
AUTHENTICATION_CLIENT_ID={Client ID} # Update with your Client ID
AUTHENTICATION_CALLBACK_URL=http://localhost:8585/callback

# Airflow Configuration
AIRFLOW_AUTH_PROVIDER=custom-oidc
OM_AUTH_AIRFLOW_CUSTOM_OIDC_CLIENT_ID=Client Id # Update with your Client ID
# Make sure to add the path where the file is saved in the Airflow Volume
# It needs to be reachable locally by the container
OM_AUTH_AIRFLOW_CUSTOM_OIDC_SECRET_KEY_PATH=Secret Key Path # Update with your Secret Key Path
OM_AUTH_AIRFLOW_CUSTOM_OIDC_TOKEN_ENDPOINT_URL=endpoint
```

## 2. Start Docker

```commandline
docker compose --env-file ~/openmetadata_onelogin.env up -d
```
