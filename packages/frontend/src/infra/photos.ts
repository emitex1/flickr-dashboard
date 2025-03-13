import axios from "axios";

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