// Example usage of Firebase utility service
import { firebaseService, COLLECTIONS } from '../services/firebase';
import { Location, Review, Favorite } from '../types';

// ==================== AUTHENTICATION EXAMPLES ====================

// Sign in user
export const signInExample = async () => {
  const result = await firebaseService.signIn({
    email: 'user@example.com',
    password: 'password123'
  });

  if (result.success) {
    console.log('User signed in:', result.data.user);
    console.log('Token:', result.data.token);
  } else {
    console.error('Sign in failed:', result.error);
  }
};

// Register new user
export const signUpExample = async () => {
  const result = await firebaseService.signUp({
    email: 'newuser@example.com',
    password: 'password123',
    name: 'John Doe',
    phone: '+1234567890'
  });

  if (result.success) {
    console.log('User registered:', result.data.user);
  } else {
    console.error('Registration failed:', result.error);
  }
};

// Sign out user
export const signOutExample = async () => {
  const result = await firebaseService.signOut();
  
  if (result.success) {
    console.log('User signed out successfully');
  } else {
    console.error('Sign out failed:', result.error);
  }
};

// Reset password
export const resetPasswordExample = async () => {
  const result = await firebaseService.resetPassword('user@example.com');
  
  if (result.success) {
    console.log('Password reset email sent');
  } else {
    console.error('Password reset failed:', result.error);
  }
};

// ==================== FIRESTORE EXAMPLES ====================

// Add a new location
export const addLocationExample = async () => {
  const locationData: Omit<Location, 'id'> = {
    name: 'Coffee Shop Downtown',
    address: '123 Main St, City, State',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    category: 'restaurant',
    rating: 4.5,
    reviewCount: 0,
    photos: [],
    description: 'A cozy coffee shop in downtown',
    amenities: ['wifi', 'outdoor seating', 'pet friendly'],
    priceRange: 2,
    createdBy: 'user123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    const docRef = await firebaseService.addDocument(COLLECTIONS.LOCATIONS, locationData);
    console.log('Location added with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding location:', error);
  }
};

// Get a location by ID
export const getLocationExample = async (locationId: string) => {
  try {
    const doc = await firebaseService.getDocument(COLLECTIONS.LOCATIONS, locationId);
    
    if (doc.exists) {
      const location = { id: doc.id, ...doc.data() } as Location;
      console.log('Location found:', location);
      return location;
    } else {
      console.log('Location not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

// Get all locations with limit
export const getLocationsExample = async () => {
  try {
    const snapshot = await firebaseService.getCollection(COLLECTIONS.LOCATIONS, 10);
    const locations: Location[] = [];
    
    snapshot.forEach(doc => {
      locations.push({ id: doc.id, ...doc.data() } as Location);
    });
    
    console.log('Locations found:', locations);
    return locations;
  } catch (error) {
    console.error('Error getting locations:', error);
    return [];
  }
};

// Query locations by category
export const queryLocationsByCategoryExample = async (category: string) => {
  try {
    const snapshot = await firebaseService.queryCollection(
      COLLECTIONS.LOCATIONS,
      'category',
      '==',
      category,
      20
    );
    
    const locations: Location[] = [];
    snapshot.forEach(doc => {
      locations.push({ id: doc.id, ...doc.data() } as Location);
    });
    
    console.log(`Locations in category "${category}":`, locations);
    return locations;
  } catch (error) {
    console.error('Error querying locations:', error);
    return [];
  }
};

// Update a location
export const updateLocationExample = async (locationId: string) => {
  try {
    await firebaseService.updateDocument(COLLECTIONS.LOCATIONS, locationId, {
      rating: 4.8,
      reviewCount: 150,
      description: 'Updated description'
    });
    
    console.log('Location updated successfully');
  } catch (error) {
    console.error('Error updating location:', error);
  }
};

// Add a review
export const addReviewExample = async (locationId: string) => {
  const reviewData: Omit<Review, 'id'> = {
    locationId,
    userId: 'user123',
    userName: 'John Doe',
    userAvatar: 'https://example.com/avatar.jpg',
    rating: 5,
    comment: 'Great coffee and atmosphere!',
    photos: ['https://example.com/photo1.jpg'],
    helpful: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    const docRef = await firebaseService.addDocument(COLLECTIONS.REVIEWS, reviewData);
    console.log('Review added with ID:', docRef.id);
    
    // Update location review count
    const locationDoc = await firebaseService.getDocument(COLLECTIONS.LOCATIONS, locationId);
    if (locationDoc.exists) {
      const currentCount = locationDoc.data()?.reviewCount || 0;
      await firebaseService.updateDocument(COLLECTIONS.LOCATIONS, locationId, {
        reviewCount: currentCount + 1
      });
    }
  } catch (error) {
    console.error('Error adding review:', error);
  }
};

// Add to favorites
export const addToFavoritesExample = async (locationId: string, userId: string) => {
  try {
    // First get the location data
    const locationDoc = await firebaseService.getDocument(COLLECTIONS.LOCATIONS, locationId);
    
    if (!locationDoc.exists) {
      console.error('Location not found');
      return;
    }

    const location = { id: locationDoc.id, ...locationDoc.data() } as Location;
    
    const favoriteData: Omit<Favorite, 'id'> = {
      userId,
      locationId,
      location,
      createdAt: new Date().toISOString()
    };

    const docRef = await firebaseService.addDocument(COLLECTIONS.FAVORITES, favoriteData);
    console.log('Added to favorites with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

// ==================== REAL-TIME LISTENERS ====================

// Listen to location changes
export const listenToLocationExample = (locationId: string) => {
  const unsubscribe = firebaseService.subscribeToDocument(
    COLLECTIONS.LOCATIONS,
    locationId,
    (doc) => {
      if (doc.exists) {
        const location = { id: doc.id, ...doc.data() } as Location;
        console.log('Location updated:', location);
      } else {
        console.log('Location deleted');
      }
    }
  );

  // Return unsubscribe function
  return unsubscribe;
};

// Listen to user's favorites
export const listenToFavoritesExample = (userId: string) => {
  const unsubscribe = firebaseService.subscribeToQuery(
    COLLECTIONS.FAVORITES,
    'userId',
    '==',
    userId,
    (snapshot) => {
      const favorites: Favorite[] = [];
      snapshot.forEach(doc => {
        favorites.push({ id: doc.id, ...doc.data() } as Favorite);
      });
      console.log('Favorites updated:', favorites);
    }
  );

  return unsubscribe;
};

// ==================== BATCH OPERATIONS ====================

// Batch update multiple locations
export const batchUpdateLocationsExample = async (locationIds: string[]) => {
  try {
    const operations = locationIds.map(locationId => ({
      type: 'update' as const,
      collection: COLLECTIONS.LOCATIONS,
      docId: locationId,
      data: {
        updatedAt: new Date().toISOString(),
        lastBatchUpdate: true
      }
    }));

    await firebaseService.batchWrite(operations);
    console.log('Batch update completed');
  } catch (error) {
    console.error('Error in batch update:', error);
  }
};

// ==================== TRANSACTION EXAMPLE ====================

// Transfer ownership of a location
export const transferLocationOwnershipExample = async (
  locationId: string, 
  newOwnerId: string
) => {
  try {
    await firebaseService.runTransaction(async (transaction) => {
      const locationRef = firebaseService.createDocumentReference(
        COLLECTIONS.LOCATIONS, 
        locationId
      );
      
      const locationDoc = await transaction.get(locationRef);
      
      if (!locationDoc.exists) {
        throw new Error('Location not found');
      }

      transaction.update(locationRef, {
        createdBy: newOwnerId,
        updatedAt: new Date().toISOString()
      });

      return { success: true };
    });

    console.log('Location ownership transferred');
  } catch (error) {
    console.error('Error transferring ownership:', error);
  }
};

// ==================== ERROR HANDLING ====================

// Example with proper error handling
export const robustFirebaseOperationExample = async () => {
  try {
    // Check if user is authenticated
    if (!firebaseService.isAuthenticated()) {
      console.log('User not authenticated');
      return;
    }

    // Get current user token
    const token = await firebaseService.getCurrentUserToken();
    if (!token) {
      console.log('No valid token available');
      return;
    }

    // Perform operation
    const result = await firebaseService.getCollection(COLLECTIONS.LOCATIONS, 5);
    console.log('Operation successful:', result.docs.length, 'documents');

  } catch (error) {
    const errorMessage = firebaseService.handleError(error);
    console.error('Operation failed:', errorMessage);
  }
};

// ==================== UTILITY FUNCTIONS ====================

// Get server timestamp
export const getServerTimestampExample = () => {
  const timestamp = firebaseService.getServerTimestamp();
  console.log('Server timestamp:', timestamp);
  return timestamp;
};

// Enable/disable network
export const networkControlExample = async () => {
  try {
    // Disable network (offline mode)
    await firebaseService.disableNetwork();
    console.log('Network disabled - offline mode');

    // Enable network
    await firebaseService.enableNetwork();
    console.log('Network enabled - online mode');
  } catch (error) {
    console.error('Network control error:', error);
  }
};

// Clear persistence
export const clearPersistenceExample = async () => {
  try {
    await firebaseService.clearPersistence();
    console.log('Persistence cleared');
  } catch (error) {
    console.error('Error clearing persistence:', error);
  }
};
