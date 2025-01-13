export const fetchPhotos = async (userId: string) => {
    const FLICKR_API_KEY = import.meta.env.VITE_FLICKR_API_KEY;
    if (!FLICKR_API_KEY) throw new Error("FLICKR_API_KEY is not defined");

    const url = `https://www.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=${FLICKR_API_KEY}&user_id=${userId}&format=json&nojsoncallback=1`;
    const response = await fetch(url);
    const data = await response.json();
    return data.photos.photo;
};
