import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const FlickrUserPrompt: React.FC = () => {
	const { firebaseUser, flickrUser, setFlickrUser } = useAuth();
  const [userName, setUserName] = useState(flickrUser);
  const db = getFirestore();
	const navigate = useNavigate();

	useEffect(() => {
		if (flickrUser) {
      navigate("/user/index");
    }
	}, [flickrUser]);

  const updateFlickrId = async (flickrId: string) => {
		const userRef = doc(db, "users", firebaseUser.uid);
		await setDoc(userRef, { flickrId: flickrId }, { merge: true });
		console.log("Flickr ID updated successfully.");
		return flickrId;
	};

  const saveInfo = () => {
		if (userName) {
			setFlickrUser(userName);
			updateFlickrId(userName);
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
