import Navbar from "../Navbar";

export default function Skills({ user, setCurrentTab }) {
  const languages = [
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      title: "Java",
      desc: "Object-oriented language",
    },
    {
      logo: "images/python.png", // keep local
      title: "Python",
      desc: "General-purpose language",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
      title: "C",
      desc: "Low-level systems language",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
      title: "C#",
      desc: "Microsoft ecosystem language",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      title: "SQL",
      desc: "Databases (PostgreSQL, MySQL)",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      title: "JavaScript",
      desc: "Web development language",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
      title: "PHP",
      desc: "Server-side scripting",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      title: "HTML/CSS",
      desc: "Web fundamentals",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg",
      title: "Haskell",
      desc: "Functional programming",
    },
    // {
    //   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
    //   title: "Bash",
    //   desc: "Scripting & automation",
    // },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/latex/latex-original.svg",
      title: "LaTeX",
      desc: "Document preparation",
    },
  ];

  const frameworks = [
    // {
    //   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg",
    //   title: "ASP.NET Core",
    //   desc: "Backend framework",
    // },
    // {
    //   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    //   title: "Node.js",
    //   desc: "Backend runtime",
    // },
    {
      logo: "images/flask.png", // keep local
      title: "Flask",
      desc: "Lightweight Python framework",
    },
    // {
    //   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    //   title: "TensorFlow",
    //   desc: "Machine learning",
    // },
    // {
    //   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
    //   title: "PyTorch",
    //   desc: "Deep learning",
    // },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      title: "JavaFX",
      desc: "Desktop apps",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/libgdx/libgdx-original.svg",
      title: "LibGDX",
      desc: "Game development",
    },
    // {
    //   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    //   title: "Express.js",
    //   desc: "Node.js web framework",
    // },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      title: "Tkinter",
      desc: "GUI framework",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg",
      title: "Unity",
      desc: "Game engine",
    },
  ];

  const tools = [
    {
      logo: "images/aws.png",
      title: "AWS",
      desc: "Cloud services",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      title: "Git",
      desc: "Version control",
    },
    {
      logo: "images/ollama.png",
      title: "Ollama",
      desc: "AI model integration",
    },

    {
      logo: "images/tailwind.png",
      title: "Tailwind CSS",
      desc: "Utility-first CSS framework",
    },
    // {
    //   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    //   title: "Docker",
    //   desc: "Containerization",
    // },
    // {
    //   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
    //   title: "Kubernetes",
    //   desc: "Container orchestration",
    // },
    ,
  ];

  const libraries = [
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      title: "React",
      desc: "Frontend library",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      title: "React Router",
      desc: "Routing for React",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      title: "pandas",
      desc: "Data analysis",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      title: "NumPy",
      desc: "Numerical computing",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      title: "Matplotlib",
      desc: "Data visualization",
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      title: "TextBlob",
      desc: "NLP processing",
    },
  ];

  // Reusable render function
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
      <Navbar
        user={user}
        setCurrentTab={setCurrentTab}
        sectionClass={"project-navbar"}
      />

      <div className="project-wrapper">
        <h1 className="skills-title">My Skills</h1>
        {renderSection("Languages", languages)}
        {renderSection("Frameworks", frameworks)}
        {renderSection("Tools", tools)}
        {renderSection("Libraries", libraries)}
      </div>
    </>
  );
}
