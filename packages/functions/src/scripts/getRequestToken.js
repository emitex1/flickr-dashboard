var OAuth = require("oauth-1.0a");
var crypto = require("crypto");
var axios = require("axios");
var querystring = require("querystring");

const API_KEY = "API_KEY";
const API_SECRET = "API_SECRET";

const oauth = OAuth({
  consumer: { key: API_KEY, secret: API_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

function generateSignature(method, url, params, consumerSecret, tokenSecret = "") {
  const sortedParams = Object.keys(params).sort().map(key => `${key}=${encodeURIComponent(params[key])}`).join("&");

  const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
  console.log(">>>>> Base String:", baseString);

  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;

  return crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");
}

const requestTokenUrl = "https://www.flickr.com/services/oauth/request_token";

async function getRequestToken() {
  const requestParams = {
    oauth_callback: "oob",
    oauth_consumer_key: API_KEY,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_version: "1.0",
  };
  console.log(">>>>> Request Params:", requestParams);

  // const signature = oauth.authorize(
  //   { method: "GET", url: requestTokenUrl, data: requestParams },
  //   {}
  // ).oauth_signature;
  // console.log(">>>>> Signature:", signature);

  // requestParams.oauth_signature = signature;
  requestParams.oauth_signature = generateSignature("GET", requestTokenUrl, requestParams, API_SECRET);

  try {
    const response = await axios.get(requestTokenUrl, requestParams);

    console.log("✅ Request Token Response:", response.data);

    const responseParams = querystring.parse(response.data);
    console.log("OAuth Token:", responseParams.oauth_token);
    console.log("OAuth Token Secret:", responseParams.oauth_token_secret);
  } catch (error) {
    console.error("Error getting Request Token:", error.response ? error.response.data : error.message);
  }
}

getRequestToken();
