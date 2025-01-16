import { useEffect, useState } from "react";
import { fetchPhotos } from "./api";

const App = () => {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const getPhotos = async () => {
            const userId = import.meta.env.VITE_TARGET_USER_ID;
            if (!userId) throw new Error("TARGET_USER_ID is not defined")

            const photos = await fetchPhotos(userId);
            setPhotos(photos);
        };
        getPhotos();
    }, []);

    return (
        <div>
            <h1>My Flickr Dashboard</h1>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {photos.map((photo: {id: string; server: string; secret: string; title: string}) => (
                    <div key={photo.id} style={{ margin: "10px" }}>
                        <img
                            src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`}
                            alt={photo.title}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
