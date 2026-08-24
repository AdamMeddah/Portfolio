import { useEffect } from "react";
import type { ProjectEntry } from "../data/projectData";

type ProjectPanelProps = {
  project: ProjectEntry | null;
  onClose: () => void;
};

export default function ProjectPanel({ project, onClose }: ProjectPanelProps) {
  useEffect(() => {
    if (!project) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <aside className="poster-panel" aria-label={project.title}>
      <div className="poster-panel-inner">
        <p className="poster-panel-kicker">Project File</p>
        <h2 className="poster-panel-title">{project.title}</h2>
        <span className="poster-panel-rule" aria-hidden="true" />

        <p className="poster-panel-desc">{project.desc}</p>

        <ul className="poster-panel-tags">
          {project.tags.map((tag, i) => (
            <li key={`${tag.title}-${i}`}>
              <img src={tag.img} alt="" aria-hidden="true" />
              {tag.title}
            </li>
          ))}
        </ul>

        <button type="button" className="poster-panel-close" onClick={onClose}>
          <span className="poster-panel-key">Esc</span>
          Back to the wall
        </button>
      </div>
    </aside>
  );
}
