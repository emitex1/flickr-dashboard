import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import admin from "firebase-admin";
import * as dotenvContent from "dotenv";
import axios from "axios";

admin.initializeApp();
const db = admin.firestore();

const allowedOrigins = [
	"https://flickr-dashboard.web.app",
	"https://flickr-dashboard.firebaseapp.com",
	"http://localhost:5173",
	"http://localhost:5174", //TODO: should be removed when deploying to production
];

const checkCORS = (req: any, res: any) => {
	const currentOrigin = req.headers.origin;
	if (allowedOrigins.includes(currentOrigin)) {
		res.set("Access-Control-Allow-Origin", currentOrigin);
	}
	res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
	res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

	if (req.method === "OPTIONS") {
		res.status(204).send("");
		return;
	}
};

const checkAuthorization = async (req: any, res: any) => {
	try {
		const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const currentUserId = decodedToken.uid;
		return currentUserId;
	} catch (error: any) {
		logger.error("Error checking authorization:", error.message);
		res.status(401).send("Error checking authorization:\n" + error.message);
	}
};

const callFlickrAPI = async (
	method: string,
	api_key: string,
	otherParams?: object
) => {
	const url = "https://www.flickr.com/services/rest/";
	const params = {
		method: method,
		api_key: api_key,
		format: "json",
		nojsoncallback: 1,
		...otherParams,
	};

	const response = await axios.get(url, {
		params,
		headers: {
			"User-Agent": "Mozilla/5.0",
			Accept: "application/json",
		},
	});
	const data = response.data;

	if (data.stat === "ok") {
		return data;
	} else {
		logger.error("Error:", data.message);
	}
};

const getFlickrAPIKey = () => {
	dotenvContent.config();
	const apiKey = process.env.FLICKR_API_KEY;
	logger.info("Flickr API Key is available.");
	if (!apiKey) throw new Error("Flickr API Key is not defined");
	return apiKey;
};

async function getUserId(flickrUserName: string, api_key: string) {
	try {
		const data = await callFlickrAPI("flickr.people.findByUsername", api_key, {
			username: flickrUserName,
		});
		const userId = data.user.id;
		logger.info(`User ID for ${flickrUserName}: ${userId}`);
		return userId;
	} catch (error: any) {
		logger.error("API request failed:", error.message);
		throw new Error("API request failed:" + error.message);
	}
}

export const checkFlickrUserName = functions.https.onRequest(
	async (req: any, res: any) => {
		checkCORS(req, res);

		logger.info("Checking Flickr User Name.");

		const currentUserId = await checkAuthorization(req, res);

		try {
			const apiKey = getFlickrAPIKey();

			const flickrUserName = req.query.userName || "";
			if (!flickrUserName) throw new Error("A user name should be provided.");
			logger.info(`Target User Name: ${flickrUserName}`);

			const data = await callFlickrAPI("flickr.people.findByUsername", apiKey, {
				username: flickrUserName,
			});
			logger.info("Data fetched by Flickr API:", data);

			if (data?.stat === "ok") {
				const flickrUserId = data.user.id;
				logger.info(`Flickr User ID for ${flickrUserName}: ${flickrUserId}`);

				const userRef = db.collection("users").doc(currentUserId);
				await userRef.set(
					{
						flickrUserId: flickrUserId,
						flickrUserName: flickrUserName,
					},
					{ merge: true }
				);

				res.status(200).json({
					flickrUserId: flickrUserId,
				});
			} else {
				logger.error("Error:", data?.message);
				res.status(404);
			}
		} catch (error: any) {
			logger.error("Error fetching Flickr User:", error);
			res.status(500).send("Error fetching Flickr User:\n" + error.message);
		}
	}
);

export const fetchFlickrPhotos = functions.https.onRequest(
	async (req: any, res: any) => {
		checkCORS(req, res);

		logger.info("Fetching the photos is started.");
		try {
			const apiKey = getFlickrAPIKey();

			const userName = req.query.userName || "";
			if (!userName) throw new Error("Target User Name is not defined");
			logger.info(`Target User Name: ${userName}`);
			const userId = await getUserId(userName, apiKey);

			const isPublic =
				(req.query.isPublic || "").trim().toLowerCase() === "true";
			const flickrMethodName = isPublic ? "getPublicPhotos" : "getPhotos";

			const result = await callFlickrAPI(
				"flickr.people." + flickrMethodName,
				apiKey,
				{
					user_id: userId,
				}
			);

			// if (photos.stat === "fail") {
			//   logger.error("Error:", photos.message);
			//   res.status(404);
			// }
			logger.info(`${result.photos.total} photos are fetched.`);

			res.status(200).json(result);
		} catch (error: any) {
			logger.error("Error fetching Flickr photos:", error);
			res.status(500).send("Error fetching Flickr photos:\n" + error.message);
		}
	}
);
