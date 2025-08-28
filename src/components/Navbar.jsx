import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // icons

export default function Navbar({ user, setCurrentTab, sectionClass }) {
  const [isOpen, setIsOpen] = useState(false);

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

  // solve edge case of having hamburger menu open, then changing orientation (hamburger menu icon is gone, so how will they close it?)
  useEffect(() => {
    function handleResize() {
      if (
        window.innerWidth >= 800 &&
        window.matchMedia("(orientation: landscape)").matches
      ) {
        setIsOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className={sectionClass}>
      <div className="left-navbar">
        <img className="adam-logo" src="images/fullLogo.png" alt="Logo" />

        <div className="nav-links">
          <button onClick={() => setCurrentTab("main")}>Home</button>
          <button>About</button>
          <button onClick={() => setCurrentTab("Projects")}>Projects</button>
          <button onClick={() => setCurrentTab("Contact Me")}>Contact</button>
        </div>
      </div>

      <div className="right-navbar">
        <img
          className="user-logo"
          src={getUserLogo(user)}
          onClick={() => setCurrentTab("profiles")}
          alt="User"
        />

        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <X size={28} color="white" />
          ) : (
            <Menu size={28} color="white" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="mobile-menu">
          <button
            onClick={() => {
              setCurrentTab("main");
              setIsOpen(false);
            }}
          >
            Home
          </button>
          <button onClick={() => setIsOpen(false)}>About</button>
          <button
            onClick={() => {
              setCurrentTab("Projects");
              setIsOpen(false);
            }}
          >
            Projects
          </button>
          <button
            onClick={() => {
              setCurrentTab("Projects");

              setIsOpen(false);
            }}
          >
            Contact
          </button>
        </div>
      )}
    </nav>
  );
}
