type BlogPostCardProps = {
  title: string;
  desc: string;
  image: string;
  onClick: () => void;
};

export default function BlogPostCard({
  title,
  desc,
  image,
  onClick,
}: BlogPostCardProps) {
  return (
    <button type="button" className="blog-card" onClick={onClick}>
      <img className="blog-image" src={image} alt="" loading="lazy" />

      <div className="blog-content">
        <h2 className="blog-title">{title}</h2>
        <p className="blog-desc">{desc}</p>
      </div>
    </button>
  );
}
