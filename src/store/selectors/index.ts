import { RootState } from '../index';

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// User selectors
export const selectUser = (state: RootState) => state.user;
export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectUserPreferences = (state: RootState) => state.user.preferences;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

// App selectors
export const selectApp = (state: RootState) => state.app;
export const selectTheme = (state: RootState) => state.app.theme;
export const selectLanguage = (state: RootState) => state.app.language;
export const selectIsFirstLaunch = (state: RootState) => state.app.isFirstLaunch;
export const selectNetworkStatus = (state: RootState) => state.app.networkStatus;
export const selectAppLoading = (state: RootState) => state.app.loading;
export const selectAppError = (state: RootState) => state.app.error;

// Combined selectors
export const selectCurrentUser = (state: RootState) => {
  return state.auth.user || state.user.profile;
};

export const selectIsLoading = (state: RootState) => {
  return state.auth.loading || state.user.loading || state.app.loading;
};

export const selectHasError = (state: RootState) => {
  return !!(state.auth.error || state.user.error || state.app.error);
};

export const selectErrorMessages = (state: RootState) => {
  const errors = [];
  if (state.auth.error) errors.push(state.auth.error);
  if (state.user.error) errors.push(state.user.error);
  if (state.app.error) errors.push(state.app.error);
  return errors;
};
