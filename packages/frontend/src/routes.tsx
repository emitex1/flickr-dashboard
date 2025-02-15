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
import { Index } from "./pages/Index";
import { Photos } from "./pages/Photos";
import { Settings } from "./pages/Settings";
import { WelcomePage } from "./pages/WelcomePage";
import { SetFlickrUser } from "./pages/SetFlickrUser";
import { ReactElement } from "react";

export type RouteType = {
  path: string;
  name: string;
  icon: string;
  component: ReactElement;
  layout: string;
  notInSidebar?: boolean;
}

const routes: RouteType[] = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/user",
  },
  {
    path: "/photos",
    name: "Photos",
    icon: "ni ni-single-02 text-yellow",
    component: <Photos />,
    layout: "/user",
  },
  {
    path: "/set-flickr-user",
    name: "Set Flickr User",
    icon: "ni ni-single-02 text-yellow",
    component: <SetFlickrUser />,
    layout: "/user",
    notInSidebar: true,
  },
  // {
  //   path: "/user-profile",
  //   name: "User Profile",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: <Profile />,
  //   layout: "/user",
  // },
  {
    path: "/settings",
    name: "Settings",
    icon: "ni ni-single-02 text-yellow",
    component: <Settings />,
    layout: "/user",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <WelcomePage />,
    layout: "/auth",
    notInSidebar: true,
  },
  // {
  //   path: "/register",
  //   name: "Register",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: <Register />,
  //   layout: "/auth",
  // },
];
export default routes;
