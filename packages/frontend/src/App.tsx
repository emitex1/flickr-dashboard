import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
	const [photos, setPhotos] = useState([]);

	useEffect(() => {
		const getPhotos = async () => {
			try {
				const userId = import.meta.env.VITE_TARGET_USER_ID;
				if (!userId) throw new Error("TARGET_USER_ID is not defined");
				console.log('user id is ' + userId);

				const response = await axios.get("https://fetchflickrphotos-ys2zam5ckq-uc.a.run.app?userId=" + userId, {
						params: { tags: "nature" },
				});
				setPhotos(response.data.photos.photo);
			} catch (error) {
				console.error("Error fetching photos:", error);
			}
		};
		getPhotos();
	}, []);

	return (
		<div>
			<h1>My Flickr Dashboard</h1>
			<div style={{ display: "flex", flexWrap: "wrap" }}>
				{photos.map(
					(photo: {
						id: string;
						server: string;
						secret: string;
						title: string;
					}) => (
						<div key={photo.id} style={{ margin: "10px" }}>
							<img
								src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`}
								// src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`}
								alt={photo.title}
							/>
						</div>
					)
				)}
			</div>
		</div>
	);
};

export default App;
