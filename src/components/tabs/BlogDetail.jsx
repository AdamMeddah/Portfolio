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
      <Navbar
        user={user}
        setCurrentTab={setCurrentTab}
        sectionClass="blog-navbar"
      />

      <div className="project-wrapper">
        <div className="blog-detail">
          <img className="detail-image" src={post.image} alt={post.title} />
          <h1>{post.title}</h1>
          <ReactMarkdown>{post.fullText || post.desc}</ReactMarkdown>
          <button onClick={clearActivePost}>← Back to Blog</button>
        </div>
      </div>
    </>
  );
}
