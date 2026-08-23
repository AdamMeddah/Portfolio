import type { ReactNode } from "react";
import type { CardMeta, SetCurrentTab, TabName } from "../types";

type CardProps = {
  title: TabName;
  image: string;
  setCurrentTab: SetCurrentTab;
  meta?: CardMeta;
  /* 0-100, renders the red "partly watched" bar under the artwork */
  progress?: number;
};

/* the action pips are decorative - the whole tile is the click target */
function Pip({ children }: { children: ReactNode }) {
  return (
    <span className="card-pip" aria-hidden="true">
      {children}
    </span>
  );
}

export default function Card({
  title,
  image,
  setCurrentTab,
  meta,
  progress,
}: CardProps) {
  return (
    <button type="button" className="card" onClick={() => setCurrentTab(title)}>
      <span className="card-art">
        <img className="card-image" src={image} alt="" loading="lazy" />
        <span className="card-label">{title}</span>

        {progress !== undefined && (
          <span className="card-progress" aria-hidden="true">
            <span
              className="card-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </span>
        )}
      </span>

      {meta && (
        <span className="card-expand" aria-hidden="true">
          <span className="card-pips">
            <Pip>
              <svg viewBox="0 0 24 24" className="pip-solid">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </Pip>
            <Pip>
              <svg viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </Pip>
            <Pip>
              <svg viewBox="0 0 24 24">
                <path d="M7 10v9H4v-9zM7 10l4.5-7 1 .6a2 2 0 0 1 .9 2.2L12.6 9H19a1.6 1.6 0 0 1 1.6 2l-1.6 6.8a2 2 0 0 1-2 1.5H7" />
              </svg>
            </Pip>
            <Pip>
              <svg viewBox="0 0 24 24" className="pip-last">
                <path d="M6 9.5l6 6 6-6" />
              </svg>
            </Pip>
          </span>

          <span className="card-meta">
            <span className="card-match">{meta.match}% Match</span>
            <span className="card-rating">{meta.rating}</span>
            <span>{meta.length}</span>
            <span className="card-hd">HD</span>
          </span>

          <span className="card-tags">
            {meta.tags.map((tag, i) => (
              <span key={tag} className="card-tag">
                {i > 0 && <span className="card-dot">•</span>}
                {tag}
              </span>
            ))}
          </span>
        </span>
      )}
    </button>
  );
}
