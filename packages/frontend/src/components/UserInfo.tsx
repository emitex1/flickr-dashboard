import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export const UserInfo: React.FC = () => {
	const { firebaseUser, setFirebaseUser, setFlickrUser } = useAuth();

	if(firebaseUser === null) {
		return <div>User is not logged in.</div>;
	}

	const handleGoogleLogout = () => {
		signOut(auth)
			.then(() => {
				console.log("User logged out successfully.");
				setFlickrUser(undefined);
				setFirebaseUser(null);
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
			<img src={firebaseUser.photoURL} alt={firebaseUser.displayName} />
			<span>Welcome, {firebaseUser.displayName}!</span>
			<span>
				{" "}
				(Last Login Date: {formatDate(firebaseUser.reloadUserInfo.lastLoginAt)})
			</span>
			<button onClick={handleGoogleLogout}>Logout</button>
		</div>
	);
};
