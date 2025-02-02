import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import * as dotenvContent from "dotenv";
import axios from "axios";

const allowedOrigins = [
  'https://flickr-dashboard.web.app',
  'https://flickr-dashboard.firebaseapp.com',
  'http://localhost:5173/'
];

async function getUserId(username: string, api_key: string) {
	const url = "https://www.flickr.com/services/rest/";
	const params = {
		method: "flickr.people.findByUsername",
		api_key: api_key,
		username: username,
		format: "json",
		nojsoncallback: 1,
	};

	try {
		const response = await axios.get(url, {
			params,
			headers: {
				"User-Agent": "Mozilla/5.0",
				Accept: "application/json",
			},
		});
		const data = response.data;

		if (data.stat === "ok") {
			const userId = data.user.id;
			logger.info(`User ID for ${username}: ${userId}`);
			return userId;
		} else {
			logger.error("Error:", data.message);
		}
	} catch (error: any) {
		logger.error("API request failed:", error.message);
		throw new Error("API request failed:" + error.message);
	}
}

export const fetchFlickrPhotos = functions.https.onRequest(
  async (req: any, res: any) => {
    const currentOrigin = req.headers.origin;  
    if (allowedOrigins.includes(currentOrigin)) {
      res.set('Access-Control-Allow-Origin', currentOrigin);
    }
		res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
		res.set("Access-Control-Allow-Headers", "Content-Type");

		if (req.method === "OPTIONS") {
			res.status(204).send("");
			return;
		}

		logger.info("Fetching the photos is started.");
		try {
			dotenvContent.config();
			const apiKey = process.env.FLICKR_API_KEY;
			if (!apiKey) throw new Error("Flickr API Key is not defined");
			logger.info("Flickr API Key is available.");

			const userName = req.query.userName || '';
			if (!userName) throw new Error("Target User Name is not defined");
			logger.info(`Target User Name: ${userName}`);
			const userId = await getUserId(userName, apiKey);

			const isPublic =
				(req.query.isPublic || "").trim().toLowerCase() === "true";
			const flickrMethodName = isPublic ? "getPublicPhotos" : "getPhotos";
			const flickrApiUrl = `https://www.flickr.com/services/rest/?method=flickr.people.${flickrMethodName}&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`;

			const response = await axios.get(flickrApiUrl, {
				headers: {
					"User-Agent": "Mozilla/5.0",
					Accept: "application/json",
				},
			});
			logger.info("Photos are fetched from Flickr API.");
			const photos = response.data;
			logger.info(`${photos.photos.total} photos are fetched.`);

			res.status(200).json(photos);
		} catch (error: any) {
			logger.error("Error fetching Flickr photos:", error);
			res.status(500).send("Error fetching Flickr photos:\n" + error.message);
		}
	}
);
