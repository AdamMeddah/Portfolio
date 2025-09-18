// import components
import Navbar from "../Navbar";
import Project from "../Project";

// small reusable tag component for project tech stack
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
      {/* navbar at the top */}

      <div className="project-wrapper">
        <div className="project-grid">
          {/* musiwrite project */}
          <Project
            title="MusiWrite"
            desc="MusiWrite is an AI-powered playlist generator built with Flask, Ollama, and the Spotify API. Writers can paste in an entire scene, choose a genre, and instantly receive a personalized Spotify playlist that matches the mood of their text, with an AI-generated title and curated track selection. This is an app made for writers, by a writer (me!)"
            image="images/musiwrite.webp"
          >
            <Tag img="images/python.webp" title="Python" />
            <Tag img="images/flask.webp" title="Flask" />
            <Tag img="images/ollama.webp" title="Ollama" />
          </Project>

          {/* rick grundy therapy website */}
          <Project
            title="Rick Grundy Therapy"
            desc="Developed a responsive therapist website with a clean, calming design using React and Tailwind CSS. Implemented a blog platform to allow the therapist to share articles and resources, integrating Strapi as a headless CMS for easy, non-technical content management and updates."
            image="images/rick.webp"
          >
            <Tag img="images/react.svg" title="React" />
            <Tag img="images/tailwind.webp" title="Tailwind CSS" />
          </Project>

          {/* portfolio website */}
          <Project
            title="Portfolio Website"
            desc="You're looking at it! An immersive 3D portfolio built with React Three Fiber and Three.js (React Three Fiber), styled like Netflix with custom user flows."
            image="images/portfolio.webp"
          >
            <Tag img="images/ThreeJS.webp" title="Three JS" />
            <Tag img="images/react.svg" title="React" />
          </Project>

          {/* password manager */}
          <Project
            title="Password Manager w/ Encryption"
            desc="Built a desktop password manager that securely stores and retrieves user credentials. Implemented encryption algorithms for password protection, integrated an SQLite database for secure local storage, and designed a Tkinter-based GUI for intuitive password management."
            image="images/pvault.webp"
          >
            <Tag img="images/python.webp" title="Python" />
            <Tag img="images/python.webp" title="Tkinter" />
          </Project>
        </div>
      </div>
    </>
  );
}
