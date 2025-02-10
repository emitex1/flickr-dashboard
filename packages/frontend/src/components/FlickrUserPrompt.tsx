import { getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const FlickrUserPrompt: React.FC = () => {
	const { firebaseUser, flickrUser, setFlickrUser } = useAuth();
  const [userName, setUserName] = useState(flickrUser);
  const db = getFirestore();
	const navigate = useNavigate();

  const saveInfo = async () => {
		if (userName) {
			const token = await firebaseUser.getIdToken();
			console.log('token=', token);
			console.log('accessToken=', firebaseUser.accessToken);
			const response = await axios.get(
				"https://checkflickrusername-ag5w5dzqxq-uc.a.run.app",
				{
					params: { userName: userName },
					headers: {
						"Content-Type": "Application/json",
						"Authorization": `Bearer ${firebaseUser.accessToken}`,
					},
				}
			);
			const flickrUserId = response.data.flickrUserId;
			setFlickrUser(userName);
			navigate('/user/index');
		}
  }

	return (
		<div>
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
