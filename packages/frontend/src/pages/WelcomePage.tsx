import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, getFirestore } from "firebase/firestore";
import React, { useEffect } from "react";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export const WelcomePage: React.FC = () => {
	const { setFirebaseUser } = useAuth();
  const db = getFirestore();

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

	// Listen to authentication state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setFirebaseUser(currentUser);
		});

		return () => unsubscribe();
	}, []);

  return (
    <div>
			<h1>My Flickr Dashboard</h1>

			<div>
					<button onClick={handleGoogleLogin}>Login with Google</button>
      </div>
      <p>Welcome to My Flickr Dashboard! This app uses Firebase Authentication and Firestore to fetch and display Flickr photos based on a user's Flickr ID.</p>
    </div>
  )
}