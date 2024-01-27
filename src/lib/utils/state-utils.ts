import { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';

import { PaginatedResponse } from '@lib/models/response';

export const getNextPageParam = (lastPage: PaginatedResponse<any>) =>
  lastPage.data.current_page < lastPage.data.last_page ? lastPage.data.current_page + 1 : undefined;

/**
 * For each filter property, we have a new cached list.
 * This means that when we update an entry, we need to update it in all the lists where it appears.
 * To accomplish this, we can filter all the cached query keys using the base query key of the entity.
 * With this query key list, we can update the entry in all the cached lists.
 * @param {QueryClient} queryClient - The query client instance.
 * @param baseQueryKey
 * @returns {Array<string>} An array of cached query keys of the entity.
 */
export const getCachedQueryKeys = (queryClient: QueryClient, baseQueryKey: any[]) => {
  const queryCache = queryClient.getQueryCache();
  return queryCache.findAll(baseQueryKey).map((cache) => cache.queryKey);
};

export function getCachedEntryInLazyPaginatedList<T>(queryClient: QueryClient, key: QueryKey, entityId: any): T | null {
  const cachedData: InfiniteData<PaginatedResponse<T>> | undefined = queryClient.getQueryData(key);
  let entry = null;

  cachedData?.pages?.forEach((page) => {
    // Find the entry in the current page
    const foundItem = page.data.find((item: any) => Number(item.id) === Number(entityId));

    if (foundItem) {
      entry = foundItem;
    }
  });

  return entry;
}

export function getCache<T>(queryClient: QueryClient, key: QueryKey): T | undefined {
  return queryClient.getQueryData(key);
}

/** Adds an entity both as a cached value and as part of a cached array of values. */
export function addListEntity(queryClient: QueryClient, listKey: QueryKey, entity: any, create = false) {
  const cachedList: any[] = queryClient.getQueryData(listKey) || [];
  const listKeyArray = Array.isArray(listKey) ? listKey : [listKey];

  // React-query assumes that all cached keys have a queryFn getter and will generate an error indicating a missing queryFn if this is not the case.
  // To address this, a flag override may be implemented if we are aware that a getter exists for the cached key, enabling updates to only existing keys
  const entityKey = [...listKeyArray, entity.id];
  if (create || queryClient.getQueryData(entityKey)) {
    queryClient.setQueryData(entityKey, entity);
  }
  queryClient.setQueryData(listKey, [...cachedList, entity]);
}

/** Update an entity in a cached array of entities. */
export function updateEntityInList(queryClient: QueryClient, key: QueryKey, updatedEntity: any) {
  // @ts-ignore
  const cachedList: any[] = [...(queryClient.getQueryData(key) || [])];
  const entityIndex = cachedList.findIndex((entityInList: any) => entityInList.id === updatedEntity.id);

  // Only update the entity in the list if it already exists -- avoids the issue of updating an empty list to have just one entity.
  if (entityIndex !== -1) {
    cachedList.splice(entityIndex, 1, updatedEntity);
    queryClient.setQueryData(key, cachedList);
  }
}

/** Removes an entity from a cached array of entities. */
export function removeEntityInList(queryClient: QueryClient, key: QueryKey, entityId: any) {
  // @ts-ignore
  const cachedList: any[] = [...(queryClient.getQueryData(key) || [])];
  const entityIndex = cachedList.findIndex((entityInList) => entityInList.id === entityId);

  // Only remove if the entity is in the list.
  if (entityIndex !== -1) {
    cachedList.splice(entityIndex, 1);
    queryClient.setQueryData(key, cachedList);
  }
}

/**
 * Adds an entity to a cached paginated list.
 *
 * @template T - The type of items in the paginated list.
 *
 * @param {QueryClient} queryClient - The instance of QueryClient from react-query used for cache management.
 * @param {QueryKey} key - The key used to identify the query data in the cache.
 * @param {any} entity - The entity to be added to the list.
 *
 * If a list already exists in the cache with the given key, the entity will be appended to the list.
 * If the list does not exist, a new list will be created with this entity only.
 *
 * @returns {void}
 */
export function addPaginatedListEntity<T>(queryClient: QueryClient, key: QueryKey, entity: any): void {
  const cachedData: PaginatedResponse<T>['data'] | undefined = queryClient.getQueryData(key);
  console.log('cachedData', cachedData);

  const cachedList = cachedData?.data || [];

  queryClient.setQueryData(key, {
    ...cachedData,
    data: [...cachedList, entity],
  });
}

/**
 * Removes an entity from a cached paginated list.
 *
 * @template T - The type of items in the paginated list.
 *
 * @param {QueryClient} queryClient - The instance of QueryClient from react-query used for cache management.
 * @param {QueryKey} key - The key used to identify the query data in the cache.
 * @param {any} entityId - The id of the entity to be removed from the list.
 *
 * If a list exists in the cache with the given key and contains the specified entity,
 * this entity will be removed from the list.
 *
 * @returns {void}
 */
export function removeEntityInPaginatedList<T>(queryClient: QueryClient, key: QueryKey, entityId: any): void {
  const cachedData: PaginatedResponse<T> | undefined = queryClient.getQueryData(key);
  // Create a new list each time to update the cachedDate reference. QueryClient seems to cache the link.
  const cachedList = cachedData?.data ? [...cachedData.data] : [];

  const entityIndex = cachedList.findIndex((entityInList: any) => entityInList.id === entityId);

  // Only remove if the entity is in the list.
  if (entityIndex !== -1 && entityIndex !== undefined) {
    cachedList.splice(entityIndex, 1);
    queryClient.setQueryData(key, {
      ...cachedData,
      data: cachedList,
    });
  }
}

/**
 * Update an entity in a cached paginated list.
 *
 * @template T - The type of items in the paginated list.
 *
 * @param {QueryClient} queryClient - The instance of QueryClient from react-query used for cache management.
 * @param {QueryKey} key - The key used to identify the query data in the cache.
 * @param updatedEntity
 * @returns {void}
 */
export function updateEntityInPaginatedList<T>(queryClient: QueryClient, key: QueryKey, updatedEntity: any): void {
  const cachedData: PaginatedResponse<T> | undefined = queryClient.getQueryData(key);
  // Create a new list each time to update the cachedDate reference. QueryClient seems to cache the link.
  const cachedList = cachedData?.data ? [...cachedData.data] : [];

  const entityIndex = cachedList.findIndex((entityInList: any) => entityInList.id === updatedEntity.id);

  // Only update the entity in the list if it already exists -- avoids the issue of updating an empty list to have just one entity.
  if (entityIndex !== -1 && entityIndex !== undefined) {
    cachedList.splice(entityIndex, 1, updatedEntity);
    queryClient.setQueryData(key, {
      ...cachedData,
      data: cachedList,
    });
  }
}

/**
 * Adds an entity to a cached lazy loaded paginated list.
 *
 * @template T - The type of items in the lazy loaded paginated list.
 *
 * @param {QueryClient} queryClient - The instance of QueryClient from react-query used for cache management.
 * @param {QueryKey} key - The key used to identify the query data in the cache.
 * @param {any} entity - The entity to be added to the list.
 *
 * If a list already exists in the cache with the given key, the entity will be appended to the list.
 * If the list does not exist, a new list will be created with this entity only.
 *
 * @returns {void}
 */
export function addLazyPaginatedListEntity<T>(queryClient: QueryClient, key: QueryKey, entity: any): void {
  const cachedData: InfiniteData<PaginatedResponse<T>['data']> | undefined = queryClient.getQueryData(key);

  // If there are pages
  if (cachedData) {
    if (cachedData.pages[cachedData.pages.length - 1].data) {
      cachedData.pages[cachedData.pages.length - 1].data.push(entity);
    } else {
      cachedData.pages[cachedData.pages.length - 1].data = [entity];
    }

    queryClient.setQueryData(key, {
      ...cachedData,
      pages: cachedData?.pages,
    });
  }
}

/**
 * Prepends an entity to a cached lazy loaded paginated list.
 *
 * @template T - The type of items in the lazy loaded paginated list.
 *
 * @param {QueryClient} queryClient - The instance of QueryClient from react-query used for cache management.
 * @param {QueryKey} key - The key used to identify the query data in the cache.
 * @param {any} entity - The entity to be added to the list.
 *
 * If a list already exists in the cache with the given key, the entity will be appended to the list.
 * If the list does not exist, a new list will be created with this entity only.
 *
 * @returns {void}
 */
export function prependLazyPaginatedListEntity<T>(queryClient: QueryClient, key: QueryKey, entity: any): void {
  const cachedData: InfiniteData<PaginatedResponse<T>['data']> | undefined = queryClient.getQueryData(key);

  console.log('prepend => cachedData', cachedData);
  // If there are pages
  if (cachedData) {
    const pages = cachedData.pages[cachedData.pages.length - 1] ? [...cachedData.pages] : [];
    if (pages[pages.length - 1].data) {
      pages[pages.length - 1].data = [entity].concat(cachedData.pages[cachedData.pages.length - 1].data);
    } else {
      pages[pages.length - 1].data = [entity];
    }
    console.log('pages', pages);

    // queryClient.setQueryData(key, {
    queryClient.setQueryData(key, {
      pageParams: cachedData.pageParams,
      pages,
    });
  }
}

/**
 * Update an entity in a cached and lazy loaded paginated list.
 *
 * @template T - The type of items in the lazy paginated list.
 *
 * @param {QueryClient} queryClient - The instance of QueryClient from react-query used for cache management.
 * @param {QueryKey} key - The key used to identify the query data in the cache.
 * @param updatedEntity
 * @returns {void}
 */
export function updateEntityInLazyPaginatedList<T>(queryClient: QueryClient, key: QueryKey, updatedEntity: any): void {
  const cachedData: InfiniteData<PaginatedResponse<T>> | undefined = queryClient.getQueryData(key);

  // Go through the pages and find the one that contains the updated entry.
  const updatedData = cachedData?.pages?.map((page) => {
    const cachedPage = { ...page };

    // Find entry index in page data
    const entityIndex = cachedPage.data.findIndex(
      (entityInList: any) => String(entityInList.id) === String(updatedEntity.id)
    );

    // Update cached page data
    if (entityIndex !== -1 && entityIndex !== undefined) {
      // Create the final merged version of the updated entry.
      const result = { ...cachedPage.data[entityIndex], ...updatedEntity };

      return {
        ...cachedPage,
        data: cachedPage.data.map((item: any) => (String(item.id) === String(result.id) ? result : item)),
      };
    }

    return cachedPage;
  });

  // Update pages with updated entry
  queryClient.setQueryData(key, {
    ...cachedData,
    pages: updatedData,
  });
}

/**
 * Removes an entity from a cached and lazy loaded paginated list.
 *
 * @template T - The type of items in the lazy paginated list.
 *
 * @param {QueryClient} queryClient - The instance of QueryClient from react-query used for cache management.
 * @param {QueryKey} key - The key used to identify the query data in the cache.
 * @param {any} entityId - The id of the entity to be removed from the list.
 *
 * If a list exists in the cache with the given key and contains the specified entity,
 * this entity will be removed from the list.
 *
 * @returns {void}
 */
export function removeEntityInLazyPaginatedList<T>(queryClient: QueryClient, key: QueryKey, entityId: any): void {
  const cachedData: InfiniteData<PaginatedResponse<T>> | undefined = queryClient.getQueryData(key);

  // Go through the pages and find the one that contains the entry.
  const updatedData = cachedData?.pages?.map((page) => {
    const cachedPage = { ...page };

    // Find the entry in the current page
    const foundItem = cachedPage.data.findIndex((item: any) => Number(item.id) === Number(entityId));

    // Only remove if the entry is in the list.
    if (foundItem !== -1) {
      // Remove an entry from a list using filtering
      const updatedList = cachedPage.data.filter((item: any) => Number(item.id) !== Number(entityId));

      return {
        ...cachedPage,
        data: updatedList,
      };
    }

    return cachedPage;
  });

  // Update pages with deleted entry
  queryClient.setQueryData(key, {
    ...cachedData,
    pages: updatedData,
  });
}
