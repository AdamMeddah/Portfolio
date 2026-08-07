import ReactMarkdown from "react-markdown";
import type { BlogPost } from "../../types";

type BlogDetailProps = {
  post: BlogPost;
  clearActivePost: () => void;
};

export default function BlogDetail({ post, clearActivePost }: BlogDetailProps) {
  return (
    <>
      <div className="tab-wrapper">
        <article className="blog-detail">
          <button className="blog-back" onClick={clearActivePost}>
            ← Back to Blog
          </button>

          <img className="detail-image" src={post.image} alt="" />

          <h1>{post.title}</h1>

          <ReactMarkdown>{post.fullText || post.desc}</ReactMarkdown>
        </article>
      </div>
    </>
  );
}
