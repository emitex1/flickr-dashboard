import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingIcon from "./LoadingIcon";

export const FlickrUserPrompt: React.FC = () => {
	const { firebaseUser, flickrUserName, setFlickrUser } = useAuth();
	const [userName, setUserName] = useState(flickrUserName);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const saveInfo = async () => {
		if (userName) {
			setIsLoading(true);
			const token = await firebaseUser.getIdToken();
			await axios.get("https://checkflickrusername-ag5w5dzqxq-uc.a.run.app", {
				params: { userName: userName },
				headers: {
					"Content-Type": "Application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			// const flickrUserId = response.data.flickrUserId;
			setFlickrUser(userName);
			setIsLoading(false);
			navigate("/user/index");
		}
	};

	return (
		<div style={{ position: "relative" }}>
			{isLoading && <LoadingIcon minHeight={100} />}

			<input
				type="text"
				placeholder="User Name"
				value={userName}
				onChange={(e) => setUserName(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && saveInfo()}
			/>
			<button onClick={saveInfo}>Save</button>
		</div>
	);
};
