import Project from "../Project";

import Navbar from "../Navbar";

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
      <Navbar
        user={user}
        setCurrentTab={setCurrentTab}
        sectionClass={"project-navbar"}
      />

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
    </>
  );
}
