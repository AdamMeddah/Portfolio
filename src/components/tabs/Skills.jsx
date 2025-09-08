// import components
import Navbar from "../Navbar";

// import skill data
import {
  languages,
  frameworks,
  tools,
  libraries,
} from "../../data/skillsArray";

export default function Skills({ user, setCurrentTab }) {
  // reusable function to render each skills section
  const renderSection = (title, items) => (
    <div className="skills-section">
      <h2 className="skills-subtitle">{title}</h2>

      <div className="skills-grid">
        {items.map((skill, idx) => (
          <div key={idx} className="skill-card">
            <img src={skill.logo} alt={skill.title} className="skill-logo" />
            <h3 className="skill-title">{skill.title}</h3>
            <p className="skill-desc">{skill.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* navbar at the top of the skills page */}
      <Navbar
        user={user}
        setCurrentTab={setCurrentTab}
        sectionClass="project-navbar"
      />

      <div className="project-wrapper">
        {/* main title */}
        <h1 className="skills-title">My Skills</h1>

        {/* render all skill sections */}
        {renderSection("languages", languages)}
        {renderSection("frameworks", frameworks)}
        {renderSection("tools", tools)}
        {renderSection("libraries", libraries)}
      </div>
    </>
  );
}
