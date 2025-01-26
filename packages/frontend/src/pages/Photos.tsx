import React, { useEffect, useState } from "react";
import { UserInfo } from "../components/UserInfo";
import axios from "axios";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export const Photos: React.FC = ({}) => {
	const [photos, setPhotos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [userName, setUserName] = useState("");
	const db = getFirestore();

	const { firebaseUser } = useAuth();

	const getPhotos = async (userName: string) => {
		try {
			setIsLoading(true);
			setPhotos([]);

			const response = await axios.get(
				"https://fetchflickrphotos-ag5w5dzqxq-uc.a.run.app",
				{
					params: { userName: userName, isPublic: true },
				}
			);
			setPhotos(response.data.photos.photo);

			// updateFlickrId(userName);
		} catch (error) {
			console.error("Error fetching photos:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const readFlickrId = async (userId: string) => {
		const userRef = doc(db, "users", userId);
		const userSnap = await getDoc(userRef);
		if (userSnap.exists()) {
			const user = userSnap.data();
			console.log("Flickr ID:", user.flickrId);
			setUserName(user.flickrId);
			return user.flickrId;
		} else {
			console.log("User not found in Firestore.");
		}
	};

	// useEffect(() => {
	// 	if (user) readFlickrId(user.uid);
	// 	else setUserName("");
	// }, [user]);

	useEffect(() => {
		// readFlickrId(user.uid);
		readFlickrId(firebaseUser.uid).then((flickrId: string) => {
			getPhotos(flickrId);
		});
	}, []);

	return (
		<div>
			<h1>My Photos</h1>
			<br />

			<UserInfo />
			<div style={{ display: "flex", flexWrap: "wrap" }}>
				{isLoading && <div>Loading...</div>}

				{/* {!userName && <div>Enter a user name to fetch the photos.</div>} */}

				{!isLoading && !!userName && photos.length == 0 && (
					<div>No photos found</div>
				)}

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
