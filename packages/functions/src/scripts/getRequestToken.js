var OAuth = require("oauth-1.0a");
var crypto = require("crypto");
var axios = require("axios");

const API_KEY = "API_KEY";
const API_SECRET = "API_SECRET";

const oauth = OAuth({
  consumer: { key: API_KEY, secret: API_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

const requestTokenUrl = "https://www.flickr.com/services/oauth/request_token";

async function getRequestToken() {
  const requestData = {
    url: requestTokenUrl,
    method: "POST",
    data: { oauth_callback: "oob" },
  };

  const authHeader = oauth.toHeader(oauth.authorize(requestData));

  try {
    const response = await axios.post(requestTokenUrl, null, {
      headers: { Authorization: authHeader.Authorization },
    });

    console.log("Request Token Response:", response.data);
  } catch (error) {
    console.error("Error getting Request Token:", error);
  }
}

getRequestToken();
