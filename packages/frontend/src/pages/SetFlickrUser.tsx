import React, { useEffect } from "react";
import { FlickrUserPrompt } from "../components/FlickrUserPrompt";
import { Container, Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import Header from "../components/Headers/Header";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const SetFlickrUser: React.FC = () => {
	const { flickrUser } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (flickrUser) {
      navigate("/user/index");
    }
	}, [flickrUser]);

	return (
		<>
			<Header />

			<Container className="mt--7" fluid>
				<Row>
					<Col>
						<Card className="shadow">
							<CardHeader className="bg-transparent">
								<Row className="align-items-center">
									<div className="col">
										<h6 className="text-uppercase text-muted ls-1 mb-1">
											You signed up successfully.
										</h6>
										<h2 className="mb-0">Welcome to Flickr Dashboard</h2>
									</div>
								</Row>
							</CardHeader>
							<CardBody>
								<FlickrUserPrompt />
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
};
