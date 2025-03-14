import axios from "axios";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { PhotoFlickr, PhotoPayload } from "../types/photos";

export const getRecentPhotos = async (token: string) => {
  try {
    // const token = await firebaseUser.getIdToken();
    const response = await axios.get(
      "https://fetchrecentflickrphotos-ag5w5dzqxq-uc.a.run.app/",
      {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.photos;
  } catch (error) {
    console.error(error);			
  }
  return [];
};

export const saveNewPhotos = async (newPhotos: PhotoFlickr[], firebaseUserId: string) => {
  if (newPhotos.length > 0) {
    const db = getFirestore();
    newPhotos.forEach(async (photo: PhotoFlickr) => {
      const photoDetails: PhotoPayload = {
        secret: photo.secret,
        server: photo.server,
        timestamp: new Date().toISOString(),
        title: photo.title,
        totalComments: 0,
        totalFaves: 0,
        totalViews: 0,
      }
      const photoRef = doc(db, "users", firebaseUserId, "photos", photo.id);
      await setDoc(photoRef, photoDetails);
      console.log(`Added photo with id: ${photo.id}`);
    });
  }
};