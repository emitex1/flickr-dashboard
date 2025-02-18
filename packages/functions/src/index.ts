import admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import * as dotenvContent from "dotenv";
import axios from "axios";
import { failResult, successResult } from "./util/generalResult";
import { checkAuthorization, checkCORS } from "./util/webUtils";

admin.initializeApp();
const db = admin.firestore();

const getFlickrAPIKey = () => {
	dotenvContent.config();
	const apiKey = process.env.FLICKR_API_KEY;
	logger.info("Flickr API Key is available.");
	if (!apiKey) throw new Error("Flickr API Key is not defined");
	return apiKey;
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
	} catch (error: unknown) {
		logger.error("API Request Failed", error);
		return failResult(500, "API Request Failed: " + (error as {message: string}).message);
	}
}

const readCurrentUserFlickrId = async (currentUserId: string) => {
	const userRef = db.collection("users").doc(currentUserId);
	const flickrUserId = await userRef
		.get()
		.then((doc) => doc.data()?.flickrUserId);
	if (!flickrUserId) throw new Error("Flickr User ID not found in Firestore.");
	return flickrUserId;
};

export const checkFlickrUserName = functions.https.onRequest(
	async (req: any, res: any) => {
		logger.info("[checkFlickrUserName] is called.");

		checkCORS(req, res);

		const authResult = await checkAuthorization(req, admin);
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
		} catch (error: unknown) {
			logger.error("Error fetching Flickr User:", error);
			res.status(500).send("Error fetching Flickr User:\n" + (error as {message: string}).message);
		}
	}
);

export const fetchFlickrPhotos = functions.https.onRequest(
	async (req: any, res: any) => {
		logger.info("[fetchFlickrPhotos] is called.");

		checkCORS(req, res);

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
				const authResult = await checkAuthorization(req, admin);
				if (!authResult.isDone) {
					logger.error("Error:", authResult.message);
					res.status(authResult.status).json({ error: authResult.message });
					return;
				}
				const currentFirebaseUserId = authResult.data as string;
				flickrUserId = await readCurrentUserFlickrId(currentFirebaseUserId);
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
		} catch (error: unknown) {
			logger.error("Error fetching Flickr photos:", error);
			res.status(500).send("Error fetching Flickr photos:\n" + (error as {message: string}).message);
		}
	}
);
