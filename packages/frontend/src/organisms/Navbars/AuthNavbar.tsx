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
import { Link } from "react-router-dom";
// reactstrap components
import {
	UncontrolledCollapse,
	NavbarBrand,
	Navbar,
	Container,
	Row,
	Col,
} from "reactstrap";
import flickrDashboardWideLogo from "../../assets/img/brand/wide_white_logo.png";
import argonReactLogo from "../../assets/img/brand/argon-react.png";

const AuthNavbar = () => {
	return (
		<>
			<Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
				<Container className="px-4">
					<NavbarBrand to="/" tag={Link}>
						<img alt="..." src={flickrDashboardWideLogo} />
					</NavbarBrand>
					<button className="navbar-toggler" id="navbar-collapse-main">
						<span className="navbar-toggler-icon" />
					</button>
					<UncontrolledCollapse navbar toggler="#navbar-collapse-main">
						<div className="navbar-collapse-header d-md-none">
							<Row>
								<Col className="collapse-brand" xs="6">
									<Link to="/">
										<img alt="..." src={argonReactLogo} />
									</Link>
								</Col>
								<Col className="collapse-close" xs="6">
									<button className="navbar-toggler" id="navbar-collapse-main">
										<span />
										<span />
									</button>
								</Col>
							</Row>
						</div>
						{/* Navbar Placeholder */}
						{/* <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink className="nav-link-icon" to="/" tag={Link}>
                  <i className="ni ni-planet" />
                  <span className="nav-link-inner--text">Dashboard</span>
                </NavLink>
              </NavItem>
            </Nav> */}
					</UncontrolledCollapse>
				</Container>
			</Navbar>
		</>
	);
};

export default AuthNavbar;
