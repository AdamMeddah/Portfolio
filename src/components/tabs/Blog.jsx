import Navbar from "../Navbar";
import BlogPostCard from "../BlogPostCard";

export default function Blog({ user, setCurrentTab, setActivePost }) {
  const posts = [
    {
      id: 1,
      title: "How I Built My Portfolio",
      desc: "Breaking down the stack and design choices, as well as diving headfirst into what felt like uncharted territory.",
      fullText: `I had just finished a course on React, and had no clue what to do.  `,
      image: "images/about.webp",
    },
    // {
    //   id: 2,
    //   title: "Why I Love Full-Stack Development",
    //   desc: "Thoughts on frontend + backend synergy...",
    //   image: "images/about.jpg",
    // },
    // {
    //   id: 3,
    //   title: "Why I Love Full-Stack Development",
    //   desc: "Thoughts on frontend + backend synergy...",
    //   image: "images/about.jpg",
    // },
  ];

  return (
    <>
      <Navbar
        user={user}
        setCurrentTab={setCurrentTab}
        sectionClass="blog-navbar"
      />
      <div className="project-wrapper">
        <div className="blog-grid">
          {posts.map((post) => (
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
