// App Constants
export const APP_NAME = 'LocalFindz';
export const APP_VERSION = '1.0.0';

// API Constants
export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.localfindz.com';
export const API_TIMEOUT = 10000;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  APP_SETTINGS: 'app_settings',
} as const;

// Theme Constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Language Constants
export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
} as const;

// Network Constants
export const NETWORK_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error',
  AUTH_ERROR: 'Authentication failed',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Server error',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  PREFERENCES_SAVED: 'Preferences saved successfully',
} as const;

export const COLORS = {
  primary: '#9900CC',
  secondary: '#5E007D',
  white: '#ffffff',
  black: '#000000',
  textInput: '#8391A1',
  textInputBorder: '#E8ECF4',
  textInputBg: '#F7F8F9',
  textColorPr: '#1E232C',
  disabled: '#D2D6DB',
  danger: '#FF3B30',
  gray: '#C9C9C9',
  darkGray: '#6A707C',
  textSecondary: 'pink',
};

// Firebase Constants
export const FIREBASE_CONFIG = {
  // Collection names
  COLLECTIONS: {
    USERS: 'users',
    USER_PREFERENCES: 'userPreferences',
    APP_SETTINGS: 'appSettings',
    NOTIFICATIONS: 'notifications',
    LOCATIONS: 'locations',
    REVIEWS: 'reviews',
    FAVORITES: 'favorites',
    CATEGORIES: 'categories',
    SEARCH_HISTORY: 'searchHistory',
  },

  // Document field names
  FIELDS: {
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
    USER_ID: 'userId',
    LOCATION_ID: 'locationId',
    EMAIL: 'email',
    NAME: 'name',
    RATING: 'rating',
    CATEGORY: 'category',
    COORDINATES: 'coordinates',
    ADDRESS: 'address',
    PHONE: 'phone',
    WEBSITE: 'website',
    HOURS: 'hours',
    AMENITIES: 'amenities',
    PHOTOS: 'photos',
    DESCRIPTION: 'description',
    PRICE_RANGE: 'priceRange',
    REVIEW_COUNT: 'reviewCount',
    HELPFUL: 'helpful',
    READ: 'read',
    TYPE: 'type',
    TITLE: 'title',
    MESSAGE: 'message',
    DATA: 'data',
  },

  // Query operators
  OPERATORS: {
    EQUAL: '==',
    NOT_EQUAL: '!=',
    LESS_THAN: '<',
    LESS_THAN_OR_EQUAL: '<=',
    GREATER_THAN: '>',
    GREATER_THAN_OR_EQUAL: '>=',
    IN: 'in',
    NOT_IN: 'not-in',
    ARRAY_CONTAINS: 'array-contains',
    ARRAY_CONTAINS_ANY: 'array-contains-any',
  },

  // Order directions
  ORDER_DIRECTIONS: {
    ASCENDING: 'asc',
    DESCENDING: 'desc',
  },

  // Default limits
  LIMITS: {
    DEFAULT: 20,
    SMALL: 10,
    MEDIUM: 50,
    LARGE: 100,
    MAX: 1000,
  },

  // Cache settings
  CACHE: {
    ENABLE_PERSISTENCE: true,
    CACHE_SIZE_BYTES: 104857600, // 100MB
  },

  // Offline settings
  OFFLINE: {
    ENABLE_NETWORK: true,
    ENABLE_PERSISTENCE: true,
  },
} as const;

// Firebase Error Messages
export const FIREBASE_ERROR_MESSAGES = {
  // Auth errors
  AUTH_USER_NOT_FOUND: 'No user found with this email address',
  AUTH_WRONG_PASSWORD: 'Incorrect password',
  AUTH_EMAIL_ALREADY_IN_USE: 'An account with this email already exists',
  AUTH_WEAK_PASSWORD: 'Password is too weak. Please choose a stronger password',
  AUTH_INVALID_EMAIL: 'Invalid email address',
  AUTH_USER_DISABLED: 'This account has been disabled',
  AUTH_TOO_MANY_REQUESTS: 'Too many failed attempts. Please try again later',
  AUTH_NETWORK_REQUEST_FAILED: 'Network error. Please check your connection',
  AUTH_OPERATION_NOT_ALLOWED: 'This operation is not allowed',
  AUTH_REQUIRES_RECENT_LOGIN: 'This operation requires recent authentication',

  // Firestore errors
  FIRESTORE_PERMISSION_DENIED:
    'Permission denied. You do not have access to this data',
  FIRESTORE_NOT_FOUND: 'Requested data not found',
  FIRESTORE_ALREADY_EXISTS: 'Data already exists',
  FIRESTORE_UNAVAILABLE:
    'Service temporarily unavailable. Please try again later',
  FIRESTORE_DEADLINE_EXCEEDED: 'Request timeout. Please try again',
  FIRESTORE_RESOURCE_EXHAUSTED: 'Quota exceeded. Please try again later',
  FIRESTORE_FAILED_PRECONDITION: 'Operation failed due to a precondition',
  FIRESTORE_ABORTED: 'Operation was aborted',
  FIRESTORE_OUT_OF_RANGE: 'Operation was attempted past the valid range',
  FIRESTORE_UNIMPLEMENTED: 'Operation is not implemented',
  FIRESTORE_INTERNAL: 'Internal error occurred',
  FIRESTORE_DATA_LOSS: 'Unrecoverable data loss or corruption',

  // General errors
  NETWORK_ERROR: 'Network connection error',
  TIMEOUT_ERROR: 'Request timeout',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;

// Firebase Success Messages
export const FIREBASE_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'Registration successful',
  PASSWORD_RESET_SENT: 'Password reset email sent',
  PASSWORD_UPDATED: 'Password updated successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  ACCOUNT_DELETED: 'Account deleted successfully',
  DATA_SAVED: 'Data saved successfully',
  DATA_UPDATED: 'Data updated successfully',
  DATA_DELETED: 'Data deleted successfully',
} as const;
