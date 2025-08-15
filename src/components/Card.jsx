export default function Card({ title, image }) {
  return (
    <div
      className="card"
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
