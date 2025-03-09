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
import React from "react";
import { useLocation } from "react-router-dom";
// reactstrap components
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Container,
	Row,
} from "reactstrap";
// core components
import Header from "../Headers/Header";
import "./privacy_policy_styles.css";

export const PrivacyPolicy = () => {
	const location = useLocation();

	React.useEffect(() => {
		document.documentElement.scrollTop = 0;
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		document.scrollingElement && (document.scrollingElement.scrollTop = 0);
	}, [location]);

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
											Last Update: 16 Feb 2025
										</h6>
										<h2 className="mb-0">Privacy Policy</h2>
									</div>
								</Row>
							</CardHeader>
							<CardBody>
								<div className="section">
									<h2>1. Information We Collect</h2>
									<p>We collect and process the following personal data:</p>
									<ul>
										<li>Email Address (Required for account creation)</li>
										<li>Full Name (Optional)</li>
										<li>Flickr Username</li>
										<li>Flickr User ID</li>
										<li>Flickr Photos (IDs of uploaded photos)</li>
										<li>Number of Photos on Flickr</li>
										<li>Flickr Statistics (views, favorites, comments)</li>
									</ul>
									<p>
										We do not collect passwords or other sensitive
										authentication data from your Flickr account. We only access
										publicly available information from your Flickr profile,
										with your explicit consent.
									</p>
									<a className="back-to-top" href="#top">
										Back to top
									</a>
								</div>

								<div className="section">
									<h2>2. How We Use Your Data</h2>
									<p>
										We use your data for account management, service
										improvement, and security.
									</p>
									<a className="back-to-top" href="#top">
										Back to top
									</a>
								</div>

								<div className="section">
									<h2>3. Legal Basis for Processing</h2>
									<p>
										We process data based on consent and legitimate interests.
									</p>
									<a className="back-to-top" href="#top">
										Back to top
									</a>
								</div>

								<div className="section">
									<h2>4. Your Rights Under GDPR</h2>
									<ul>
										<li>Right to Access</li>
										<li>Right to Rectification</li>
										<li>Right to Erasure</li>
										<li>Right to Data Portability</li>
									</ul>
									<a className="back-to-top" href="#top">
										Back to top
									</a>
								</div>

								<div className="section">
									<h2>5. Data Security</h2>
									<p>
										We use encryption, HTTPS, and restricted access to secure
										your data.
									</p>
									<a className="back-to-top" href="#top">
										Back to top
									</a>
								</div>

								<div className="section">
									<h2>6. Cookies and Tracking Technologies</h2>
									<p>
										Currently, we do not use cookies or tracking technologies.
										If this changes in the future, we will update this policy
										and request your consent before implementing them.
									</p>
									<a className="back-to-top" href="#top">
										Back to top
									</a>
								</div>

								<div className="section">
									<h2>7. Third-Party Services</h2>
									<p>
										We integrate with Flickr to provide services. However, we do
										not store your Flickr password or any sensitive
										authentication data. Your Flickr data is handled according
										to Flickr’s privacy policies.
									</p>
									<a className="back-to-top" href="#top">
										Back to top
									</a>
								</div>

								<div className="section">
									<h2>8. Contact Us</h2>
									<p>
										If you have any questions, contact us at:{" "}
										{/* <a href="mailto:contact@armoun.com">contact@armoun.com</a> */}
										<a href="mailto:emad.armoun@gmail.com">
											emad.armoun@gmail.com
										</a>
									</p>
									<a className="back-to-top" href="#top">
										Back to top
									</a>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
};
