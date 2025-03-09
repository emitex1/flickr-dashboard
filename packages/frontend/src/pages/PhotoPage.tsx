import React from "react";
import { Container, Row, Col } from "reactstrap";
import Header from "../organisms/Headers/Header";
import { PhotoDetails } from "../organisms";

export const PhotoPage
: React.FC = () => {
	return (
		<>
			<Header />

			<Container className="mt--7" fluid>
				<Row>
					<Col>
						<PhotoDetails />
					</Col>
				</Row>
			</Container>
		</>
	);
};
