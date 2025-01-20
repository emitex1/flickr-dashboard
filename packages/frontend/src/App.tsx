import { useState } from "react";
import axios from "axios";

const App = () => {
	const [photos, setPhotos] = useState([]);
	const [userName, setUserName] = useState("");

	const getPhotos = async () => {
		try {
			console.log("User Name is " + userName);

			const response = await axios.get(
				"https://fetchflickrphotos-ag5w5dzqxq-uc.a.run.app",
				{
					params: { userName: userName, isPublic: true },
				}
			);
			setPhotos(response.data.photos.photo);
		} catch (error) {
			console.error("Error fetching photos:", error);
		}
	};

	return (
		<div>
			<h1>My Flickr Dashboard</h1>

			<div>
				<input
					type="text"
					placeholder="User Name"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
				/>
				<button onClick={getPhotos}>Fetch Photos</button>
			</div>
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
