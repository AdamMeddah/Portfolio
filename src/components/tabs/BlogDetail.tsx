import ReactMarkdown from "react-markdown";
import type { BlogPost } from "../../types";

type BlogDetailProps = {
  post: BlogPost;
  clearActivePost: () => void;
};

export default function BlogDetail({ post, clearActivePost }: BlogDetailProps) {
  return (
    <>
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
