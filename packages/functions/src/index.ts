import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import admin from "firebase-admin";
import * as dotenvContent from "dotenv";
import axios from "axios";
import { failResult, successResult } from "./util/generalResult";

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

const checkAuthorization = async (req: any) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return failResult(401, "Unauthorized: No token provided");
		}

		const idToken = authHeader.split("Bearer ")[1];
		const decodedToken = await admin.auth().verifyIdToken(idToken);
		const currentUserId = decodedToken.uid;
		return successResult(currentUserId);
	} catch (error: any) {
		return failResult(401, "Error checking authorization:\n" + error.message);
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
	// if (photos.stat === "fail") {
	//   logger.error("Error:", photos.message);
	//   res.status(404);
	// }
};

const getFlickrAPIKey = () => {
	dotenvContent.config();
	const apiKey = process.env.FLICKR_API_KEY;
	logger.info("Flickr API Key is available.");
	if (!apiKey) throw new Error("Flickr API Key is not defined");
	return apiKey;
};

const getUserId = async (flickrUserName: string, api_key: string) => {
	try {
		const data = await callFlickrAPI("flickr.people.findByUsername", api_key, {
			username: flickrUserName,
		});

		if (data?.stat === "ok") {
			const flickrUserId = data.user.id;
			logger.info(`User ID for ${flickrUserName} has found: ${flickrUserId}`);
			return successResult(flickrUserId);
		} else {
			return failResult(404, "User not found: " + data?.message);
		}
	} catch (error: any) {
		return failResult(500, "API request failed: " + error.message);
	}
}

export const checkFlickrUserName = functions.https.onRequest(
	async (req: any, res: any) => {
		checkCORS(req, res);

		logger.info("Checking Flickr User Name.");

		const authResult = await checkAuthorization(req);
		if (!authResult.isDone) {
			logger.error("Error: ", authResult.message);
			res.status(authResult.status).json({ error: authResult.message });
			return;
		}
		const currentFirebaseUserId = authResult.data as string;

		try {
			const apiKey = getFlickrAPIKey();

			const flickrUserName = req.query.userName || "";
			if (!flickrUserName) throw new Error("A user name should be provided.");
			logger.info(`Target User Name: ${flickrUserName}`);

			const flickrUserResult = await getUserId(flickrUserName, apiKey);
			if (!flickrUserResult.isDone) {
        logger.error("Error: ", flickrUserResult.message);
        res.status(flickrUserResult.status).json({ error: flickrUserResult.message });
        return;
      }
			const flickrUserId = flickrUserResult.data as string;

			const userRef = db.collection("users").doc(currentFirebaseUserId);
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
		} catch (error: any) {
			logger.error("Error fetching Flickr User:", error);
			res.status(500).send("Error fetching Flickr User:\n" + error.message);
		}
	}
);

const readCurrentUserFlickrId = async (currentUserId: string) => {
	const userRef = db.collection("users").doc(currentUserId);
	const flickrUserId = await userRef
		.get()
		.then((doc) => doc.data()?.flickrUserId);
	if (!flickrUserId) throw new Error("Flickr User ID not found in Firestore.");
	return flickrUserId;
};

export const fetchFlickrPhotos = functions.https.onRequest(
	async (req: any, res: any) => {
		checkCORS(req, res);
		logger.info("Fetching the photos is started.");
		try {
			const apiKey = getFlickrAPIKey();

			const flickrUserName = req.query.userName;

			logger.info(
				flickrUserName
					? `Provided User Name: ${flickrUserName}`
					: "No Flickr User Name is provided."
			);

			let flickrUserId;
			if (flickrUserName) {
				const flickrUserResult = await getUserId(flickrUserName, apiKey);
				if (!flickrUserResult.isDone) {
          logger.error("Error: ", flickrUserResult.message);
          res.status(flickrUserResult.status).json({ error: flickrUserResult.message });
          return;
        }
				flickrUserId = flickrUserResult.data as string;
			} else {
				const authResult = await checkAuthorization(req);
				if (!authResult.isDone) {
					logger.error("Error:", authResult.message);
					res.status(authResult.status).json({ error: authResult.message });
					return;
				}
				const currentFirebaseUserId = authResult.data as string;
				flickrUserId = readCurrentUserFlickrId(currentFirebaseUserId);
			}
			logger.info(`Flickr User ID: ${flickrUserId}`);

			const isPublic =
				(req.query.isPublic || "").trim().toLowerCase() === "true";
			const flickrMethodName = isPublic ? "getPublicPhotos" : "getPhotos";

			const result = await callFlickrAPI(
				"flickr.people." + flickrMethodName,
				apiKey,
				{
					user_id: flickrUserId,
				}
			);
			logger.info(`${result.photos.total} photos are fetched.`);

			res.status(200).json(result);
		} catch (error: any) {
			logger.error("Error fetching Flickr photos:", error);
			res.status(500).send("Error fetching Flickr photos:\n" + error.message);
		}
	}
);
