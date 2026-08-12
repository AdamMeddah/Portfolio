import {
  languages,
  frameworks,
  tools,
  libraries,
} from "../../data/skillsArray";
import type { SkillItem } from "../../types";

export default function Skills() {
  const renderSection = (title: string, items: SkillItem[]) => (
    <section className="skills-section" key={title}>
      <h2 className="skills-subtitle">{title}</h2>

      <div className="skills-grid">
        {items.map((skill) => (
          <div key={skill.title} className="skill-card">
            <img
              src={skill.logo}
              alt=""
              className="skill-logo"
              loading="lazy"
            />
            <h3 className="skill-title">{skill.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="tab-wrapper">
      <div className="tab-inner">
        <h1 className="skills-title">My Skills</h1>

        {renderSection("languages", languages)}
        {renderSection("frameworks", frameworks)}
        {renderSection("tools", tools)}
        {renderSection("libraries", libraries)}
      </div>
    </div>
  );
}
