export default function Card({ title, image, setCurrentTab }) {
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
