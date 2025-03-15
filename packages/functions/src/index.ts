import admin from "firebase-admin";
import { saveFlickrPhotos, updateFlickrStats } from "./scheduled";
import { checkFlickrUserName, fetchFlickrPhotos, fetchRecentFlickrPhotos } from "./http";

admin.initializeApp();
export const db = admin.firestore();

// Scheduled Functions
export { saveFlickrPhotos, updateFlickrStats }

// HTTP Functions
export { fetchRecentFlickrPhotos, checkFlickrUserName, fetchFlickrPhotos }
