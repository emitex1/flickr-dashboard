import React from "react";
import { Container, Row, Col } from "reactstrap";
import Header from "../organisms/Headers/Header";
import { PhotoList } from "../organisms";

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
