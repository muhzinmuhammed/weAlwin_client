import { api } from "../api";

const userAuth = api.injectEndpoints({
    endpoints: (builder) => ({
        Register: builder.mutation({
            query: (values) => ({
                url: '/v1/auth/register',
                method: 'POST',
                body: values,
            }),
        }),
        Login: builder.mutation({
            query: (values) => ({
                url: '/v1/auth/login',
                method: 'POST',
                body: values,
            }),
        }),

        allUsers: builder.query({
            query: () => ({
                url: '/v1/auth/all_user',  // Assuming this endpoint returns the list of users
                method: 'GET',
            }),
        }),

        dashBoard: builder.query({
            query: ({ page = 1, search = "" }) => ({
                url: `/v1/auth/dashboard?page=${page}&search=${search}`,  // Pass page and search as query parameters
                method: 'GET',
            }),
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useAllUsersQuery, useDashBoardQuery } = userAuth;
