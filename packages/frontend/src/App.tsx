import { useEffect, useState } from "react";
import axios from "axios";
import {
	GoogleAuthProvider,
	signInWithPopup,
	onAuthStateChanged,
	signOut,
	User,
} from "firebase/auth";
import {
	doc,
	setDoc,
	getFirestore,
	serverTimestamp,
	getDoc,
} from "firebase/firestore";
import { auth } from "./firebase";

const App = () => {
	const [photos, setPhotos] = useState([]);
	const [userName, setUserName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useState<any>(null);

	const db = getFirestore();

	const getPhotos = async () => {
		try {
			setIsLoading(true);
			setPhotos([]);
			console.log("User Name is " + userName);

			const response = await axios.get(
				"https://fetchflickrphotos-ag5w5dzqxq-uc.a.run.app",
				{
					params: { userName: userName, isPublic: true },
				}
			);
			setPhotos(response.data.photos.photo);

			updateFlickrId(userName);
		} catch (error) {
			console.error("Error fetching photos:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const updateFlickrId = async (flickrId: string) => {
		const userRef = doc(db, "users", user.uid);
		await setDoc(userRef, { flickrId: flickrId }, { merge: true });
		console.log("Flickr ID updated successfully.");
		return flickrId;
	};

	const readFlickrId = async (userId: string) => {
		const userRef = doc(db, "users", userId);
		const userSnap = await getDoc(userRef);
		if (userSnap.exists()) {
			const user = userSnap.data();
			console.log("Flickr ID:", user.flickrId);
			setUserName(user.flickrId);
		} else {
			console.log("User not found in Firestore.");
		}
	};

	useEffect(() => {
		if (user) readFlickrId(user.uid);
		else setUserName("");
	}, [user]);

	// Listen to authentication state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});

		return () => unsubscribe();
	}, []);

	// Handle Google login
	const handleGoogleLogin = async () => {
		const provider = new GoogleAuthProvider();
		try {
			const result = await signInWithPopup(auth, provider);
			console.log("User Info:", result.user);

			saveOrUpdateUser(result.user);
		} catch (error: any) {
			console.error("Login Error:", error.message);
		}
	};

	const saveOrUpdateUser = async (user: User) => {
		if (!user) return;

		const userRef = doc(db, "users", user.uid);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			await setDoc(
				userRef,
				{
					lastLogin: new Date(),
				},
				{ merge: true }
			);

			console.log("Last login date updated successfully.");
		} else {
			const userData = {
				uid: user.uid,
				name: user.displayName,
				email: user.email,
				photoURL: user.photoURL,
				createdAt: serverTimestamp(),
			};

			try {
				await setDoc(userRef, userData, { merge: true }); // merge: true ensures not to overwrite existing data
				console.log("User info saved successfully:", userData);
			} catch (error) {
				console.error("Error in saving user info in DB:", error);
			}
		}
	};

	const handleGoogleLogout = () => {
		signOut(auth)
			.then(() => {
				console.log("User logged out successfully.");
				setUser(null);
			})
			.catch((error: any) => {
				console.error("Logout Error:", error.message);
			});
	};

	const formatDate = (timestamp: string) => {
		const date = new Date(parseInt(timestamp) * 1);
		return date.toLocaleString();
	};

	return (
		<div>
			<h1>My Flickr Dashboard</h1>

			<div>
				{!user ? (
					<button onClick={handleGoogleLogin}>Login with Google</button>
				) : (
					<div>
						<img src={user.photoURL} alt={user.displayName} />
						<span>Welcome, {user.displayName}!</span>
						<span>
							{" "}
							(Last Login Date: {formatDate(user.reloadUserInfo.lastLoginAt)})
						</span>
						<br />
						<button onClick={handleGoogleLogout}>Logout</button>
						<hr />

						<div>
							<input
								type="text"
								placeholder="User Name"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && getPhotos()}
							/>
							<button onClick={getPhotos}>Fetch Photos</button>
						</div>

						<div style={{ display: "flex", flexWrap: "wrap" }}>
							{isLoading && <div>Loading...</div>}

							{!userName && <div>Enter a user name to fetch the photos.</div>}

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
				)}
			</div>
		</div>
	);
};

export default App;
