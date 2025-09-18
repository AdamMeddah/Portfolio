// import components
import Navbar from "../Navbar";
import BlogPostCard from "../BlogPostCard";

// import data
import { blogData } from "../../data/blogData";

export default function Blog({ user, setCurrentTab, setActivePost }) {
  return (
    <>
      <div className="project-wrapper">
        {/* grid of blog posts */}
        <div className="blog-grid">
          {blogData.map((post) => (
            <BlogPostCard
              user={user}
              key={post.id}
              title={post.title}
              desc={post.desc}
              image={post.image}
              onClick={() => setActivePost(post)} // navigate to detail
            />
          ))}
        </div>
      </div>
    </>
  );
}
