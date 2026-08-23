import type { SetCurrentTab, TabName } from "../types";

type CardProps = {
  title: TabName;
  image: string;
  setCurrentTab: SetCurrentTab;
  /* 0-100, renders the red "partly watched" bar under the artwork */
  progress?: number;
};

export default function Card({
  title,
  image,
  setCurrentTab,
  progress,
}: CardProps) {
  return (
    <button type="button" className="card" onClick={() => setCurrentTab(title)}>
      <img className="card-image" src={image} alt="" loading="lazy" />
      <span className="card-label">{title}</span>

      <span className="card-play" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      </span>

      {progress !== undefined && (
        <span className="card-progress" aria-hidden="true">
          <span
            className="card-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </span>
      )}
    </button>
  );
}
