import admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import { checkAuthorization, checkCORS } from "./util/webUtils";
import { callFlickrAPI } from "./util/flickrUtils";
import { saveFlickrPhotos, updateFlickrStats } from "./scheduled";
import { fetchRecentFlickrPhotos } from "./http";

admin.initializeApp();
export const db = admin.firestore();

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
			const flickrUserName = req.query.userName || "";
			if (!flickrUserName) throw new Error("A user name should be provided.");
			logger.info(`Target User Name: ${flickrUserName}`);

			const flickrUserResult = await getUserId(flickrUserName);
			if (!flickrUserResult.isDone) {
				logger.error("Error: ", flickrUserResult.message);
				res
					.status(flickrUserResult.status)
					.json({ error: flickrUserResult.message });
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
			res
				.status(500)
				.send(
					"Error fetching Flickr User:\n" +
						(error as { message: string }).message
				);
		}
	}
);

export const fetchFlickrPhotos = functions.https.onRequest(
	async (req: any, res: any) => {
		logger.info("[fetchFlickrPhotos] is called.");

		checkCORS(req, res);

		try {
			const flickrUserName = req.query.userName;

			logger.info(
				flickrUserName
					? `Provided User Name: ${flickrUserName}`
					: "No Flickr User Name is provided."
			);

			let flickrUserId;
			if (flickrUserName) {
				const flickrUserResult = await getUserId(flickrUserName);
				if (!flickrUserResult.isDone) {
					logger.error("Error: ", flickrUserResult.message);
					res
						.status(flickrUserResult.status)
						.json({ error: flickrUserResult.message });
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

			const result = await callFlickrAPI("flickr.people." + flickrMethodName, {
				user_id: flickrUserId,
			});
			logger.info(`${result.photos.total} photos are fetched.`);

			res.status(200).json(result);
		} catch (error: unknown) {
			logger.error("Error fetching Flickr photos:", error);
			res
				.status(500)
				.send(
					"Error fetching Flickr photos:\n" +
						(error as { message: string }).message
				);
		}
	}
);

export { saveFlickrPhotos, updateFlickrStats, fetchRecentFlickrPhotos }