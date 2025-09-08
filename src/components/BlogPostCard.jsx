export default function BlogPostCard({ title, desc, image, onClick }) {
  return (
    // individual blog card
    <div className="blog-card" onClick={onClick}>
      <img className="blog-image" src={image} alt={title} />

      <div className="blog-content">
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>
    </div>
  );
}
