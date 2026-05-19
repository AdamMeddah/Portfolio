import BlogPostCard from "../BlogPostCard";
import { blogData } from "../../data/blogData";
import type { BlogPost } from "../../types";

type BlogProps = {
  setActivePost: (post: BlogPost) => void;
};

export default function Blog({ setActivePost }: BlogProps) {
  return (
    <>
      <div className="project-wrapper">
        <div className="blog-grid">
          {blogData.map((post) => (
            <BlogPostCard
              key={post.id}
              title={post.title}
              desc={post.desc}
              image={post.image}
              onClick={() => setActivePost(post)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
