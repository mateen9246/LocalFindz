// Firebase/Firestore utility service
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  ApiResponse,
  UserPreferences,
} from '../types';

// Firebase collection names
export const COLLECTIONS = {
  USERS: 'users',
  USER_PREFERENCES: 'userPreferences',
  APP_SETTINGS: 'appSettings',
  NOTIFICATIONS: 'notifications',
  LOCATIONS: 'locations',
  REVIEWS: 'reviews',
  FAVORITES: 'favorites',
} as const;

// Firebase error codes
export const FIREBASE_ERRORS = {
  // Auth errors
  AUTH_USER_NOT_FOUND: 'auth/user-not-found',
  AUTH_WRONG_PASSWORD: 'auth/wrong-password',
  AUTH_EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  AUTH_WEAK_PASSWORD: 'auth/weak-password',
  AUTH_INVALID_EMAIL: 'auth/invalid-email',
  AUTH_USER_DISABLED: 'auth/user-disabled',
  AUTH_TOO_MANY_REQUESTS: 'auth/too-many-requests',
  AUTH_NETWORK_REQUEST_FAILED: 'auth/network-request-failed',

  // Firestore errors
  FIRESTORE_PERMISSION_DENIED: 'permission-denied',
  FIRESTORE_NOT_FOUND: 'not-found',
  FIRESTORE_ALREADY_EXISTS: 'already-exists',
  FIRESTORE_UNAVAILABLE: 'unavailable',
  FIRESTORE_DEADLINE_EXCEEDED: 'deadline-exceeded',
} as const;

// Firebase utility class
class FirebaseService {
  private db = firestore();
  private auth = auth();

  // ==================== AUTH METHODS ====================

  /**
   * Sign in with email and password
   */
  async signIn(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password,
      );

      if (!userCredential.user) {
        throw new Error('Authentication failed');
      }

      // Get user data from Firestore
      const userDoc = await this.getDocument(
        COLLECTIONS.USERS,
        userCredential.user.uid,
      );

      if (!userDoc.exists) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data() as User;
      const token = await userCredential.user.getIdToken();

      return {
        success: true,
        data: { user: userData, token },
        message: 'Login successful',
      };
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        error: this.getAuthErrorMessage(error.code),
      };
    }
  }

  /**
   * Register new user
   */
  async signUp(
    credentials: RegisterCredentials,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // Create auth user
      const userCredential = await this.auth.createUserWithEmailAndPassword(
        credentials.email,
        credentials.password,
      );

      if (!userCredential.user) {
        throw new Error('Registration failed');
      }

      // Create user profile in Firestore
      // const userData: User = {
      //   id: userCredential.user.uid,
      //   email: credentials.email,
      //   name: credentials.name,
      //   phone: credentials.phone,
      //   createdAt: new Date().toISOString(),
      //   updatedAt: new Date().toISOString(),
      // };

      // await this.setDocument(COLLECTIONS.USERS, userCredential.user.uid, userData);

      // // Create default user preferences
      // const defaultPreferences: UserPreferences = {
      //   notifications: {
      //     push: true,
      //     email: true,
      //     sms: false,
      //   },
      //   privacy: {
      //     profileVisibility: 'public',
      //     locationSharing: false,
      //   },
      //   app: {
      //     autoSync: true,
      //     cacheSize: 100,
      //   },
      // };

      // await this.setDocument(COLLECTIONS.USER_PREFERENCES, userCredential.user.uid, defaultPreferences);

      const token = await userCredential.user.getIdToken();
console.log(token);
      return {
        success: true,
        data: {
          user: {
            id: 'string',
            email: 'string',
            name: 'string',
            avatar: 'string',
            phone: 'string',
            createdAt: 'string',
            updatedAt: 'string',
          },
          token,
        },
        message: 'Registration successful',
      };
    } catch (error: any) {
      console.log(error);
      return {
        success: false,
        data: null as any,
        error: this.getAuthErrorMessage(error.code),
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<ApiResponse<boolean>> {
    try {
      await this.auth.signOut();
      return {
        success: true,
        data: true,
        message: 'Logout successful',
      };
    } catch (error: any) {
      return {
        success: false,
        data: false,
        error: 'Logout failed',
      };
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseAuthTypes.User | null {
    return this.auth.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  /**
   * Get current user's ID token
   */
  async getCurrentUserToken(): Promise<string | null> {
    try {
      const user = this.getCurrentUser();
      if (!user) return null;
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting user token:', error);
      return null;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<ApiResponse<boolean>> {
    try {
      await this.auth.sendPasswordResetEmail(email);
      return {
        success: true,
        data: true,
        message: 'Password reset email sent',
      };
    } catch (error: any) {
      return {
        success: false,
        data: false,
        error: this.getAuthErrorMessage(error.code),
      };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<ApiResponse<boolean>> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      await user.updatePassword(newPassword);
      return {
        success: true,
        data: true,
        message: 'Password updated successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        data: false,
        error: this.getAuthErrorMessage(error.code),
      };
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<ApiResponse<boolean>> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      const userId = user.uid;

      // Delete user data from Firestore
      await this.deleteDocument(COLLECTIONS.USERS, userId);
      await this.deleteDocument(COLLECTIONS.USER_PREFERENCES, userId);

      // Delete user subcollections
      await this.deleteCollection(`${COLLECTIONS.USERS}/${userId}/favorites`);
      await this.deleteCollection(`${COLLECTIONS.USERS}/${userId}/reviews`);

      // Delete auth user
      await user.delete();

      return {
        success: true,
        data: true,
        message: 'Account deleted successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        data: false,
        error: this.getAuthErrorMessage(error.code),
      };
    }
  }

  // ==================== FIRESTORE METHODS ====================

  /**
   * Get a single document
   */
  async getDocument(
    collection: string,
    docId: string,
  ): Promise<FirebaseFirestoreTypes.DocumentSnapshot> {
    try {
      return await this.db.collection(collection).doc(docId).get();
    } catch (error) {
      console.error(
        `Error getting document ${docId} from ${collection}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get all documents from a collection
   */
  async getCollection(
    collection: string,
    limit?: number,
  ): Promise<FirebaseFirestoreTypes.QuerySnapshot> {
    try {
      let query: FirebaseFirestoreTypes.Query = this.db.collection(collection);

      if (limit) {
        query = query.limit(limit);
      }

      return await query.get();
    } catch (error) {
      console.error(`Error getting collection ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Get documents with query
   */
  async queryCollection(
    collection: string,
    field: string,
    operator: FirebaseFirestoreTypes.WhereFilterOp,
    value: any,
    limit?: number,
  ): Promise<FirebaseFirestoreTypes.QuerySnapshot> {
    try {
      let query: FirebaseFirestoreTypes.Query = this.db
        .collection(collection)
        .where(field, operator, value);

      if (limit) {
        query = query.limit(limit);
      }

      return await query.get();
    } catch (error) {
      console.error(`Error querying collection ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Set/Update a document
   */
  async setDocument(
    collection: string,
    docId: string,
    data: any,
    merge = true,
  ): Promise<void> {
    try {
      const docData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      if (merge) {
        await this.db
          .collection(collection)
          .doc(docId)
          .set(docData, { merge: true });
      } else {
        await this.db.collection(collection).doc(docId).set(docData);
      }
    } catch (error) {
      console.error(`Error setting document ${docId} in ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Add a new document (auto-generated ID)
   */
  async addDocument(
    collection: string,
    data: any,
  ): Promise<FirebaseFirestoreTypes.DocumentReference> {
    try {
      const docData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return await this.db.collection(collection).add(docData);
    } catch (error) {
      console.error(`Error adding document to ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Update a document
   */
  async updateDocument(
    collection: string,
    docId: string,
    data: any,
  ): Promise<void> {
    try {
      const docData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await this.db.collection(collection).doc(docId).update(docData);
    } catch (error) {
      console.error(
        `Error updating document ${docId} in ${collection}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(collection: string, docId: string): Promise<void> {
    try {
      await this.db.collection(collection).doc(docId).delete();
    } catch (error) {
      console.error(
        `Error deleting document ${docId} from ${collection}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Delete an entire collection
   */
  async deleteCollection(collectionPath: string): Promise<void> {
    try {
      const collectionRef = this.db.collection(collectionPath);
      const snapshot = await collectionRef.get();

      const batch = this.db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error(`Error deleting collection ${collectionPath}:`, error);
      throw error;
    }
  }

  /**
   * Listen to document changes
   */
  subscribeToDocument(
    collection: string,
    docId: string,
    callback: (doc: FirebaseFirestoreTypes.DocumentSnapshot) => void,
  ): () => void {
    return this.db.collection(collection).doc(docId).onSnapshot(callback);
  }

  /**
   * Listen to collection changes
   */
  subscribeToCollection(
    collection: string,
    callback: (snapshot: FirebaseFirestoreTypes.QuerySnapshot) => void,
    limit?: number,
  ): () => void {
    let query: FirebaseFirestoreTypes.Query = this.db.collection(collection);

    if (limit) {
      query = query.limit(limit);
    }

    return query.onSnapshot(callback);
  }

  /**
   * Listen to collection with query
   */
  subscribeToQuery(
    collection: string,
    field: string,
    operator: FirebaseFirestoreTypes.WhereFilterOp,
    value: any,
    callback: (snapshot: FirebaseFirestoreTypes.QuerySnapshot) => void,
    limit?: number,
  ): () => void {
    let query: FirebaseFirestoreTypes.Query = this.db
      .collection(collection)
      .where(field, operator, value);

    if (limit) {
      query = query.limit(limit);
    }

    return query.onSnapshot(callback);
  }

  // ==================== BATCH OPERATIONS ====================

  /**
   * Execute batch write operations
   */
  async batchWrite(
    operations: Array<{
      type: 'set' | 'update' | 'delete';
      collection: string;
      docId: string;
      data?: any;
    }>,
  ): Promise<void> {
    try {
      const batch = this.db.batch();

      operations.forEach(({ type, collection, docId, data }) => {
        const docRef = this.db.collection(collection).doc(docId);

        switch (type) {
          case 'set':
            if (data) {
              batch.set(docRef, {
                ...data,
                updatedAt: new Date().toISOString(),
              });
            }
            break;
          case 'update':
            if (data) {
              batch.update(docRef, {
                ...data,
                updatedAt: new Date().toISOString(),
              });
            }
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      });

      await batch.commit();
    } catch (error) {
      console.error('Error executing batch write:', error);
      throw error;
    }
  }

  // ==================== TRANSACTION OPERATIONS ====================

  /**
   * Execute transaction
   */
  async runTransaction<T>(
    updateFunction: (
      transaction: FirebaseFirestoreTypes.Transaction,
    ) => Promise<T>,
  ): Promise<T> {
    try {
      return await this.db.runTransaction(updateFunction);
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get server timestamp
   */
  getServerTimestamp(): FirebaseFirestoreTypes.FieldValue {
    return firestore.FieldValue.serverTimestamp();
  }

  /**
   * Create a new document reference
   */
  createDocumentReference(
    collection: string,
    docId?: string,
  ): FirebaseFirestoreTypes.DocumentReference {
    if (docId) {
      return this.db.collection(collection).doc(docId);
    }
    return this.db.collection(collection).doc();
  }

  /**
   * Create a new collection reference
   */
  createCollectionReference(
    collection: string,
  ): FirebaseFirestoreTypes.CollectionReference {
    return this.db.collection(collection);
  }

  /**
   * Enable/disable network
   */
  async enableNetwork(): Promise<void> {
    await this.db.enableNetwork();
  }

  async disableNetwork(): Promise<void> {
    await this.db.disableNetwork();
  }

  /**
   * Clear persistence
   */
  async clearPersistence(): Promise<void> {
    await this.db.clearPersistence();
  }

  // ==================== ERROR HANDLING ====================

  /**
   * Get user-friendly auth error message
   */
  private getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case FIREBASE_ERRORS.AUTH_USER_NOT_FOUND:
        return 'No user found with this email address';
      case FIREBASE_ERRORS.AUTH_WRONG_PASSWORD:
        return 'Incorrect password';
      case FIREBASE_ERRORS.AUTH_EMAIL_ALREADY_IN_USE:
        return 'An account with this email already exists';
      case FIREBASE_ERRORS.AUTH_WEAK_PASSWORD:
        return 'Password is too weak. Please choose a stronger password';
      case FIREBASE_ERRORS.AUTH_INVALID_EMAIL:
        return 'Invalid email address';
      case FIREBASE_ERRORS.AUTH_USER_DISABLED:
        return 'This account has been disabled';
      case FIREBASE_ERRORS.AUTH_TOO_MANY_REQUESTS:
        return 'Too many failed attempts. Please try again later';
      case FIREBASE_ERRORS.AUTH_NETWORK_REQUEST_FAILED:
        return 'Network error. Please check your connection';
      default:
        return 'Authentication failed. Please try again';
    }
  }

  /**
   * Get user-friendly Firestore error message
   */
  private getFirestoreErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case FIREBASE_ERRORS.FIRESTORE_PERMISSION_DENIED:
        return 'Permission denied. You do not have access to this data';
      case FIREBASE_ERRORS.FIRESTORE_NOT_FOUND:
        return 'Requested data not found';
      case FIREBASE_ERRORS.FIRESTORE_ALREADY_EXISTS:
        return 'Data already exists';
      case FIREBASE_ERRORS.FIRESTORE_UNAVAILABLE:
        return 'Service temporarily unavailable. Please try again later';
      case FIREBASE_ERRORS.FIRESTORE_DEADLINE_EXCEEDED:
        return 'Request timeout. Please try again';
      default:
        return 'Database operation failed. Please try again';
    }
  }

  /**
   * Handle Firebase errors
   */
  handleError(error: any): string {
    if (error.code) {
      if (error.code.startsWith('auth/')) {
        return this.getAuthErrorMessage(error.code);
      } else if (error.code.startsWith('firestore/')) {
        return this.getFirestoreErrorMessage(error.code);
      }
    }

    return error.message || 'An unexpected error occurred';
  }
}

// Create and export singleton instance
export const firebaseService = new FirebaseService();

// Export types for external use
export type FirebaseServiceType = typeof firebaseService;

// Export commonly used methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  isAuthenticated,
  getCurrentUserToken,
  resetPassword,
  updatePassword,
  deleteAccount,
  getDocument,
  getCollection,
  queryCollection,
  setDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  deleteCollection,
  subscribeToDocument,
  subscribeToCollection,
  subscribeToQuery,
  batchWrite,
  runTransaction,
  getServerTimestamp,
  createDocumentReference,
  createCollectionReference,
  enableNetwork,
  disableNetwork,
  clearPersistence,
  handleError,
} = firebaseService;
