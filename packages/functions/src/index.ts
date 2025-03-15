import admin from "firebase-admin";
import { saveFlickrPhotos, updateFlickrStats } from "./scheduled";
import { checkFlickrUserName, fetchFlickrPhotos, fetchRecentFlickrPhotos } from "./http";

admin.initializeApp();
export const db = admin.firestore();

export { saveFlickrPhotos, updateFlickrStats }
export { fetchRecentFlickrPhotos, checkFlickrUserName, fetchFlickrPhotos }
