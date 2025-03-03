/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	FormGroup,
	Form,
	Input,
	Container,
	Row,
	Col,
} from "reactstrap";
// core components
import UserHeader from "../components/Headers/UserHeader.js";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { showErrorMessage } from "../util/errorType.js";
import { useAuth } from "../context/AuthContext.js";
import { UserType } from "../util/user.js";

export const Profile: React.FC = () => {
	const db = getFirestore();
	const { firebaseUser } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);

	const getUserInfo = async (user: User) => {
		if (!user) return;

		const userRef = doc(db, "users", user.uid);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			setUser(userDoc.data() as UserType);
		} else {
			showErrorMessage("Error in saving user info in DB");
		}
	};

	useEffect(() => {
		getUserInfo(firebaseUser);
	}, [firebaseUser]);

	return (
		<>
			<UserHeader user={user!} />

			<Container className="mt--7" fluid>
				<Row>
					<Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
						<Card className="card-profile shadow">
							<Row className="justify-content-center">
								<Col className="order-lg-2" lg="3">
									<div className="card-profile-image">
										<a href="#pablo" onClick={(e) => e.preventDefault()}>
											<img alt={user?.name} className="rounded-circle" src={user?.photoURL} />
										</a>
									</div>
								</Col>
							</Row>
							<CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
								<div className="d-flex justify-content-between">
									<Button
										className="mr-4"
										color="info"
										href="#pablo"
										onClick={(e) => e.preventDefault()}
										size="sm"
									>
										Connect
									</Button>
									<Button
										className="float-right"
										color="default"
										href="#pablo"
										onClick={(e) => e.preventDefault()}
										size="sm"
									>
										Message
									</Button>
								</div>
							</CardHeader>
							<CardBody className="pt-0 pt-md-4">
								<Row>
									<div className="col">
										<div className="card-profile-stats d-flex justify-content-center mt-md-5">
											<div>
												<span className="heading">22</span>
												<span className="description">Friends</span>
											</div>
											<div>
												<span className="heading">10</span>
												<span className="description">Photos</span>
											</div>
											<div>
												<span className="heading">89</span>
												<span className="description">Comments</span>
											</div>
										</div>
									</div>
								</Row>
								<div className="text-center">
									<h3>
										{user?.name}
										<span className="font-weight-light">, 39</span>
									</h3>
									<div className="h5 font-weight-300">
										<i className="ni location_pin mr-2" />
										Berlin, Germany
									</div>
									<div className="h5 mt-4">
										<i className="ni business_briefcase-24 mr-2" />
										Photographer - EmArTx Co.
									</div>
									<div>
										<i className="ni education_hat mr-2" />
										University of Computer Science
									</div>
									<hr className="my-4" />
									<p>
										Ryan — the name taken by Melbourne-raised, Brooklyn-based
										Nick Murphy — writes, performs and records all of his own
										music.
									</p>
									<a href="#pablo" onClick={(e) => e.preventDefault()}>
										Show more
									</a>
								</div>
							</CardBody>
						</Card>
					</Col>
					<Col className="order-xl-1" xl="8">
						<Card className="bg-secondary shadow">
							<CardHeader className="bg-white border-0">
								<Row className="align-items-center">
									<Col xs="8">
										<h3 className="mb-0">My account</h3>
									</Col>
									<Col className="text-right" xs="4">
										<Button
											color="primary"
											href="#pablo"
											onClick={(e) => e.preventDefault()}
											size="sm"
										>
											Settings
										</Button>
									</Col>
								</Row>
							</CardHeader>
							<CardBody>
								<Form>
									<h6 className="heading-small text-muted mb-4">
										User information
									</h6>
									<div className="pl-lg-4">
										<Row>
											<Col lg="6">
												<FormGroup>
													<label
														className="form-control-label"
														htmlFor="input-username"
													>
														User ID
													</label>
													<Input
														className="form-control-alternative"
														value={user?.uid}
														id="input-username"
														placeholder="User ID"
														type="text"
                            disabled
													/>
												</FormGroup>
											</Col>
											<Col lg="6">
												<FormGroup>
													<label
														className="form-control-label"
														htmlFor="input-email"
													>
														Email address
													</label>
													<Input
														className="form-control-alternative"
														id="input-email"
														placeholder="jesse@example.com"
														type="email"
                            value={user?.email}
													/>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col lg="6">
												<FormGroup>
													<label
														className="form-control-label"
														htmlFor="input-first-name"
													>
														First name
													</label>
													<Input
														className="form-control-alternative"
														value={user?.name.split(' ')[0] || ''}
														id="input-first-name"
														placeholder="First name"
														type="text"
													/>
												</FormGroup>
											</Col>
											<Col lg="6">
												<FormGroup>
													<label
														className="form-control-label"
														htmlFor="input-last-name"
													>
														Last name
													</label>
													<Input
														className="form-control-alternative"
														value={user?.name.split(' ')[1] || ''}
														id="input-last-name"
														placeholder="Last name"
														type="text"
													/>
												</FormGroup>
											</Col>
										</Row>
									</div>
									<hr className="my-4" />
									{/* Description */}
									<h6 className="heading-small text-muted mb-4">About me</h6>
									<div className="pl-lg-4">
										<FormGroup>
											<label>About Me</label>
											<Input
												className="form-control-alternative"
												placeholder="A few words about you ..."
												rows="4"
												defaultValue="A beautiful Dashboard for Bootstrap 4. It is Free and
                        Open Source."
												type="textarea"
											/>
										</FormGroup>
									</div>
								</Form>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
};
