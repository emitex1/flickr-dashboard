import { db } from "..";

export const readCurrentUserFlickrId = async (currentUserId: string) => {
  const userRef = db.collection("users").doc(currentUserId);
  const flickrUserId = await userRef
    .get()
    .then((doc) => doc.data()?.flickrUserId);
  if (!flickrUserId) throw new Error("Flickr User ID not found in Firestore.");
  return flickrUserId;
};
