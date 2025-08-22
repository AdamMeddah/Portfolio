function Tag({ img, title }) {
  return (
    <div className="tag">
      <img className="tag-image" src={img} alt={title} />
      <h3>{title}</h3>
    </div>
  );
}

export default function Project({ title, desc, image }) {
  return (
    <div className="project">
      <img className="project-image" src={image} alt={title + "logo"} />
      <div className="project-text">
        <h1 className="project-title">{title}</h1>

        <h2 className="project-desc">{desc}</h2>
      </div>

      <div className="tags">
        <Tag img="vite.svg" title="Vite" />
      </div>
    </div>
  );
}
