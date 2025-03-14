import axios from "axios";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { Photo } from "../types/photos";

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

export const saveNewPhotos = async (newPhotos: Photo[], firebaseUserId: string) => {
  if (newPhotos.length > 0) {
    const db = getFirestore();
    const photosRef = collection(db, "users", firebaseUserId, "photos");
    newPhotos.forEach(async (photo: { id: string; title: string; server: string; secret: string }) => {
      const result = await addDoc(photosRef, photo);
      console.log(`Added photo with ID: ${result.id}`);
    });
  }
};