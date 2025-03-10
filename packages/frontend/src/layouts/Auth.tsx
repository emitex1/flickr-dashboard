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
import { Container, Row, Col } from "reactstrap";

// core components
import AuthNavbar from "../organisms/Navbars/AuthNavbar";
import AuthFooter from "../organisms/Footers/AuthFooter";

import routes, { RouteType } from "../routes";
import flickrDashboardLogo from "../assets/img/brand/white_logo.png";

const Auth = () => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.body.classList.add("bg-default");
    return () => {
      document.body.classList.remove("bg-default");
    };
  }, []);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    document.scrollingElement && (document.scrollingElement.scrollTop = 0);
    // mainContent.current && (mainContent.current.scrollTop = 0);
  }, [location]);

  const getRoutes = (routes: RouteType[]) => {
    return routes.map((prop: RouteType, key: number) => {
      if (prop.layout === "/auth") {
        return (
          // <Route path={prop.path} element={prop.component} key={key} exact />
          <Route path={prop.path} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <div className="main-content" ref={mainContent}>
        <AuthNavbar />
        <div className="header bg-gradient-info py-4 py-lg-7">
          <Container>
            <div className="header-body text-center mb-5">
              <Row className="justify-content-center">
                <Col lg="5" md="6">
                  <img src={flickrDashboardLogo} alt="Flickr Dashboard" />
                  <p className="text-lead text-light">
                    Welcome to My Flickr Dashboard!
                  </p>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
        {/* Page content */}
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Routes>
              {getRoutes(routes)}
              <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Routes>
          </Row>
        </Container>
      </div>
      <AuthFooter />
    </>
  );
};

export default Auth;
