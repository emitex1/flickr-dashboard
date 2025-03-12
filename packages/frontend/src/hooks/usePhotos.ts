import { useQuery } from "react-query";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Photo } from "../types/photos";

const fetchPhotos = async (userId: string) => {
  if (!userId) return [];
  try {
    const db = getFirestore();
    const photosRef = collection(db, "users", userId, "photos");
    const photoDocs = await getDocs(photosRef);
    return photoDocs.docs.map(photoDoc => ({ ...photoDoc.data(), id: photoDoc.id } as Photo));
  } catch (error: unknown) {
    console.error("Error Fetching Photos: ", (error as Error).message);
    return [] as Photo[];
  }
};

export const usePhotos = (firebaseUserId: string) => {
  return useQuery({
    queryKey: ["photos", firebaseUserId],
    queryFn: () => fetchPhotos(firebaseUserId),
    enabled: !!firebaseUserId,
  });
};
