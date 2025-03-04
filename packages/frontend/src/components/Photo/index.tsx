import React, { useEffect, useState } from "react";
import { Card, CardHeader, Row, CardBody } from "reactstrap";
import { useAuth } from "../../context/AuthContext";
import { LoadingIcon } from "../LoadingIcon";
import { showErrorMessage } from "../../util/errorType";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useParams } from "react-router-dom";

type Photo = {
	secret: string,
	server: string,
	timestamp: string,
	title: string,
	totalComments: number,
	totalFaves : number,
	totalViews : number,
}
export const PhotoPage: React.FC = () => {
	const [photo, setPhoto] = useState<Photo | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { firebaseUser } = useAuth();
  const db = getFirestore();
	const { id } = useParams();

	const getPhoto = async (photoId: string) => {
		try {
			setIsLoading(true);
			setPhoto(null);

			const photoRef = doc(db, "users", firebaseUser.uid, "photos", photoId);
			const photoDoc = await getDoc(photoRef);

			if (photoDoc.exists()) {
        const photoObj = photoDoc.data() as Photo;
				setPhoto(photoObj);
			} else {
				showErrorMessage("Photo not found", "Error Fetching Photos");
			}
		} catch (error) {
			showErrorMessage(error, "Error Fetching Photos");
		}
    setIsLoading(false);
	};

	useEffect(() => {
		if (id) getPhoto(id);
	}, [id]);

	if (!photo) return <></>;

	return (
		<Card className="shadow">
			<CardHeader className="bg-transparent">
				<Row className="align-items-center">
					<div className="col">
						<h6 className="text-uppercase text-muted ls-1 mb-1">
							Photo from Flickr
						</h6>
						<h2 className="mb-0">{photo.title}</h2>
					</div>
				</Row>
			</CardHeader>
			<CardBody>
				<div
					style={{ display: "flex", flexWrap: "wrap", position: "relative" }}
				>
					{isLoading && <LoadingIcon minHeight={200} />}

					{!isLoading && !photo.secret && (
						<div>No photo found</div>
					)}

					<img
						src={`https://live.staticflickr.com/${photo.server}/${id}_${photo.secret}_b.jpg`}
						alt="Flickr"
					/>
				</div>
			</CardBody>
		</Card>
	);
};
