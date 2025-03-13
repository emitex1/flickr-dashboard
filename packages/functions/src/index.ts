import admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as functionsV2 from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import { failResult, successResult } from "./util/generalResult";
import { checkAuthorization, checkCORS } from "./util/webUtils";
import { callFlickrAPI } from "./util/flickrUtils";
import { PhotStat } from "./util/types";

admin.initializeApp();
const db = admin.firestore();

const getUserId = async (flickrUserName: string) => {
	try {
		const data = await callFlickrAPI("flickr.people.findByUsername", {
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
		return failResult(
			500,
			"API Request Failed: " + (error as { message: string }).message
		);
	}
};

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

export const fetchRecentFlickrPhotos = functions.https.onRequest(
	async (req: any, res: any) => {
		const logPrefix = "[FetchRecentPhotos]";
		const log = (message: string, ...params: unknown[]) => logger.info(logPrefix, message, ...params);

		log("fetchRecentFlickrPhotos() is called.");

		checkCORS(req, res);

		try {
			const authResult = await checkAuthorization(req, admin);
			if (!authResult.isDone) {
				logger.error(logPrefix, "Error:", authResult.message);
				res.status(authResult.status).json({ error: authResult.message });
				return;
			}
			const currentFirebaseUserId = authResult.data as string;
			const flickrUserId = await readCurrentUserFlickrId(currentFirebaseUserId);
			log(`Flickr User ID: ${flickrUserId}`);

			const todayMorning = new Date();
			todayMorning.setHours(5, 0, 0, 0);
			log("Today Morning:", todayMorning);
			const result = await callFlickrAPI("flickr.photos.search", {
				user_id: flickrUserId,
				min_upload_date: todayMorning,
			});
			log(`${result.photos.total} photos are fetched.`);

			res.status(200).json(result);
		} catch (error: unknown) {
			logger.error(logPrefix, "Error fetching recent Flickr photos:", error);
			res
				.status(500)
				.send(
					"Error fetching recent Flickr photos:\n" +
						(error as { message: string }).message
				);
		}
	}
);

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

export const updateFlickrStats = functionsV2.onSchedule(
	"every day 06:00",
	async () => {
		const logPrefix = "[UpdateStats]";
		const log = (message: string, ...params: unknown[]) => logger.info(logPrefix, message, ...params);

		log("Cron Job Started: Fetching Flickr Stats...");

		const usersRef = db.collection("users");
		const usersSnapshot = await usersRef.get();

		const today = new Date().toISOString().split("T")[0];
		log("Today:", today);

		for (const userDoc of usersSnapshot.docs) {
			const userId = userDoc.id;
			const { flickrUserName } = userDoc.data();
			log("--------------------------------");
			log(
				"Checking the Photos owned by User '" +
					flickrUserName +
					"' (" +
					userId +
					")"
			);
			const photosListRef = usersRef.doc(userId).collection("photos");
			const photosSnapshot = await photosListRef.get();

			const userStats: PhotStat = {
				views: 0,
        faves: 0,
        comments: 0,
			}

			for (const photoDoc of photosSnapshot.docs) {
				log("- - - - - - - - - - - - - - - - -");

				const photoId = photoDoc.id;
				log("Fetching the statistics of photo " + photoId);

				const {
					totalViews = 0,
					totalFaves = 0,
					totalComments = 0,
				} = photoDoc.data();
				log(
					`Current stats for photo ${photoId}: Views -> ${totalViews}, Faves -> ${totalFaves}, Comments -> ${totalComments}`
				);
				const totalPhotoStats: PhotStat = {
					views: totalViews,
					faves: totalFaves,
					comments: totalComments,
				};

				try {
					const newPhotoStats: PhotStat = {
						views: 0,
						faves: 0,
						comments: 0,
					};

					const result = await callFlickrAPI("flickr.photos.getInfo", {
						photo_id: photoId,
					});
					newPhotoStats.views = parseInt(result?.photo?.views, 10);
					newPhotoStats.comments = parseInt(result?.photo?.comments._content, 10);

					const resultFaves = await callFlickrAPI(
						"flickr.photos.getFavorites",
						{
							photo_id: photoId,
							per_page: 1,
						}
					);
					newPhotoStats.faves = parseInt(resultFaves?.photo?.total, 10);
					log(
						`New photo stats: Views -> ${newPhotoStats.views}, Faves -> ${newPhotoStats.faves}, Comments -> ${newPhotoStats.comments}`
					);

					userStats.views += newPhotoStats.views;
					userStats.faves += newPhotoStats.faves;
					userStats.comments += newPhotoStats.comments;

					if (
						totalPhotoStats.views === 0 &&
						totalPhotoStats.faves === 0 &&
						totalPhotoStats.comments === 0
					) {
						log(
							`No pre photo states was saved, Initializing the stats for photo ${photoId} from user '${flickrUserName}'`
						);

						totalPhotoStats.views = newPhotoStats.views;
						totalPhotoStats.faves = newPhotoStats.faves;
						totalPhotoStats.comments = newPhotoStats.comments;

						await photosListRef.doc(photoId).set(
							{
								totalViews: totalPhotoStats.views,
								totalFaves: totalPhotoStats.faves,
								totalComments: totalPhotoStats.comments,
							},
							{ merge: true }
						);
					}

					const todayPhotoStats: PhotStat = {
						views: totalPhotoStats.views - newPhotoStats.views,
						faves: totalPhotoStats.faves - newPhotoStats.faves,
						comments: totalPhotoStats.comments - newPhotoStats.comments,
					};
					const statsRef = photosListRef
						.doc(photoId)
						.collection("history")
						.doc(today);
					await statsRef.set({
						faves: todayPhotoStats.faves,
						comments: todayPhotoStats.comments,
						views: todayPhotoStats.views,
					});

					log(
						`Updated stats for photo ${photoId} from user '${flickrUserName}' for today (${today}).`
					);
				} catch (error) {
					logger.error(
						`${logPrefix} Failed to fetch stats for photo ${photoId}:`,
						error
					);
				}
			}

			usersRef.doc(userId).update({
				totalViews: userStats.views,
				totalFaves: userStats.faves,
				totalComments: userStats.comments,
			});
		}

		log("Flickr Stats Fetcher Cron Job Completed.");
	}
);
