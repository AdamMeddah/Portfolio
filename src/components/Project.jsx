export default function Project({ title, desc, image, children }) {
  return (
    <div className="project">
      {/* project image */}
      <img className="project-image" src={image} alt={title + " logo"} />

      {/* project title and description */}
      <div className="project-text">
        <h1 className="project-title">{title}</h1>
        <h2 className="project-desc">{desc}</h2>
      </div>

      {/* tags for tech stack or features */}
      <div className="tag-container">{children}</div>
    </div>
  );
}
