import {
  languages,
  frameworks,
  tools,
  libraries,
} from "../../data/skillsArray";
import type { SkillItem } from "../../types";

export default function Skills() {
  const renderSection = (title: string, items: SkillItem[]) => (
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
      <div className="project-wrapper">
        <h1 className="skills-title">My Skills</h1>

        {renderSection("languages", languages)}
        {renderSection("frameworks", frameworks)}
        {renderSection("tools", tools)}
        {renderSection("libraries", libraries)}
      </div>
    </>
  );
}
