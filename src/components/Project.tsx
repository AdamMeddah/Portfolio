import type { ReactNode } from "react";

type ProjectProps = {
  title: string;
  desc: string;
  image: string;
  children: ReactNode;
};

export default function Project({ title, desc, image, children }: ProjectProps) {
  return (
    <div className="project">
      <img className="project-image" src={image} alt={title + " logo"} />

      <div className="project-text">
        <h1 className="project-title">{title}</h1>
        <h2 className="project-desc">{desc}</h2>
      </div>

      <div className="tag-container">{children}</div>
    </div>
  );
}
