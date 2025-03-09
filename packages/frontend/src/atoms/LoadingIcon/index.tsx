import { FC } from "react";
import flickrDashboardLogo from "../../assets/img/brand/blue_logo.png";
import "./styles.css";

type Props = {
  minHeight?: number;
};

export const LoadingIcon: FC<Props> = ({ minHeight = 50 }) => {
	return (
		<>
			<div style={{ minHeight: minHeight + "px" }}>&nbsp;</div>

			<div id="background">
				<div id="loadingIcon">
					<div id="loadingContainer">
						<div data-loader="logo-circle"></div>
            <img
              src={flickrDashboardLogo}
              alt="Flickr Dashboard"
              id="LogoIcon"
            />
					</div>
				</div>
			</div>
		</>
	);
};
