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
// import Index from "views/Index.js";
import { Photos } from "./pages/Photos";
import { Settings } from "./pages/Settings";
import { WelcomePage } from "./pages/WelcomePage";
import { SetFlickrUser } from "./pages/SetFlickrUser";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    // component: <Index />,
    component: <Photos />,
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
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: <Tables />,
  //   layout: "/user",
  // },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <WelcomePage />,
    // component: <div>Emad</div>,
    layout: "/auth",
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
