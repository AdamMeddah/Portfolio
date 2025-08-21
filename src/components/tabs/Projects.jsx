import Project from "../Project";

export default function Projects({ user, setCurrentTab }) {
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
        <div className="project-wrapper">
          <div className="project-grid">
            <Project
              title="MusiWrite"
              desc="Using Flask, I powered tf up and MADE SOMETHING AWESOME AND GREAT!"
              image="images/projects.jpg"
            />
            <Project title="What" desc="Whoa" image="images/projects.jpg" />
            <Project
              title="What"
              desc="Whoa"
              image="images/projects.jpg"
            />{" "}
            <Project title="What" desc="Whoa" image="images/projects.jpg" />
          </div>
        </div>
      </div>
    </>
  );
}
