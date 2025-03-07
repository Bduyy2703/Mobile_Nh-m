import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  combineReducers,
  configureStore,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  PersistConfig,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import authSlice from "~/infrastructure/redux/slices/auth/auth.slice";
import { authApi } from "~/infrastructure/redux/apis/auth.api";
import { postsApi } from "~/infrastructure/redux/apis/post.api";

const persistConfig: PersistConfig<ReturnType<typeof reducers>> = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  blacklist: ["auth", authApi.reducerPath, postsApi.reducerPath],
  whitelist: [],
};

/**
 * This function is used to get enhancers for debugging (not setup yet, but can be used in future so ignoring for now)
 */
const getEnhancers = (getDefaultEnhancers: any) => {
  return getDefaultEnhancers();
};

/**
 * On api error this will be called
 */
export const rtkQueryLoggerMiddleware =
  (api: any) => (next: any) => (action: any) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      console.log("isRejectedWithValue", action.error, action.payload);
      alert(JSON.stringify(action)); // This is just an example. You can replace it with your preferred method for displaying notifications.
    }

    return next(action);
  };

const reducers = combineReducers({
  auth: authSlice,
  [authApi.reducerPath]: authApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const reduxStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      // Add middleware without including them in the blacklist
      authApi.middleware,
      postsApi.middleware,
      rtkQueryLoggerMiddleware
    ),
  enhancers: getEnhancers,
});

// A utility used to enable refetchOnMount and refetchOnReconnect behavior
setupListeners(reduxStore.dispatch);

export default reduxStore;
