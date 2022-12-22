import { useAsyncFn } from "../hooks/useAsync";
import { usePost } from "../hooks/usePost";
import { CreateComment } from "../services/comments";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

export default function Post() {
  const { post, rootComments, createLocal } = usePost();
  const { isLoading, error, exe: createFn } = useAsyncFn(CreateComment);

  const onCreateComment = (message) => {
    return createFn({ postId: post.id, message }).then((comment) =>
      createLocal(comment)
    );
  };
  return (
    <div className="post">
      <h1 className="post-title">{post.title}</h1>
      <article className="post-description">{post.body}</article>
      <h2 className="comments-title">comments</h2>
      <div className="comments-section">
        {rootComments != null && rootComments.length > 0 && (
          <CommentList rootComments={rootComments} />
        )}
        <div className="commentbox-container">
          <CommentForm
            isLoading={isLoading}
            error={error}
            onSub={onCreateComment}
            label="send"
          />
        </div>
      </div>
    </div>
  );
}
