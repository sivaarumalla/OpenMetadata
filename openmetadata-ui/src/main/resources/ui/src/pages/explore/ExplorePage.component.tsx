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

import { AxiosError } from 'axios';
import { get, isEmpty } from 'lodash';
import {
  Bucket,
  FilterObject,
  SearchDataFunctionType,
  SearchResponse,
} from 'Models';
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import AppState from '../../AppState';
import { searchData } from '../../axiosAPIs/miscAPI';
import PageContainerV1 from '../../components/containers/PageContainerV1';
import Explore from '../../components/Explore/Explore.component';
import {
  ExploreSearchData,
  TabCounts,
  UrlParams,
} from '../../components/Explore/explore.interface';
import { getExplorePathWithSearch, PAGE_SIZE } from '../../constants/constants';
import {
  emptyValue,
  getCurrentIndex,
  getCurrentTab,
  getEntityTypeByIndex,
  getInitialFilter,
  getQueryParam,
  getSearchFilter,
  INITIAL_FROM,
  INITIAL_SORT_ORDER,
  INITIAL_TAB_COUNTS,
  tabsInfo,
  ZERO_SIZE,
} from '../../constants/explore.constants';
import { SearchIndex } from '../../enums/search.enum';
import jsonData from '../../jsons/en';
import { getTotalEntityCountByType } from '../../utils/EntityUtils';
import { getFilterString, prepareQueryParams } from '../../utils/FilterUtils';
import { showErrorToast } from '../../utils/ToastUtils';

const ExplorePage: FunctionComponent = () => {
  const location = useLocation();
  const history = useHistory();
  const initialFilter = useMemo(
    () => getQueryParam(getInitialFilter(location.search)),
    [location.search]
  );
  const searchFilter = useMemo(
    () => getQueryParam(getSearchFilter(location.search)),
    [location.search]
  );
  const [error, setError] = useState<string>('');
  const { searchQuery, tab } = useParams<UrlParams>();
  const [searchText, setSearchText] = useState<string>(searchQuery || '');
  const [tabCounts, setTabCounts] = useState<TabCounts>(INITIAL_TAB_COUNTS);
  const [searchResult, setSearchResult] = useState<ExploreSearchData>();
  const [showDeleted, setShowDeleted] = useState(false);
  const [initialSortField] = useState<string>(
    tabsInfo[getCurrentTab(tab) - 1].sortField
  );

  const handleTabCounts = (value: { [key: string]: number }) => {
    setTabCounts((prev) => ({ ...prev, ...value }));
  };

  const handleSearchText = (text: string) => {
    setSearchText(text);
  };

  const handlePathChange = (path: string) => {
    AppState.updateExplorePageTab(path);
  };

  /**
   * on filter change , change the route
   * @param filterData - filter object
   */
  const handleFilterChange = (filterData: FilterObject) => {
    const params = prepareQueryParams(filterData, initialFilter);

    const explorePath = getExplorePathWithSearch(searchQuery, tab);

    history.push({
      pathname: explorePath,
      search: params,
    });
  };

  const fetchEntityCount = async (indexType: SearchIndex) => {
    const entityType = getEntityTypeByIndex(indexType);
    try {
      const { data } = await searchData(
        searchText,
        0,
        0,
        getFilterString(initialFilter),
        emptyValue,
        emptyValue,
        indexType,
        showDeleted,
        true
      );
      const count = getTotalEntityCountByType(
        data.aggregations?.['sterms#EntityType']?.buckets as Bucket[]
      );

      setTabCounts((prev) => ({ ...prev, [entityType]: count }));
    } catch (_error) {
      showErrorToast(
        jsonData['api-error-messages']['fetch-entity-count-error']
      );
    }
  };

  const fetchCounts = () => {
    fetchEntityCount(SearchIndex.TABLE);

    fetchEntityCount(SearchIndex.TOPIC);

    fetchEntityCount(SearchIndex.DASHBOARD);

    fetchEntityCount(SearchIndex.PIPELINE);

    fetchEntityCount(SearchIndex.MLMODEL);
  };

  const fetchData = (value: SearchDataFunctionType[]) => {
    const promiseValue = value.map((d) => {
      return searchData(
        d.queryString,
        d.from,
        d.size,
        d.filters,
        d.sortField,
        d.sortOrder,
        d.searchIndex,
        showDeleted
      );
    });

    Promise.all(promiseValue)
      .then(
        ([
          resSearchResults,
          resAggServiceType,
          resAggTier,
          resAggTag,
          resAggDatabase,
          resAggDatabaseSchema,
          resAggServiceName,
        ]: Array<SearchResponse>) => {
          setError('');
          setSearchResult({
            resSearchResults,
            resAggServiceType,
            resAggTier,
            resAggTag,
            resAggDatabase,
            resAggDatabaseSchema,
            resAggServiceName,
          });
        }
      )
      .catch((err: AxiosError) => {
        const errMsg = get(err, 'response.data.responseMessage', '');
        setError(errMsg);
      });
  };

  useEffect(() => {
    fetchCounts();
  }, [searchText, showDeleted, initialFilter]);

  useEffect(() => {
    AppState.updateExplorePageTab(tab);
  }, [tab]);

  useEffect(() => {
    setSearchResult(undefined);

    fetchData([
      {
        queryString: searchText,
        from: INITIAL_FROM,
        size: PAGE_SIZE,
        filters: getFilterString(initialFilter),
        sortField: initialSortField,
        sortOrder: INITIAL_SORT_ORDER,
        searchIndex: getCurrentIndex(tab),
      },
      {
        queryString: searchText,
        from: INITIAL_FROM,
        size: ZERO_SIZE,
        filters: getFilterString(initialFilter),
        sortField: initialSortField,
        sortOrder: INITIAL_SORT_ORDER,
        searchIndex: getCurrentIndex(tab),
      },
      {
        queryString: searchText,
        from: INITIAL_FROM,
        size: ZERO_SIZE,
        filters: getFilterString(initialFilter),
        sortField: initialSortField,
        sortOrder: INITIAL_SORT_ORDER,
        searchIndex: getCurrentIndex(tab),
      },
      {
        queryString: searchText,
        from: INITIAL_FROM,
        size: ZERO_SIZE,
        filters: getFilterString(initialFilter),
        sortField: initialSortField,
        sortOrder: INITIAL_SORT_ORDER,
        searchIndex: getCurrentIndex(tab),
      },
    ]);
  }, []);

  return (
    <PageContainerV1>
      <Explore
        error={error}
        fetchCount={fetchCounts}
        fetchData={fetchData}
        handleFilterChange={handleFilterChange}
        handlePathChange={handlePathChange}
        handleSearchText={handleSearchText}
        handleTabCounts={handleTabCounts}
        initialFilter={initialFilter}
        isFilterSelected={!isEmpty(searchFilter) || !isEmpty(initialFilter)}
        searchFilter={searchFilter}
        searchQuery={searchQuery}
        searchResult={searchResult}
        searchText={searchText}
        showDeleted={showDeleted}
        sortValue={initialSortField}
        tab={tab}
        tabCounts={tabCounts}
        onShowDeleted={(checked) => setShowDeleted(checked)}
      />
    </PageContainerV1>
  );
};

export default ExplorePage;
