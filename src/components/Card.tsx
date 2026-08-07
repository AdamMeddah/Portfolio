import type { SetCurrentTab, TabName } from "../types";

type CardProps = {
  title: TabName;
  image: string;
  setCurrentTab: SetCurrentTab;
};

export default function Card({ title, image, setCurrentTab }: CardProps) {
  return (
    <button
      type="button"
      className="card"
      onClick={() => setCurrentTab(title)}
    >
      <img className="card-image" src={image} alt="" loading="lazy" />
      <span className="card-label">{title}</span>
    </button>
  );
}
