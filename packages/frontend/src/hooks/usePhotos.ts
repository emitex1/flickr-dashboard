import { useQuery } from "react-query";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const fetchPhotos = async (userId: string) => {
  if (!userId) return [];
  try {
    const db = getFirestore();
    const photosRef = collection(db, "users", userId, "photos");
    const photoDocs = await getDocs(photosRef);
    return photoDocs.docs.map(photoDoc => ({ ...photoDoc.data(), id: photoDoc.id }));
  } catch (error: unknown) {
    throw new Error("Error Fetching Photos: " + (error as Error)?.message);
  }
};

export const usePhotos = (firebaseUserId: string) => {
  return useQuery({
    queryKey: ["photos", firebaseUserId],
    queryFn: () => fetchPhotos(firebaseUserId),
    enabled: !!firebaseUserId,
  });
};
