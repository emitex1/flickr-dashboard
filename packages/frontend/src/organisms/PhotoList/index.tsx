import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, Row, CardBody, Button, Container, Col } from "reactstrap";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { LoadingIcon } from "../../atoms";
import { useNavigate } from "react-router-dom";
import { showErrorMessage } from "../../util/errorType";
import "./styles.css";

export const PhotoList: React.FC = () => {
	const [photos, setPhotos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const db = getFirestore();
	const { firebaseUser, getFlickrUserName } = useAuth();
	const flickrUserName = getFlickrUserName();
	const navigate = useNavigate();

	const getPhotos = async (userName: string) => {
		try {
			setIsLoading(true);
			setPhotos([]);

			const token = await firebaseUser.getIdToken();
			const response = await axios.get(
				"https://fetchflickrphotos-ag5w5dzqxq-uc.a.run.app",
				{
					params: { userName: userName, isPublic: true },
					headers: {
						"Content-Type": "Application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setPhotos(response.data.photos.photo);

			updatePhotoInfo(response.data.photos.total);
		} catch (error) {
			showErrorMessage(error, "Error Fetching Photos");
		} finally {
			setIsLoading(false);
		}
	};

	const updatePhotoInfo = async (photosCount: number) => {
		const userRef = doc(db, "users", firebaseUser.uid);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			await setDoc(
				userRef,
				{
					photosCount: photosCount,
				},
				{ merge: true }
			);

			console.log("Number of current photos updated successfully.");
		}
	};

	useEffect(() => {
		if (flickrUserName) getPhotos(flickrUserName);
	}, []);

	return (
		<Card className="shadow">
			<CardHeader className="bg-transparent">
				<Row className="align-items-center">
					<div className="col">
						<h6 className="text-uppercase text-muted ls-1 mb-1">
							Photos from Flickr
						</h6>
						<h2 className="mb-0">My Photos</h2>
					</div>
				</Row>
			</CardHeader>
			<CardBody>
				<div
					style={{ display: "flex", flexWrap: "wrap", position: "relative" }}
				>
					{!flickrUserName && (
						<div>
							To view photos, you must have set a Flickr username
							&nbsp;&nbsp;
							<span className="ni ni-curved-next" />
							&nbsp;&nbsp;
							<Button
								color="primary"
								size="sm"
								type="button"
								onClick={() => (navigate("/user/set-flickr-user"))}
							>
								<span>Set Flickr User Name</span>
								&nbsp;&nbsp;
								<span className="ni ni-album-2" />
							</Button>
						</div>
					)}

					{isLoading && <LoadingIcon minHeight={200} />}

					{!isLoading && photos.length == 0 && !!flickrUserName && (
						<div>No photos found</div>
					)}

					<Container>
						<Row>
							{photos.map(
								(photo: {
									id: string;
									server: string;
									secret: string;
									title: string;
								}) => (
									<Col key={photo.id} className="py-2 text-center" xs="6" sm="4" md="4" lg="3" xl="2">
										<img
											src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`}
											// src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`}
											alt={photo.title}
											onClick={() => navigate(`/user/photo/${photo.id}`)}
											className="photo-thumbnail w-100"
										/>
									</Col>
								)
							)}
							</Row>
						</Container>
				</div>
			</CardBody>
		</Card>
	);
};
