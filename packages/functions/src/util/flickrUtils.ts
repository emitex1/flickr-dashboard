import * as logger from "firebase-functions/logger";
import * as dotenvContent from "dotenv";
import axios from "axios";

const getFlickrAPIKey = () => {
	dotenvContent.config();
	const apiKey = process.env.FLICKR_API_KEY;
	logger.info("Flickr API Key is available.");
	if (!apiKey) throw new Error("Flickr API Key is not defined");
	return apiKey;
};

export const callFlickrAPI = async (method: string, otherParams?: object) => {
	const url = "https://www.flickr.com/services/rest/";
	const api_key = getFlickrAPIKey();
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
	} else if (data.stat === "fail") {
		logger.log("Failure:", data.message);
		return null;
	} else {
		logger.log("Error:", data);
		return null;
	}
};
