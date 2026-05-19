import type { SetCurrentTab, TabName } from "../types";

type CardProps = {
  title: TabName;
  image: string;
  setCurrentTab: SetCurrentTab;
};

export default function Card({ title, image, setCurrentTab }: CardProps) {
  return (
    <div
      className="card"
      onClick={() => setCurrentTab(title)}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {title}
    </div>
  );
}
