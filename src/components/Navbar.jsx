export default function Navbar({ user }) {
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
    <nav className="navbar">
      <div className="left-navbar">
        <img className="adam-logo" src="images/fullLogo.png" alt="" />
        <button className="home-button" onClick={() => setCurrentTab("main")}>
          Home
        </button>
        <button className="home-button">About</button>
        <button className="home-button">Projects</button>
        <button className="home-button">Contact</button>
      </div>

      <div className="right-navbar">
        <img
          className="user-logo"
          src={getUserLogo(user)}
          onClick={() => setCurrentTab("profiles")}
          alt=""
        />
      </div>
    </nav>
  );
}
