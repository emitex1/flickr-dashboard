import flickrDashboardLogo from "../../assets/img/brand/blue_logo.png";
import "./styles.css";

const LoadingIcon = ({ minHeight = 50 }) => {
	const background = {
		position: "absolute",
		background: "rgba(255, 255, 255, 0.9)",
		width: "100%",
		height: "100%",
		top: "0",
		bottom: "0",
		left: "0",
		right: "0",
		zIndex: "999999",
	};

	const loadingContainer = {
		position: "relative",
	};

	const loadingIcon = {
		width: "160px",
		height: "160px",
		position: "absolute",
		left: "50%",
		top: "20%",
		marginLeft: "-80px",
		marginTop: "-80px",
	};

	const LogoIcon = {
		position: "absolute",
		width: "140px",
		height: "140px",
		left: "6%",
		top: "0%",
	};

	return (
		<>
			<div style={{ minHeight: minHeight + "px" }}>&nbsp;</div>

			<div id="icon-background" style={background}>
				<div style={loadingIcon}>
					<div style={loadingContainer}>
						<div data-loader="logo-circle"></div>
						<img
							src={flickrDashboardLogo}
							alt="Flickr Dashboard"
							style={LogoIcon}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default LoadingIcon;
