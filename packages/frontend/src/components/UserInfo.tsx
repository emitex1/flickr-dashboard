import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export const UserInfo: React.FC = () => {
	const { userInfo: user, setUserInfo } = useAuth();

	const handleGoogleLogout = () => {
		signOut(auth)
			.then(() => {
				console.log("User logged out successfully.");
				setUserInfo(null);
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
			<img src={user.photoURL} alt={user.displayName} />
			<span>Welcome, {user.displayName}!</span>
			<span>
				{" "}
				(Last Login Date: {formatDate(user.reloadUserInfo.lastLoginAt)})
			</span>
			<br />
			<button onClick={handleGoogleLogout}>Logout</button>
			<hr />
		</div>
	);
};
