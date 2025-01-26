import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const FlickrUserPrompt: React.FC = () => {
	const { setFlickrUser } = useAuth();
  const [userName, setUserName] = useState("");
  const db = getFirestore();

  const updateFlickrId = async (flickrId: string) => {
    const { firebaseUser } = useAuth();

		const userRef = doc(db, "users", firebaseUser.uid);
		await setDoc(userRef, { flickrId: flickrId }, { merge: true });
		console.log("Flickr ID updated successfully.");
		return flickrId;
	};

  const saveInfo = () => {
		setFlickrUser(userName);
    updateFlickrId(userName);
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
