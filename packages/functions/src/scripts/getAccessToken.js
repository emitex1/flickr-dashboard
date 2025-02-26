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

const accessTokenUrl = "https://www.flickr.com/services/oauth/access_token";

async function getAccessToken(oauthToken, oauthVerifier) {
  const requestData = {
    url: accessTokenUrl,
    method: "POST",
    data: { oauth_token: oauthToken, oauth_verifier: oauthVerifier },
  };

  const authHeader = oauth.toHeader(oauth.authorize(requestData));

  try {
    const response = await axios.post(accessTokenUrl, null, {
      headers: { Authorization: authHeader.Authorization },
    });

    console.log("Access Token Response:", response.data);
  } catch (error) {
    console.error("Error getting Access Token:", error);
  }
}

// مقدار `oauth_token` و `oauth_verifier` را بعد از تأیید کاربر وارد کنید
getAccessToken("YOUR_REQUEST_TOKEN", "USER_VERIFIER_CODE");