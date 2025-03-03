import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, Row, CardBody } from "reactstrap";
import { useAuth } from "../../context/AuthContext";
import { LoadingIcon } from "../LoadingIcon";
import { showErrorMessage } from "../../util/errorType";

export const Photo: React.FC = () => {
	const [photo, setPhoto] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const { firebaseUser, flickrUserName } = useAuth();

	const getPhotos = async (userName: string) => {
		try {
			setIsLoading(true);
			setPhoto(undefined);

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
			setPhoto(response.data.photos.photo[0]);

		} catch (error) {
			showErrorMessage(error, "Error Fetching Photos");
		} finally {
			setIsLoading(false);
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
						<h2 className="mb-0">Photo X</h2>
					</div>
				</Row>
			</CardHeader>
			<CardBody>
				<div
					style={{ display: "flex", flexWrap: "wrap", position: "relative" }}
				>
					{isLoading && <LoadingIcon minHeight={200} />}

					{!isLoading && !!photo && !!flickrUserName && (
						<div>No photo found</div>
					)}

          Photo X
				</div>
			</CardBody>
		</Card>
	);
};
