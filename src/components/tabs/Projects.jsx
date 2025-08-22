import Project from "../Project";

function Tag({ img, title }) {
  return (
    <div className="tag">
      <img className="tag-image" src={img} alt={title} />
      <h3>{title}</h3>
    </div>
  );
}

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
            >
              <Tag img="vite.svg" title="Vite" />
              <Tag img="vite.svg" title="Vite" />
            </Project>
            <Project
              title="MusiWrite"
              desc="Using Flask, I powered tf up and MADE SOMETHING AWESOME AND GREAT!"
              image="images/projects.jpg"
            >
              <Tag img="vite.svg" title="Vite" />
              <Tag img="vite.svg" title="Vite" />
            </Project>
            <Project
              title="MusiWrite"
              desc="Using Flask, I powered tf up and MADE SOMETHING AWESOME AND GREAT!"
              image="images/projects.jpg"
            >
              <Tag
                img="vite.svg"
                title="SDhjpdshjdhjsohjdshjdshjdshjdshhjdshjdshjdhjs"
              />
              <Tag img="vite.svg" title="Vite" />
            </Project>
            <Project
              title="MusiWrite"
              desc="Using Flask, I powered tf up and MADE SOMETHING AWESOME AND GREAT!"
              image="images/projects.jpg"
            >
              <Tag img="vite.svg" title="Vite" />
              <Tag img="vite.svg" title="Vite" />
            </Project>{" "}
          </div>
        </div>
      </div>
    </>
  );
}
