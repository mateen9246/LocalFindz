// Redux state types
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UserState {
  profile: User | null;
  preferences: UserPreferences;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  isFirstLaunch: boolean;
  networkStatus: 'online' | 'offline';
  loading: boolean;
  error: string | null;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    locationSharing: boolean;
  };
  app: {
    autoSync: boolean;
    cacheSize: number;
  };
}

// API types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  Login: undefined;
  Register: undefined;
};

// Component props types
export interface BaseComponentProps {
  children?: React.ReactNode;
  style?: any;
  testID?: string;
}

// Firebase types
export interface FirebaseUser extends User {
  uid: string;
  emailVerified: boolean;
  phoneNumber?: string;
  photoURL?: string;
  displayName?: string;
}

export interface FirebaseAuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
}

export interface FirestoreDocument {
  id: string;
  [key: string]: any;
}

export interface FirestoreQuery {
  field: string;
  operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'not-in' | 'array-contains' | 'array-contains-any';
  value: any;
}

export interface FirestoreOrderBy {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FirestoreLimit {
  limit: number;
  startAfter?: any;
}

export interface BatchOperation {
  type: 'set' | 'update' | 'delete';
  collection: string;
  docId: string;
  data?: any;
}

// Location types (for LocalFindz app)
export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  category: string;
  rating: number;
  reviewCount: number;
  photos: string[];
  description?: string;
  hours?: {
    [key: string]: {
      open: string;
      close: string;
      closed?: boolean;
    };
  };
  contact?: {
    phone?: string;
    website?: string;
    email?: string;
  };
  amenities: string[];
  priceRange?: 1 | 2 | 3 | 4;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Review {
  id: string;
  locationId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  photos?: string[];
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  locationId: string;
  location: Location;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'review' | 'favorite' | 'location_update' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}
