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
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "../components/Navbars/AdminNavbar";
import AdminFooter from "../components/Footers/AdminFooter";
import Sidebar from "../components/Sidebar/Sidebar";
import argonReactLogo from "../assets/img/brand/argon-react.png";
import { useAuth } from "../context/AuthContext";

import routes from "../routes";

const Admin = (props: any) => {
	const mainContent = React.useRef(null);
	const location = useLocation();
	const { getFlickrUserName } = useAuth();
	const flickrUser = getFlickrUserName();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement && (document.scrollingElement.scrollTop = 0);
    // mainContent.current && (mainContent.current.scrollTop = 0);
  }, [location]);

  const getRoutes = (routes: any) => {
    return routes.map((prop: any, key: any) => {
      if (prop.layout === "/user") {
        return (
          // <Route path={prop.path} element={prop.component} key={key} exact />
          <Route path={prop.path} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (_path: any) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

	return (
		<>
			<Sidebar
				{...props}
				routes={routes}
				logo={{
					innerLink: "/user/index",
					imgSrc: argonReactLogo,
					imgAlt: "...",
				}}
			/>
			<div className="main-content" ref={mainContent}>
				<AdminNavbar
					{...props}
					brandText={getBrandText(props?.location?.pathname)}
				/>
				<Routes>
					{getRoutes(routes)}
					<Route
						path="*"
						element={
							flickrUser ? (
								<Navigate to="/user/index" replace />
							) : (
								<Navigate to="/user/set-flickr-user" replace />
							)
						}
					/>
				</Routes>
				<Container fluid>
					<AdminFooter />
				</Container>
			</div>
		</>
	);
};

export default Admin;
