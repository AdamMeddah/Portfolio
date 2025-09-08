// simple card component for main screen sections
export default function Card({ title, image, setCurrentTab }) {
  return (
    <div
      className="card"
      onClick={() => setCurrentTab(title)} // switch to this tab on click
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover", // fill container
        backgroundPosition: "center", // center image
      }}
    >
      {title} {/* display section title */}
    </div>
  );
}
