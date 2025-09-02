import Navbar from "../Navbar";

export default function Skills({ user, setCurrentTab }) {
  const skills = [
    {
      logo: "images/react.svg",
      title: "React",
      desc: "Frontend library",
    },
    {
      logo: "images/about.jpg",
      title: "Node.js",
      desc: "Backend runtime",
    },
    {
      logo: "images/about.jpg",
      title: ".NET",
      desc: "Backend framework",
    },
    {
      logo: "images/about.jpg",
      title: "PostgreSQL",
      desc: "Database",
    },
    // Add more skills here
  ];

  return (
    <>
      <Navbar
        user={user}
        setCurrentTab={setCurrentTab}
        sectionClass={"project-navbar"}
      />

      <div className="project-wrapper">
        <h1 className="skills-title">My Skills</h1>
        <div className="skills-grid">
          {skills.map((skill, idx) => (
            <div key={idx} className="skill-card">
              <img src={skill.logo} alt={skill.title} className="skill-logo" />
              <h3 className="skill-title">{skill.title}</h3>
              <p className="skill-desc">{skill.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
