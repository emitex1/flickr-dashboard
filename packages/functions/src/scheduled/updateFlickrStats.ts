import * as functionsV2 from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import { callFlickrAPI } from "../util/flickrUtils";
import { db } from "..";
import { PhotStat } from "../util/types";

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
