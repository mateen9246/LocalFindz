import { firebaseService } from './firebase';
import { COLLECTIONS } from './firebase';
async function handleBookmark(item, userBookmarks, setUserBookmarks) {
    console.log('===>', item);
  try {
    const bookMark = userBookmarks.find(
      bookmark => bookmark.storeId === item.id,
    );
    if (bookMark) {
      await firebaseService.updateDocument(
        COLLECTIONS.USER_BOOKMARKS,
        bookMark.id,
        {
          isBookmarked: !bookMark.isBookmarked,
          updatedAt: new Date().toISOString(),
        },
      );
      setUserBookmarks();
    } else {
      await firebaseService.addDocument(COLLECTIONS.USER_BOOKMARKS, {
        storeId: item.id,
        userId: firebaseService.getCurrentUser().uid,
        isBookmarked: true,
        date: new Date(),
      });
      setUserBookmarks();
    }
  } catch (error) {
    console.error('Error bookmarking store:', error);
  }
}
async function fetchUserBookmarks() {
  const data = await firebaseService.queryCollection(
    COLLECTIONS.USER_BOOKMARKS,
    'userId',
    '==',
    firebaseService.getCurrentUser().uid,
  );
  return data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}
export { fetchUserBookmarks, handleBookmark };
