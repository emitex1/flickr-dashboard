import functions from "firebase-functions";
import axios from "axios";

exports.getData = functions.https.onRequest(async (_req: unknown, res: any) => {
  try {
    const response = await axios.get("https://api.example.com/data");
    res.status(200).send(response.data);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});