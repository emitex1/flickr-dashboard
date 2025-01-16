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
import axios from "axios";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const fetchFlickrPhotos = functions.https.onRequest(async (req: any, res: any) => {
  logger.info("Before calling Flickr API!", {structuredData: true});
    try {
        const apiKey = functions.config().flickr.api_key;
        if (!apiKey) throw new Error("Flickr API Key is not defined");

        const userId = req.query.userId;
        if (!userId) throw new Error("Target User ID is not defined");

        const isPublic = (req.query.isPublic || '').trim().toLowerCase() === 'true';
        const flickrMethodName = isPublic ? 'getPublicPhotos' : 'getPhotos';
        const flickrApiUrl = `https://www.flickr.com/services/rest/?method=flickr.people.${flickrMethodName}&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`;
        
        const response = await axios.get(flickrApiUrl, {
          headers: {
              'User-Agent': 'Mozilla/5.0',
              'Accept': 'application/json',
          }
        });
        const photos = response.data;
        res.status(200).json(photos);
    } catch (error: any) {
        console.error('Error fetching Flickr photos:', error);
        res.status(500).send('Error fetching Flickr photos:\n' + error.message);
    }
});
