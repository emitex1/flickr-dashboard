import admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as functionsV2 from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import { failResult, successResult } from "./util/generalResult";
import { checkAuthorization, checkCORS } from "./util/webUtils";
import { callFlickrAPI } from "./util/flickrUtils";

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

export const saveFlickrPhotos = functionsV2.onSchedule(
	"every day 05:00",
	async () => {
		const logPrefix = "[UpdatePhotos]";
		const log = (message: string) => logger.info(logPrefix, message);

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
					`Current stats for photo ${photoId}: Views -> ${totalViews}, Comments -> ${totalComments}, Faves -> ${totalFaves}`
				);

				try {
					const result = await callFlickrAPI("flickr.photos.getInfo", {
						photo_id: photoId,
					});
					const photoComments = parseInt(result?.photo?.comments._content, 10);
					const photoViews = parseInt(result?.photo?.views, 10);

					const resultFaves = await callFlickrAPI(
						"flickr.photos.getFavorites",
						{
							photo_id: photoId,
							per_page: 1,
						}
					);
					const photoFaves = parseInt(resultFaves?.photo?.total, 10);
					log(
						`New photo stats: Views -> ${photoViews}, Faves -> ${photoFaves}, Comments -> ${photoComments}`
					);

					const totalPhotoStats = {
						views: totalViews,
						favorites: totalFaves,
						comments: totalComments,
					};

					const newPhotoStats = {
						views: photoViews,
						favorites: photoFaves,
						comments: photoComments,
					};

					if (
						totalPhotoStats.views === 0 &&
						totalPhotoStats.favorites === 0 &&
						totalPhotoStats.comments === 0
					) {
						log(
							`No pre photo states was saved, Initializing the stats for photo ${photoId} from user '${flickrUserName}'`
						);

						totalPhotoStats.views = newPhotoStats.views;
						totalPhotoStats.favorites = newPhotoStats.favorites;
						totalPhotoStats.comments = newPhotoStats.comments;

						await photosListRef.doc(photoId).set(
							{
								totalViews: totalPhotoStats.views,
								totalFaves: totalPhotoStats.favorites,
								totalComments: totalPhotoStats.comments,
							},
							{ merge: true }
						);
						continue;
					}

					const todayPhotoStats = {
						views: totalPhotoStats.views - newPhotoStats.views,
						favorites: totalPhotoStats.favorites - newPhotoStats.favorites,
						comments: totalPhotoStats.comments - newPhotoStats.comments,
					};
					const statsRef = photosListRef
						.doc(photoId)
						.collection("history")
						.doc(today);
					await statsRef.set({
						likes: todayPhotoStats.favorites,
						comments: todayPhotoStats.comments,
						views: todayPhotoStats.views,
						updatedAt: new Date().toISOString(),
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
		}

		log("Flickr Stats Fetcher Cron Job Completed.");
	}
);
