/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';
import * as logger from "firebase-functions/logger";
import * as dotenvContent from "dotenv";
import axios from "axios";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const fetchFlickrPhotos = functions.https.onRequest(async (req: any, res: any) => {
  logger.info("Start fetching photos.");
  try {
    dotenvContent.config();
    const apiKey = process.env.FLICKR_API_KEY;
    if (!apiKey) throw new Error("Flickr API Key is not defined");
    logger.info("Flickr API Key is available.");

    const userId = req.query.userId;
    if (!userId) throw new Error("Target User ID is not defined");
    logger.info(`Target User ID: ${userId}`);

    const isPublic = (req.query.isPublic || '').trim().toLowerCase() === 'true';
    const flickrMethodName = isPublic ? 'getPublicPhotos' : 'getPhotos';
    const flickrApiUrl = `https://www.flickr.com/services/rest/?method=flickr.people.${flickrMethodName}&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`;
    
    const response = await axios.get(flickrApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      }
    });
    logger.info('Photos are fetched from Flickr API.');
    const photos = response.data;
    logger.info(`${photos.length} photos are fetched.`);

    res.status(200).json(photos);
  } catch (error: any) {
    logger.error('Error fetching Flickr photos:', error);
    res.status(500).send('Error fetching Flickr photos:\n' + error.message);
  }
});
