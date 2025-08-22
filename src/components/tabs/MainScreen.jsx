import Card from "../Card";
import Navbar from "../Navbar";
import { Text } from "@react-three/drei";
export default function MainScreen({ user, setCurrentTab }) {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          paddingBottom: "50vh",
        }}
      >
        <video
          className="main-preview-vid"
          autoPlay
          loop
          src="videos/noted.mp4"
        ></video>

        <div className="main-info">
          <h1 className="main-title">
            Adam Meddah <span style={{ fontSize: "3rem" }}>|</span> Full-Stack
            Developer{" "}
          </h1>

          <p className="main-paragraph">
            Computer Science student at{" "}
            <span style={{ fontWeight: "500" }}>McMaster University</span> with
            experience building full-stack applications, AI-powered tools, and
            immersive web experiences. I’ve developed projects ranging from
            secure business web apps to AI-driven music recommendation systems
            and interactive 3D portfolios, blending{" "}
            <span style={{ fontWeight: "500" }}>technical depth</span> with{" "}
            <span style={{ fontWeight: "500" }}>creative design. </span> With a
            strong foundation across multiple languages, frameworks, and cloud
            technologies, I focus on delivering software that is both{" "}
            <span style={{ fontWeight: "500" }}>impactful </span>
            and <span style={{ fontWeight: "500" }}>user-centered. </span>
          </p>
        </div>

        <div className="main-two-buttons">
          <a className="play-button">
            <svg className="play-icon" viewBox="0 0 30 30 ">
              <path
                d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
                fill="black"
              />
            </svg>
            Resume
          </a>

          <a
            className="info-button"
            href="https://ca.linkedin.com/in/adammeddah"
            target="blank"
          >
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
            Linkedin
          </a>
        </div>

        <div className="top-picks">
          Top Picks for {user.charAt(0).toUpperCase() + user.slice(1)}
          {/* capitalize first letter */}
          <div className="top-picks-list">
            {user === "recruiter" && (
              <>
                <Card
                  title="Skills"
                  image="images/skills.jpg"
                  setCurrentTab={setCurrentTab}
                />
                <Card
                  title="Projects"
                  image="images/projects.jpg"
                  setCurrentTab={setCurrentTab}
                />
                <Card
                  title="Contact Me"
                  image="images/contact.jpg"
                  setCurrentTab={setCurrentTab}
                />
              </>
            )}
          </div>
        </div>

        <div className="continue-watching">
          Continue Watching for {user.charAt(0).toUpperCase() + user.slice(1)}
          <div className="continue-watching-list">
            {user === "recruiter" && (
              <>
                <Card title="About" image="images/about.jpg" />

                <Card title="Blog" image="images/blog.jpg" />
              </>
            )}
          </div>
        </div>

        <h3 className="footer"> © 2025 Adam Meddah. All rights reserved.</h3>
      </div>
    </>
  );
}
