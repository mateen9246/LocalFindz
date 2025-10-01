# Firebase/Firestore Utility Service

A comprehensive utility service for handling all Firebase and Firestore operations in the LocalFindz app.

## Features

- **Authentication**: Sign in, sign up, sign out, password reset, account management
- **Firestore Operations**: CRUD operations, queries, real-time listeners
- **Batch Operations**: Multiple operations in a single batch
- **Transactions**: Atomic operations with rollback support
- **Error Handling**: User-friendly error messages
- **TypeScript Support**: Full type safety
- **Offline Support**: Network control and persistence management

## Installation

The Firebase utility is already set up in your project. Make sure you have the following dependencies installed:

```bash
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
```

## Basic Usage

### Import the service

```typescript
import { firebaseService, COLLECTIONS } from '../services/firebase';
```

### Authentication

```typescript
// Sign in
const result = await firebaseService.signIn({
  email: 'user@example.com',
  password: 'password123'
});

// Sign up
const result = await firebaseService.signUp({
  email: 'newuser@example.com',
  password: 'password123',
  name: 'John Doe'
});

// Sign out
await firebaseService.signOut();

// Reset password
await firebaseService.resetPassword('user@example.com');
```

### Firestore Operations

```typescript
// Add document
const docRef = await firebaseService.addDocument('locations', {
  name: 'Coffee Shop',
  address: '123 Main St'
});

// Get document
const doc = await firebaseService.getDocument('locations', 'docId');

// Update document
await firebaseService.updateDocument('locations', 'docId', {
  rating: 4.5
});

// Delete document
await firebaseService.deleteDocument('locations', 'docId');

// Query collection
const snapshot = await firebaseService.queryCollection(
  'locations',
  'category',
  '==',
  'restaurant'
);
```

### Real-time Listeners

```typescript
// Listen to document changes
const unsubscribe = firebaseService.subscribeToDocument(
  'locations',
  'docId',
  (doc) => {
    if (doc.exists) {
      console.log('Document updated:', doc.data());
    }
  }
);

// Listen to collection changes
const unsubscribe = firebaseService.subscribeToCollection(
  'locations',
  (snapshot) => {
    snapshot.forEach(doc => {
      console.log('Document:', doc.data());
    });
  }
);

// Don't forget to unsubscribe
unsubscribe();
```

### Batch Operations

```typescript
const operations = [
  {
    type: 'set',
    collection: 'locations',
    docId: 'doc1',
    data: { name: 'Location 1' }
  },
  {
    type: 'update',
    collection: 'locations',
    docId: 'doc2',
    data: { rating: 4.5 }
  },
  {
    type: 'delete',
    collection: 'locations',
    docId: 'doc3'
  }
];

await firebaseService.batchWrite(operations);
```

### Transactions

```typescript
await firebaseService.runTransaction(async (transaction) => {
  const docRef = firebaseService.createDocumentReference('locations', 'docId');
  const doc = await transaction.get(docRef);
  
  if (doc.exists) {
    transaction.update(docRef, {
      reviewCount: (doc.data()?.reviewCount || 0) + 1
    });
  }
});
```

## Available Collections

The service includes predefined collection names:

```typescript
COLLECTIONS = {
  USERS: 'users',
  USER_PREFERENCES: 'userPreferences',
  APP_SETTINGS: 'appSettings',
  NOTIFICATIONS: 'notifications',
  LOCATIONS: 'locations',
  REVIEWS: 'reviews',
  FAVORITES: 'favorites',
  CATEGORIES: 'categories',
  SEARCH_HISTORY: 'searchHistory'
}
```

## Error Handling

The service provides user-friendly error messages:

```typescript
try {
  const result = await firebaseService.signIn(credentials);
  if (!result.success) {
    console.error('Sign in failed:', result.error);
  }
} catch (error) {
  const errorMessage = firebaseService.handleError(error);
  console.error('Error:', errorMessage);
}
```

## Redux Integration

The auth slice has been updated to use Firebase:

```typescript
import { useAppDispatch, useAppSelector } from '../hooks';
import { loginUser, registerUser, logoutUser } from '../store/slices/authSlice';

// In your component
const dispatch = useAppDispatch();
const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);

// Login
const handleLogin = () => {
  dispatch(loginUser({ email, password }));
};

// Register
const handleRegister = () => {
  dispatch(registerUser({ email, password, name }));
};

// Logout
const handleLogout = () => {
  dispatch(logoutUser());
};
```

## Network Control

```typescript
// Enable network
await firebaseService.enableNetwork();

// Disable network (offline mode)
await firebaseService.disableNetwork();

// Clear persistence
await firebaseService.clearPersistence();
```

## TypeScript Support

The service is fully typed with TypeScript interfaces:

```typescript
import { User, Location, Review, Favorite } from '../types';

// All operations are type-safe
const user: User = result.data.user;
const location: Location = doc.data() as Location;
```

## Best Practices

1. **Always handle errors**: Use try-catch blocks and check result.success
2. **Unsubscribe listeners**: Always call the unsubscribe function
3. **Use transactions**: For operations that need to be atomic
4. **Batch operations**: For multiple related operations
5. **Check authentication**: Verify user is authenticated before operations
6. **Handle offline mode**: Use network control methods appropriately

## Examples

See `src/examples/firebaseUsage.ts` for comprehensive usage examples including:

- Authentication flows
- CRUD operations
- Real-time listeners
- Batch operations
- Transactions
- Error handling
- Network control

## Configuration

The service uses the Firebase configuration from your `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) files.

Make sure these files are properly configured in your project:

- Android: `android/app/google-services.json`
- iOS: `ios/LocalFindz/GoogleService-Info.plist`

## Security Rules

Make sure your Firestore security rules are properly configured to match your app's requirements. The service assumes standard read/write permissions for authenticated users.

## Performance Tips

1. Use pagination with `limit` parameter
2. Use indexes for complex queries
3. Cache frequently accessed data
4. Use batch operations for multiple writes
5. Implement proper error handling and retry logic

## Troubleshooting

### Common Issues

1. **Permission denied**: Check Firestore security rules
2. **Network errors**: Check internet connection and Firebase configuration
3. **Type errors**: Ensure proper TypeScript types are imported
4. **Listener not working**: Check if unsubscribe is called too early

### Debug Mode

Enable debug logging by setting:

```typescript
// In your app initialization
if (__DEV__) {
  firebaseService.enableNetwork(); // Enable network for debugging
}
```

## Support

For issues and questions:

1. Check the Firebase documentation
2. Review the example usage file
3. Check the TypeScript types for proper usage
4. Ensure Firebase configuration is correct
