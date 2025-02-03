import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AdminLayout from "./layouts/Admin";
import AuthLayout from "./layouts/Auth";

import "./assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";

const App: React.FC = () => {
	const { isAuthenticated } = useAuth();

	return (
		<Router>
			<Routes>
				<Route path="/user/*" element={isAuthenticated ? <AdminLayout /> : <Navigate to={"/auth/login"} />} />
				<Route path="/auth/*" element={<AuthLayout />} />
				<Route path="*" element={<Navigate to="/user/index" replace />} />
			</Routes>
		</Router>
	);
};

export default App;
