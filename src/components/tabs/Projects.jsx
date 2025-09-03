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
            desc="MusiWrite is an AI-powered playlist generator built with Flask, Ollama, and the Spotify API. Writers can paste in an entire scene, choose a genre, and instantly receive a personalized Spotify playlist that matches the mood of their text, with an AI-generated title and curated track selection. This is an app made for writers, by a writer (me!) "
            image="images/musiwrite.png"
          >
            <Tag img="images/python.png" title="Python" />
            <Tag img="images/flask.png" title="Flask" />
            <Tag img="images/ollama.png" title="Ollama" />
          </Project>
          <Project
            title="Portfolio Website"
            desc="You're looking at it! An immersive 3D portfolio built with React Three Fiber and Three.js (React Three Fiber), styled like Netflix with custom user flows."
            image="images/portfolio.png"
          >
            <Tag
              img="vite.svg"
              title="SDhjpdshjdhjsohjdshjdshjdshjdshhjdshjdshjdhjs"
            />
            <Tag img="vite.svg" title="Vite" />
          </Project>
          <Project
            title="Rick Grundy Therapy"
            desc="Developed a responsive therapist website with a clean, calming design using React and Tailwind CSS. Implemented a blog platform to allow the therapist to share articles and resources, integrating Strapi as a headless CMS for easy, non-technical content management and updates."
            image="images/rick.png"
          >
            <Tag img="vite.svg" title="Vite" />
            <Tag img="vite.svg" title="Vite" />
          </Project>
          <Project
            title="Password Manager w/ Encryption"
            desc="Built a desktop password manager that securely stores and retrieves user credentials. Implemented encryption algorithms for password protection, integrated an SQLite database for secure local storage, and designed a Tkinter-based GUI for intuitive password management."
            image="images/pvault.png"
          >
            <Tag img="images/python.png" title="Python" />
            <Tag img="vite.svg" title="Vite" />
          </Project>{" "}
        </div>
      </div>
    </>
  );
}
