import Navbar from "../Navbar";

export default function About({ user, setCurrentTab }) {
  return (
    <>
      <Navbar
        user={user}
        setCurrentTab={setCurrentTab}
        sectionClass={"project-navbar"}
      />

      <div className="project-wrapper">
        <div className="about-1">
          <img src="images/adam.jpg" alt="Adam Meddah" />

          <div className="about-text">
            <h1 className="about-title">About Me</h1>
            <p className="about-paragraph">
              I'm a second year Computer Science student at McMaster University
              with a passion for unique technological experiences. I strive to
              contribute to memorable and impactful software projects. Outside
              of coding, I enjoy writing, exploring AI, going to the gym, public
              speaking, and much more.
            </p>

            <p className="about-paragraph">
              {" "}
              <span className="about-improve">
                I'm always trying to improve.
              </span>{" "}
            </p>
            <p className="about-paragraph">
              Diving headfirst into making this portfolio website, working on my
              novel, learning new technologies and tools... I'm constantly
              learning new skills, while improving upon existing ones.{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
