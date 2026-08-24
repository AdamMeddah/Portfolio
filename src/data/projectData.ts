export type ProjectTag = {
  img: string;
  title: string;
};

export type ProjectEntry = {
  id: string;
  title: string;
  desc: string;
  image: string;
  tags: ProjectTag[];
  /* natural width / height of the artwork, so a poster keeps its proportions */
  aspect: number;
};

export const projects: ProjectEntry[] = [
  {
    id: "musiwrite",
    title: "MusiWrite",
    desc: "MusiWrite is an AI-powered playlist generator built with Flask, Ollama, and the Spotify API. Writers can paste in an entire scene, choose a genre, and instantly receive a personalized Spotify playlist that matches the mood of their text, with an AI-generated title and curated track selection. This is an app made for writers, by a writer (me!)",
    image: "images/musiwrite.webp",
    aspect: 1200 / 1151,
    tags: [
      { img: "images/python.webp", title: "Python" },
      { img: "images/flask.webp", title: "Flask" },
      { img: "images/ollama.webp", title: "Ollama" },
    ],
  },
  {
    id: "portfolio",
    title: "Portfolio Website",
    desc: "You're looking at it! An immersive 3D portfolio built with React Three Fiber and Three.js (React Three Fiber), styled like Netflix with custom user flows.",
    image: "images/portfolio.webp",
    aspect: 1200 / 1217,
    tags: [
      { img: "images/ThreeJS.webp", title: "Three JS" },
      { img: "images/react.svg", title: "React" },
    ],
  },
  {
    id: "pvault",
    title: "Password Manager w/ Encryption",
    desc: "Built a desktop password manager that securely stores and retrieves user credentials. Implemented encryption algorithms for password protection, integrated an SQLite database for secure local storage, and designed a Tkinter-based GUI for intuitive password management.",
    image: "images/pvault.webp",
    aspect: 1200 / 397,
    tags: [
      { img: "images/python.webp", title: "Python" },
      { img: "images/python.webp", title: "Tkinter" },
    ],
  },
];
