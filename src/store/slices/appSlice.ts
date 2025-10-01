import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../../types';

// Initial state
const initialState: AppState = {
  theme: 'system',
  language: 'en',
  isFirstLaunch: true,
  networkStatus: 'online',
  loading: false,
  error: null,
};

// App slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setFirstLaunch: (state, action: PayloadAction<boolean>) => {
      state.isFirstLaunch = action.payload;
    },
    setNetworkStatus: (state, action: PayloadAction<'online' | 'offline'>) => {
      state.networkStatus = action.payload;
    },
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAppError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAppError: (state) => {
      state.error = null;
    },
    resetAppState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setTheme,
  setLanguage,
  setFirstLaunch,
  setNetworkStatus,
  setAppLoading,
  setAppError,
  clearAppError,
  resetAppState,
} = appSlice.actions;

export default appSlice.reducer;
