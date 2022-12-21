import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// These types is defined in this file to keep the amount of example content
// that leaks into the app code to a minimum; Please define all types in
// specific files in the ../types directory and export them from there
type CatalogItem = {
  id: number;
  name: string;
  description: string;
  created_by: string;
  created_datetime: string;
  category_id: number;
  item_type_id: number;
  tags: string;
  approval_state_id: number;
  approval_state_by: string;
  approval_state_datetime: string;
  auto_approve_all: boolean;
};

type CatalogItemCreateRequest = {
  name: string;
  description?: string;
  created_by: string;
  category_id: number;
  item_type_id: number;
  tags?: string;
  file_url: string;
};

type CatalogItemAPIList = {
  item_count: number;
  items: CatalogItem[];
};

// When we create an API with RTK we get back a slice, some thunks, action creators,
// and a set of automatically generated hooks
const catalogItemsApi = createApi({
  // Name of the automatically-generated reducer
  reducerPath: 'catalogItems',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://aqueduct-business-services.azurewebsites.net'
  }),
  // More on tags throughout this file but for TypeScript we need to define our tags first
  tagTypes: ['CatalogItems'],
  endpoints(builder) {
    const {
      REACT_APP_EXTERNAL_API_EXAMPLE_CLIENT_ID,
      REACT_APP_EXTERNAL_API_EXAMPLE_CODE
    } = process.env;

    return {
      // This key and config will give us a hook we can call like catalogItemsApi.useFetchCatalogItemsQuery()
      // For TypeScript, we must type the builder.query function with <return_type, query_arg>
      // https://redux-toolkit.js.org/rtk-query/usage-with-typescript#typing-query-and-mutation-endpoints
      // In our case, we don't need to take any arguments so we use 'void'
      fetchCatalogItems: builder.query<CatalogItemAPIList, void>({
        // Every query we make to fetchCatalogItems is going to be marked with this tag
        providesTags: ['CatalogItems'],
        query: () => {
          return {
            url: '/api/catalog',
            params: {
              client: `${REACT_APP_EXTERNAL_API_EXAMPLE_CLIENT_ID}`,
              code: `${REACT_APP_EXTERNAL_API_EXAMPLE_CODE}`
            },
            method: 'GET'
          };
        }
      }),
      // This time we're using builder.mutation because we are going to be doing something
      // other than a simple GET
      createCatalogItem: builder.mutation<
        CatalogItemAPIList,
        CatalogItemCreateRequest
      >({
        // Whenever we run this mutation, RTK will go find all of the queries that are marked
        // with this tag, mark them as out of date, and immediate re-run them. This way, after
        // we create a new item our list of items will update itself to include the new one.
        invalidatesTags: ['CatalogItems'],
        query: (catalogItemCreateRequest) => {
          return {
            url: '/api/catalog',
            params: {
              client: `${REACT_APP_EXTERNAL_API_EXAMPLE_CLIENT_ID}`,
              code: `${REACT_APP_EXTERNAL_API_EXAMPLE_CODE}`
            },
            method: 'POST',
            body: {
              name: catalogItemCreateRequest.name,
              created_by: catalogItemCreateRequest.created_by,
              category_id: catalogItemCreateRequest.category_id,
              item_type_id: catalogItemCreateRequest.item_type_id,
              file_url: catalogItemCreateRequest.file_url,
              // This syntax is an example of providing an optional key in the request body
              // only if the call to this createCatalogItem function actually included it
              ...(catalogItemCreateRequest.description && {
                description: catalogItemCreateRequest.description
              }),
              ...(catalogItemCreateRequest.tags && {
                tags: catalogItemCreateRequest.tags
              })
            }
          };
        }
      })
    };
  }
});

// Export all hooks
// !!! Please also export these from ../hooks/useAPIs.ts so we can keep
// !!! the imports in our components cleaner
export const { useFetchCatalogItemsQuery, useCreateCatalogItemMutation } =
  catalogItemsApi;

// Export the API
export default catalogItemsApi;
