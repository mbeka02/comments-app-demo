import { useState } from "react";

export default function CommentForm({
  isLoading,
  error,
  label,
  onSub,
  InitialVal = "",
}) {
  const [message, setMessage] = useState(InitialVal);

  function handleSubmit(e) {
    e.preventDefault();
    onSub(message).then(() => setMessage(""));
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        placeholder="Add a comment.."
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        className="comment-textarea"
      />
      <button
        disabled={isLoading}
        className={"comment-button"}
        style={isLoading ? { opacity: "0.4" } : { opacity: "1.0" }}
      >
        {isLoading ? "Loading" : label}
      </button>
      <p>{error}</p>
    </form>
  );
}
