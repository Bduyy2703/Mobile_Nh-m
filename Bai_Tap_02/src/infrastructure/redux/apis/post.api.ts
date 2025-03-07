import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tags } from "react-native-svg/lib/typescript/xmlTags";

// Define the postsApi slice with RTK Query
export const postsApi = createApi({
  // Unique key for the API slice in Redux state
  reducerPath: "posts-api",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),

  // Define cache tag types for automatic cache invalidation
  tagTypes: ["Posts"],

  // Define API endpoints (queries and mutations)
  endpoints: (builder) => ({
    // Query to fetch a paginated list of posts
    getPostsAsync: builder.query({
      query: () => "/posts",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Posts", id })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),

    getPostsPaginationAsync: builder.query({
      query: ({ page = 1, limit = 5 }) =>
        `/posts?_page=${page}&_limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: "Posts",
                id,
              })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),

    getPostByIdAsync: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),
  }),
});

// Export generated hooks for each endpoint to use them in components
export const {
  useGetPostsAsyncQuery, // Use this when you want data to be fetched automatically as the component mounts or when the query parameters change.
  useLazyGetPostsAsyncQuery, // Use this when you need more control over when the query runs, such as in response to a user action (e.g., clicking a button), conditional fetching, or specific events.
  useGetPostsPaginationAsyncQuery,
  useGetPostByIdAsyncQuery,
} = postsApi;
