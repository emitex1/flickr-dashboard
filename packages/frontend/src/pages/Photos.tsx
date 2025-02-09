import React from "react";
import { Container, Row, Col } from "reactstrap";
import Header from "../components/Headers/Header";
import { PhotoList } from "../components/PhotoList";

export const Photos: React.FC = () => {
	return (
		<>
			<Header displayStats />

			<Container className="mt--7" fluid>
				<Row>
					<Col>
						<PhotoList />
					</Col>
				</Row>
			</Container>
		</>
	);
};
