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

import { Typography } from 'antd';
import { AxiosError } from 'axios';
import { compare } from 'fast-json-patch';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getUserByName,
  revokeUserToken,
  updateUserDetail,
} from '../../axiosAPIs/userAPI';
import BotDetails from '../../components/BotDetails/BotDetails.component';
import ErrorPlaceHolder from '../../components/common/error-with-placeholder/ErrorPlaceHolder';
import PageContainerV1 from '../../components/containers/PageContainerV1';
import Loader from '../../components/Loader/Loader';
import { usePermissionProvider } from '../../components/PermissionProvider/PermissionProvider';
import {
  OperationPermission,
  ResourceEntity,
} from '../../components/PermissionProvider/PermissionProvider.interface';
import { UserDetails } from '../../components/Users/Users.interface';
import { NO_PERMISSION_TO_VIEW } from '../../constants/HelperTextUtil';
import { User } from '../../generated/entity/teams/user';
import jsonData from '../../jsons/en';
import { DEFAULT_ENTITY_PERMISSION } from '../../utils/PermissionsUtils';
import { showErrorToast } from '../../utils/ToastUtils';

const BotDetailsPage = () => {
  const { botsName } = useParams<{ [key: string]: string }>();
  const { getEntityPermissionByFqn } = usePermissionProvider();
  const [botsData, setBotsData] = useState<User>({} as User);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [botPermission, setBotPermission] = useState<OperationPermission>(
    DEFAULT_ENTITY_PERMISSION
  );

  const fetchBotPermission = async (entityFqn: string) => {
    setIsLoading(true);
    try {
      const response = await getEntityPermissionByFqn(
        ResourceEntity.BOT,
        entityFqn
      );
      setBotPermission(response);
    } catch (error) {
      showErrorToast(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBotsData = () => {
    setIsLoading(true);
    getUserByName(botsName)
      .then((res) => {
        if (res) {
          setBotsData(res);
        } else {
          throw jsonData['api-error-messages']['unexpected-server-response'];
        }
      })
      .catch((err: AxiosError) => {
        showErrorToast(
          err,
          jsonData['api-error-messages']['fetch-user-details-error']
        );
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  };

  const updateBotsDetails = async (data: UserDetails) => {
    const updatedDetails = { ...botsData, ...data };
    const jsonPatch = compare(botsData, updatedDetails);

    try {
      const response = await updateUserDetail(botsData.id, jsonPatch);
      if (response) {
        setBotsData((prevData) => ({
          ...prevData,
          ...response,
        }));
      } else {
        throw jsonData['api-error-messages']['unexpected-error'];
      }
    } catch (error) {
      showErrorToast(error as AxiosError);
    }
  };

  const revokeBotsToken = () => {
    revokeUserToken(botsData.id)
      .then((res) => {
        const data = res;
        setBotsData(data);
      })
      .catch((err: AxiosError) => {
        showErrorToast(err);
      });
  };

  const getBotsDetailComponent = () => {
    if (isError) {
      return (
        <ErrorPlaceHolder>
          <Typography.Paragraph
            className="tw-text-base"
            data-testid="error-message">
            No bots available with name{' '}
            <span className="tw-font-medium" data-testid="username">
              {botsName}
            </span>{' '}
          </Typography.Paragraph>
        </ErrorPlaceHolder>
      );
    } else {
      return (
        <BotDetails
          botsData={botsData}
          revokeTokenHandler={revokeBotsToken}
          updateBotsDetails={updateBotsDetails}
        />
      );
    }
  };

  useEffect(() => {
    if (botPermission.ViewAll) {
      fetchBotsData();
    }
  }, [botPermission, botsName]);

  useEffect(() => {
    fetchBotPermission(botsName);
  }, [botsName]);

  return (
    <PageContainerV1 className="tw-py-4">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {botPermission.ViewAll ? (
            getBotsDetailComponent()
          ) : (
            <ErrorPlaceHolder>{NO_PERMISSION_TO_VIEW}</ErrorPlaceHolder>
          )}
        </>
      )}
    </PageContainerV1>
  );
};

export default BotDetailsPage;
