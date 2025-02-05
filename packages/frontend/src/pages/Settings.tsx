import React from "react";
import { FlickrUserPrompt } from "../components/FlickrUserPrompt";
import { Container, Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import Header from "../components/Headers/Header";

export const Settings: React.FC = () => {
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
											Your configuration
										</h6>
										<h2 className="mb-0">Settings</h2>
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
