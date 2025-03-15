import * as functionsV2 from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import { callFlickrAPI } from "../util/flickrUtils";
import { db } from "..";

export const saveFlickrPhotos = functionsV2.onSchedule(
  "every day 05:00",
  async () => {
    const logPrefix = "[UpdatePhotos]";
    const log = (message: string, ...params: unknown[]) => logger.info(logPrefix, message, ...params);

    log("Cron Job Started: Fetching Flickr Photos...");

    const usersRef = db.collection("users");
    const usersSnapshot = await usersRef.get();

    // Loop and Check for each user in the Firestore
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const { flickrUserName, flickrUserId } = userDoc.data();
      log(
        "Checking the Photos owned by User '" +
          flickrUserName +
          "' (" +
          userId +
          ")"
      );

      try {
        const result = await callFlickrAPI("flickr.people.getPhotos", {
          user_id: flickrUserId,
        });
        log(
          `${result.photos.total} photos owned by '${flickrUserName}' are fetched.`
        );

        const photos = result.photos.photo;
        const photoListRef = usersRef.doc(userId).collection("photos");
        for (const photo of photos) {
          const photoId = photo.id;

          // Check if the photo already exists in Firestore
          const photoRef = photoListRef.doc(photoId);
          const photoDoc = await photoRef.get();
          if (photoDoc.exists) {
            log(`Photo ${photoId} already exists in Firestore.`);
            continue;
          }
          await photoRef.set({
            title: photo.title,
            // url: `https://www.flickr.com/photos/${flickrUserId}/${photoId}`,
            timestamp: new Date().toISOString(),
            server: photo.server,
            secret: photo.secret,
          });
          log(
            `Added photo ${photoId} from user '${flickrUserName}' to Firestore.`
          );
        }
      } catch (error) {
        logger.error(
          `${logPrefix} Failed to fetch photos for user ${userId}:`,
          error
        );
      }
    }
    log("Cron Job Completed.");
  }
);
