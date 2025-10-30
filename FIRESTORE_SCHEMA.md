# Firestore Database Schema for LocalFindz

This document describes the Firestore database schema for tracking store views, comments, and bookmarks.

## Overview

The schema is designed to support:
- Store/Business information
- View tracking (total counts and time-series data for graphs)
- Comments system (with nested replies)
- Bookmarks functionality

---

## Collections Structure

### 1. `businesses` (or `stores`) Collection

Main collection for store/business information.

#### Document Structure

```typescript
{
  id: string;                    // Document ID
  name: string;                  // Store name
  description: string;           // Store description
  address: string;              // Full address
  coordinates: {
    latitude: number;
    longitude: number;
  };
  category: string;             // Store category
  rating: number;               // Average rating (0-5)
  reviewCount: number;          // Total number of reviews
  photos: string[];             // Array of photo URLs
  ownerId: string;              // Reference to user who owns/manages the store
  ownerName: string;            // Owner's name (denormalized for quick access)
  ownerAvatar?: string;         // Owner's avatar URL
  contact: {
    phone?: string;
    website?: string;
    email?: string;
  };
  hours: {
    [key: string]: {            // 'Mon', 'Tue', etc.
      open: string;             // '9:00AM'
      close: string;            // '11:00PM'
      closed?: boolean;
    };
  };
  amenities: string[];          // Array of amenities
  priceRange?: 1 | 2 | 3 | 4;  // Price range indicator
  distance?: number;            // Distance in miles (calculated client-side)
  
  // View tracking fields
  viewCount: number;            // Total view count (for quick access)
  lastViewedAt: string;         // ISO timestamp of last view
  
  // Aggregated statistics
  stats: {
    dailyViews: number;         // Views today (reset daily via Cloud Function)
    weeklyViews: number;        // Views this week
    monthlyViews: number;       // Views this month
  };
  
  // Timestamps
  createdAt: string;            // ISO timestamp
  updatedAt: string;            // ISO timestamp
}
```

#### Subcollections

- `views` - Individual view records
- `viewAggregates` - Daily/hourly view aggregates for graph construction
- `comments` - Store comments
- `bookmarks` - User bookmarks (alternative: use separate collection)

---

### 2. `businesses/{storeId}/views` Subcollection

Individual view records for detailed analytics.

#### Document Structure

```typescript
{
  id: string;                    // Document ID (auto-generated)
  userId?: string;               // User ID if logged in (optional solidus anonymous views)
  userAgent?: string;            // User agent string (optional)
  ipAddress?: string;            // IP address (optional, handled via Cloud Function)
  
  // Time fields (indexed for queries)
  timestamp: Timestamp;          // Firestore Timestamp
  date: string;                  // Date string: "2024-01-15" (for easy querying)
  hour: number;                  // Hour of day: 0-23 (for hourly aggregation)
  dayOfWeek: number;             // Day of week: 0 (Sunday) to 6 (Saturday)
  week: string;                  // Week string: "2024-W03"
  month: string;                 // Month string: "2024-01"
  year: number;                  // Year: 2024
  
  // Session information
  sessionId?: string;            // Session identifier (to prevent duplicate counts)
  referrer?: string;             // Where user came from (optional)
  
  // Metadata
  createdAt: Timestamp;          // Firestore server timestamp
}
```

**Indexes Required:**
- `date` (ascending)
- `timestamp` (descending)
- `date + hour` (composite)
- `month` (ascending)
- `week` (ascending)

**Query Examples:**
- Get views for a specific day: `where('date', '==', '2024-01-15')`
- Get views for a date range: `where('date', '>=', '2024-01-01').where('date', '<=', '2024-01-31')`
- Get hourly views for a day: `where('date', '==', '2024-01-15').orderBy('hour')`
- Get weekly/monthly aggregates: `where('week', '==', '2024-W03')` or `where('month', '==', '2024-01')`

---

### 3. `businesses/{storeId}/viewAggregates` Subcollection

Pre-aggregated views for efficient graph generation.

#### Document Structure

```typescript
{
  id: string;                    // Format: "YYYY-MM-DD" or "YYYY-MM-DD-HH" for hourly
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  
  // Time fields
  date: string;                  // "2024-01-15"
  hour?: number;                 // 0-23 (only for hourly aggregates)
  week?: string;                 // "2024-W03" (only for weekly aggregates)
  month?: string;                // "2024-01" (only for monthly aggregates)
  year: number;                  // 2024
  
  // Aggregated data
  viewCount: number;             // Total views in this period
  uniqueUsers: number;           // Unique user count (if tracking users)
  
  // Metadata
  lastUpdatedAt: Timestamp;      // Firestore server timestamp
  createdAt: Timestamp;          // Firestore server timestamp
}
```

**Document ID Examples:**
- Daily: `"2024-01-15"`
- Hourly: `"2024-01-15-14"` (2 PM)
- Weekly: `"2024-W03"`
- Monthly: `"2024-01"`

**Indexes Required:**
- `period + date` (composite)
- `period + month` (composite)
- `period + week` (composite)
- `date` (ascending)

**Query Examples:**
- Get daily aggregates for a month: `where('period', '==', 'daily').where('month', '==', '2024-01').orderBy('date')`
- Get hourly aggregates for a day: `where('period', '==', 'hourly').where('date', '==', '2024-01-15').orderBy('hour')`

**Note:** This subcollection should be populated/maintained by Cloud Functions triggered by new view documents.

---

### 4. `businesses/{storeId}/comments` Subcollection

Store comments with support for nested replies.

#### Document Structure

```typescript
{
  id: string;                    // Document ID (auto-generated)
  storeId: string;               // Reference to parent store
  userId: string;                // User who wrote the comment
  userName: string;              // User's name (denormalized)
  userAvatar?: string;           // User's avatar URL (denormalized)
  
  // Comment content
  text: string;                  // Comment text
  edited: boolean;               // Whether comment has been edited
  editedAt?: string;             // ISO timestamp of last edit
  
  // Replies
  replies: {
    id: string;                  // Reply ID (auto-generated)
    userId: string;              // User who replied
    userName: string;            // User's name (denormalized)
    userAvatar?: string;         // User's avatar URL (denormalized)
    text: string;                // Reply text
    parentCommentId: string;     // Reference to parent comment
    edited: boolean;
    editedAt?: string;
    createdAt: string;           // ISO timestamp
    updatedAt: string;           // ISO timestamp
  }[];
  
  // Engagement metrics
  likes: number;                 // Number of likes
  likedBy: string[];             // Array of user IDs who liked (for quick check)
  
  // Status
  deleted: boolean;              // Soft delete flag
  deletedAt?: string;            // ISO timestamp if deleted
  
  // Timestamps
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

**Alternative Nested Structure (Better for Replies):**

If you expect many replies, consider a separate replies subcollection:

#### `businesses/{storeId}/comments/{commentId}/replies` Subcollection

```typescript
{
  id: string;                    // Document ID
  commentId: string;             // Parent comment ID
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  edited: boolean;
  editedAt?: string;
  likes: number;
  likedBy: string[];
  deleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Indexes Required:**
- `createdAt` (descending) - for ordering comments
- `userId` (ascending)
- `deleted` (ascending) - for filtering deleted comments

**Query Examples:**
- Get all comments for a store: `where('deleted', '==', false).orderBy('createdAt', 'desc')`
- Get user's comments: `where('userId', '==', userId).where('deleted', '==', false)`

---

### 5. `userBookmarks` Collection

User bookmarks for stores. Alternative: use subcollection `users/{userId}/bookmarks`.

#### Document Structure

```typescript
{
  id: string;                    // Document ID (auto-generated)
  userId: string;                // User who bookmarked
  storeId: string;               // Bookmarked store ID
  
  // Denormalized store data for quick access
  storeName: string;
  storeImage?: string;
  storeAddress: string;
  storeCategory: string;
  
  // Timestamps
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

**Indexes Required:**
- `userId` (ascending) + `createdAt` (descending) - composite
- `storeId` (ascending)

**Query Examples:**
- Get user's bookmarks: `where('userId', '==', userId).orderBy('createdAt', 'desc')`
- Check if store is bookmarked: `where('userId', '==', userId).where('storeId', '==', storeId)`

**Alternative: Subcollection Approach**

`users/{userId}/bookmarks` subcollection:

```typescript
{
  id: string;                    // Store ID (use storeId as document ID for easy lookup)
  storeId: string;               // Same as document ID
  storeName: string;
  storeImage?: string;
  storeAddress: string;
  storeCategory: string;
  createdAt: string;
}
```

**Query Examples:**
- Get user's bookmarks: `orderBy('createdAt', 'desc')`
- Check if bookmarked: `doc(storeId).get()` (direct document access)

---

## Cloud Functions Recommendations

### 1. View Tracking Function

**Trigger:** When a new document is created in `businesses/{storeId}/views`

**Actions:**
1. Increment `viewCount` on the store document
2. Update `lastViewedAt` on the store document
3. Create/update aggregate document in `viewAggregates` subcollection
4. Update daily/weekly/monthly stats

### 2. View Aggregation Function (Scheduled)

**Trigger:** Scheduled function (e.g., every hour)

**Actions:**
1. Aggregate views from `views` subcollection into `viewAggregates`
2. Clean up old individual view records (optional, for cost optimization)

### 3. Comment Counter Function

**Trigger:** When comment is created/deleted in `businesses/{storeId}/comments`

**Actions:**
1. Update comment count on store document (if storing this)

---

## Security Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  function isAuthenticated() {
    return request.auth != null;
  }
  
  function isOwner(userId) {
    return isAuthenticated() && request.auth.uid == userId;
  }
  
  match /businesses/{storeId} {
    // Store document
    allow read: if true;  // Public read
    allow write: if isOwner(resource.data.ownerId);
    
    // Views subcollection
    match /views/{viewId} {
      allow create: if true;  // Anyone can create view
      allow read: if isOwner(resource.data.userId) || 
                     isOwner(get(/databases/$(database)/documents/businesses/$(storeId)).data.ownerId);
      allow update, delete: if false;  // Views are immutable
    }
    
    // View aggregates subcollection
    match /viewAggregates/{aggregateId} {
      allow read: if true;
      allow write: if false;  // Only Cloud Functions can write
    }
    
    // Comments subcollection
    match /comments/{commentId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId) || 
                      isOwner(get(/databases/$(database)/documents/businesses/$(storeId)).data.ownerId);
      
      // Replies subcollection (if using nested structure)
      match /replies/{replyId} {
        allow read: if true;
        allow create: if isAuthenticated();
        allow update: if isOwner(resource.data.userId);
        allow delete: if isOwner(resource.data.userId) || 
                        isOwner(get(/databases/$(database)/documents/businesses/$(storeId)).data.ownerId);
      }
    }
  }
  
  match /userBookmarks/{bookmarkId} {
    allow read: if isOwner(resource.data.userId);
    allow create: if isAuthenticated();
    allow update, delete: if isOwner(resource.data.userId);
  }
}
```

---

## Usage Examples

### Recording a View

```typescript
async function recordStoreView(storeId: string, userId?: string) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const hour = now.getHours();
  
  await firebaseService.addDocument(`businesses/${storeId}/views`, {
    userId: userId || null,
    timestamp: firestore.FieldValue.serverTimestamp(),
    date: dateStr,
    hour: hour,
    dayOfWeek: now.getDay(),
    week: getWeekString(now),
    month: dateStr.substring(0, 7),  // "2024-01"
    year: now.getFullYear(),
    sessionId: getSessionId(),  // Prevent duplicate counts
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  
  // Increment view count on store document
  await firebaseService.updateDocument('businesses', storeId, {
    viewCount: firestore.FieldValue.increment(1),
    lastViewedAt: new Date().toISOString(),
  });
}
```

### Getting Views for Graph (Daily Aggregates)

```typescript
async function getStoreViewGraph(storeId: string, startDate: string, endDate: string) {
  const snapshot = await firebaseService.queryCollection(
    `businesses/${storeId}/viewAggregates`,
    'period',
    '==',
    'daily'
  );
  
  // Filter by date range
  const aggregates = snapshot.docs
    .map(doc => doc.data())
    .filter(agg => agg.date >= startDate && agg.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date));
  
  return aggregates.map(agg => ({
    date: agg.date,
    views: agg.viewCount,
  }));
}
```

### Adding a Comment

```typescript
async function addStoreComment(storeId: string, userId: string, text: string) {
  const user = await firebaseService.getDocument('users', userId);
  const userData = user.data();
  
  await firebaseService.addDocument(`businesses/${storeId}/comments`, {
    storeId,
    userId,
    userName: userData.name,
    userAvatar: userData.avatar,
    text,
    edited: false,
    replies: [],
    likes: 0,
    likedBy: [],
    deleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
```

### Bookmarking a Store

```typescript
async function bookmarkStore(storeId: string, userId: string) {
  const store = await firebaseService.getDocument('businesses', storeId);
  const storeData = store.data();
  
  await firebaseService.addDocument('userBookmarks', {
    userId,
    storeId,
    storeName: storeData.name,
    storeImage: storeData.photos?.[0],
    storeAddress: storeData.address,
    storeCategory: storeData.category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
```

---

## Performance Considerations

1. **View Records Cleanup:** Consider archiving old individual view records after aggregating them to reduce storage costs.

2. **Denormalization:** Store frequently accessed data (like store name in bookmarks) to reduce document reads.

3. **Pagination:** Use pagination when querying views, comments, or bookmarks to avoid reading large datasets.

4. **Composite Indexes:** Create all required composite indexes in Firebase Console before deploying queries.

5. **Caching:** Consider caching aggregate view data on the client for better performance.

---

## Cost Optimization

1. **Aggregate Views:** Use `viewAggregates` subcollection instead of querying all individual views for graphs.

2. **Batch Operations:** Use batch writes when updating multiple documents (e.g., incrementing counters).

3. **Limit Queries:** Always set appropriate limits on queries to avoid unnecessary reads.

4. **Archive Old Data:** Move old view records to a separate collection or delete them after aggregation.

