/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { collection, getDocs } from "firebase/firestore";

const fetchPhotos = async (db: any, userId: any) => {
  if (!userId) return [];
  try {
    const photosRef = collection(db, "users", userId, "photos");
    const photoDocs = await getDocs(photosRef);
    return photoDocs.docs.map(photoDoc => ({ ...photoDoc.data(), id: photoDoc.id }));
  } catch (error: any) {
    throw new Error("Error Fetching Photos: " + error?.message);
  }
};

const usePhotos = (db: any, firebaseUser: any) => {
  return useQuery({
    queryKey: ["photos", firebaseUser?.uid],
    queryFn: () => fetchPhotos(db, firebaseUser?.uid),
    enabled: !!firebaseUser?.uid, // فقط وقتی uid موجود باشد درخواست اجرا می‌شود
  });
};

export default usePhotos;
