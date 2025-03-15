import admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import { checkAuthorization, checkCORS } from "../util/webUtils";
import { getUserId } from "../services";
import { db } from "..";

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
