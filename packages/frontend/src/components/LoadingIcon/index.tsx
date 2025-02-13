import flickrDashboardLogo from "../../assets/img/brand/blue_logo.png";
import './styles.css';

const LoadingIcon = () => {
  const background = {
    position: 'fixed',
    background: 'rgba(255, 255, 255, 0.9)',
    width: '100%',
    height: '100vh',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    zIndex: '999999',
  };

  const loadingContainer = {
    position: 'relative',
  };

  const loadingIcon = {
    width: '160px',
    height: '160px',
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: '-80px',
    marginTop: '-80px',
  };

  const LogoIcon = {
    position: 'absolute',
    width: '140px',
    height: '140px',
    left: '6%',
    top: '0%',
  };

  return (
    <div id="icon-background" style={background}>
      <div style={loadingIcon}>
        <div style={loadingContainer}>
          <div data-loader="logo-circle"></div>
          <img src={flickrDashboardLogo} alt="Flickr Dashboard" style={LogoIcon} />
          {/* <svg id="logo-icon" style={LogoIcon} version="1.1" x="0px" y="0px" viewBox="0 0 80 80">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <path d="M8.86592061,32.4309302 L8.89582679,25.1387071 L10.2586939,25.124417 L11.6201368,25.107269 L11.6044717,23.9840694 L11.5873824,22.8594408 L7.65400852,22.8437218 L3.7234828,22.8280027 L3.7234828,23.9683503 L3.7234828,25.107269 L5.05359549,25.124417 L6.38370818,25.1387071 L6.39937332,32.3709119 C6.40649383,36.3478385 6.42643128,39.6374128 6.44209642,39.678854 C6.46345798,39.7374433 6.73973406,39.7517334 7.65258442,39.7388723 L8.83601444,39.7231532 L8.86592061,32.4309302 Z" fill="#E52D27"></path>
            </g>
          </svg> */}
        </div>
      </div>
    </div>
  );
};

export default LoadingIcon;