import * as logger from "firebase-functions/logger";
import { callFlickrAPI } from "../util/flickrUtils";
import { failResult, successResult } from "../util/generalResult";

export const getUserId = async (flickrUserName: string) => {
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
