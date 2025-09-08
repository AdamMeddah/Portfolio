// import components
import Navbar from "../Navbar";
import ReactMarkdown from "react-markdown";

export default function BlogDetail({
  user,
  post,
  setCurrentTab,
  clearActivePost,
}) {
  if (!post) return null;

  return (
    <>
      {/* navbar for blog detail */}
      <Navbar
        user={user}
        setCurrentTab={setCurrentTab}
        sectionClass="blog-navbar"
      />

      <div className="project-wrapper">
        {/* detailed blog view */}
        <div className="blog-detail">
          <img className="detail-image" src={post.image} alt={post.title} />

          <h1>{post.title}</h1>

          {/* markdown content for post */}
          <ReactMarkdown>{post.fullText || post.desc}</ReactMarkdown>

          {/* back button */}
          <button onClick={clearActivePost}>← Back to Blog</button>
        </div>
      </div>
    </>
  );
}
