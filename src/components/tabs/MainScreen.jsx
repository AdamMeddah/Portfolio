export default function MainScreen({ user }) {
  function getUserLogo(user) {
    switch (user) {
      case "recruiter":
        return "images/bluishavatar.png";
      case "developer":
        return "images/greenavatar.jpg";
      case "writer":
        return "images/redavatar.jpg";
    }
  }
  return (
    <>
      <nav className="navbar">
        <div className="left-navbar">
          <img className="adam-logo" src="images/fullLogo.png" alt="" />
          <button className="home-button">Home</button>
          <button className="home-button">About</button>
          <button className="home-button">Projects</button>
          <button className="home-button">Contact</button>
        </div>

        <div className="right-navbar">
          <img className="user-logo" src={getUserLogo(user)} alt="" />
        </div>
      </nav>

      <div className="main-preview">
        <video
          className="main-preview-vid"
          autoPlay
          loop
          src="videos/noted.mp4"
        ></video>

        <svg
          className="info-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>

        <div className="play-button">
          Resume
          <svg className="play-icon" viewBox="0 0 30 30 ">
            <path
              d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
