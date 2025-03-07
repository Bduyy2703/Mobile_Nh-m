import { setAccessToken } from "~/infrastructure/redux/slices/auth/auth.slice";
import {
  loginPayloadType,
  loginResponseType,
  registerPayloadType,
  registerResponseType,
  sendOtpPayloadType,
  sendOtpResponseType,
} from "~/infrastructure/types/auth.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "auth-api",
  tagTypes: ["auth"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.50.83:3000/api/auth/",
  }),
  endpoints: (builder) => ({
    // Đăng nhập
    loginAsync: builder.mutation<loginResponseType, loginPayloadType>({
      query: (payload) => ({
        url: "login",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken(data.accessToken));
        } catch (error) {
          console.error(error);
        }
      },
    }),

    // Đăng ký
    registerAsync: builder.mutation<registerResponseType, registerPayloadType>({
      query: (payload) => ({
        url: "register",
        method: "POST",
        body: payload,
      }),
    }),

    // Gửi OTP
    sendOtpAsync: builder.mutation<sendOtpResponseType, sendOtpPayloadType>({
      query: (payload) => ({
        url: "send-otp",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLoginAsyncMutation,
  useRegisterAsyncMutation,
  useSendOtpAsyncMutation,
} = authApi;
