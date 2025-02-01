import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { WelcomePage } from "./pages/WelcomePage";
import { SetFlickrUser } from "./pages/SetFlickrUser";
import { Photos } from "./pages/Photos";
import { Settings } from "./pages/Settings";
import { useAuth } from "./context/AuthContext";
import AdminLayout from "./layouts/Admin";
import AuthLayout from "./layouts/Auth";

import "./assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";

const App: React.FC = () => {
	const { getFlickrUserName, isAuthenticated } = useAuth();
	const flickrUser = getFlickrUserName();

	return (
		<Router>
			<Routes>
				<Route path="/admin/*" element={<AdminLayout />} />
				<Route path="/auth/*" element={<AuthLayout />} />
				<Route path="*" element={<Navigate to="/admin/index" replace />} />
				<Route
					path="/"
					element={
						isAuthenticated ? (
							flickrUser ? (
								<Navigate to="/photos" replace />
							) : (
								<Navigate to="/set-flickr-user" replace />
							)
						) : (
							<WelcomePage />
						)
					}
				/>

				<Route
					path="/set-flickr-user"
					element={
						isAuthenticated ? (
							flickrUser ? (
								<Navigate to="/photos" replace />
							) : (
								<SetFlickrUser />
							)
						) : (
							<Navigate to="/" replace />
						)
					}
				/>

				<Route
					path="/photos"
					element={
						isAuthenticated ? (
							flickrUser ? (
								<Photos />
							) : (
								<Navigate to="/set-flickr-user" replace />
							)
						) : (
							<Navigate to="/" replace />
						)
					}
				/>

				<Route
					path="/settings"
					element={isAuthenticated ? <Settings /> : <Navigate to="/" replace />}
				/>

				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Router>
	);
};

export default App;
