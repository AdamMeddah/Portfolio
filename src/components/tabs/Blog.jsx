import Navbar from "../Navbar";
import BlogPostCard from "../BlogPostCard";

import { blogData } from "../../data/blogData";
export default function Blog({ user, setCurrentTab, setActivePost }) {
  return (
    <>
      <Navbar
        user={user}
        setCurrentTab={setCurrentTab}
        sectionClass="blog-navbar"
      />
      <div className="project-wrapper">
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
