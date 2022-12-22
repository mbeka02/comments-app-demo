import { usePost } from "../hooks/usePost";
import reply from "../images/icon-reply.svg";
import delete_icon from "../images/icon-delete.svg";
import edit_icon from "../images/icon-edit.svg";
import { useState } from "react";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

import {
  CreateComment,
  DeleteComment,
  EditComment,
  Upvote,
  Downvote,
} from "../services/comments";
import { useAsyncFn } from "../hooks/useAsync";
import { useUser } from "../hooks/useUser";
import { AnimatePresence } from "framer-motion";
import Modal from "./Modal";

export default function Comment({ id, message, user, createdAt, likeCount }) {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const {
    post,
    getReplies,
    createLocal,
    deleteLocal,
    editLocal,
    setUpvote,
    setDownvote,
    Open,
    Close,
    openModal,
  } = usePost();
  const createFn = useAsyncFn(CreateComment);
  const deleteFn = useAsyncFn(DeleteComment);
  const editFn = useAsyncFn(EditComment);
  const likeFn = useAsyncFn(Upvote);
  const unlikeFn = useAsyncFn(Downvote);
  const child = getReplies(id);
  const [hideComments, setHideComments] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const currentUser = useUser();

  function toggle() {
    setHideComments((prev) => !prev);
  }
  function onReply(message) {
    return createFn
      .exe({ postId: post.id, message, parentId: id })
      .then((comment) => {
        setIsReplying(false);
        createLocal(comment);
      });
  }
  function onDelete() {
    return deleteFn
      .exe({ postId: post.id, message, id })
      .then((comment) => deleteLocal(comment.id))
      .then(Close);
  }

  function onEdit(message) {
    return editFn.exe({ postId: post.id, message, id }).then((comment) => {
      setIsEditing(false);
      editLocal({ id, message: comment.message });
    });
  }
  function onUpvote() {
    return likeFn
      .exe({ postId: post.id, id })
      .then(({ addLike }) => setUpvote(id, addLike));
  }
  function onDownvote() {
    return unlikeFn
      .exe({ postId: post.id, id })
      .then(({ addLike }) => setDownvote(id, addLike));
  }

  return (
    <>
      <div className="comments">
        <div className="comments--likes">
          <div
            className="plus"
            onClick={onUpvote}
            disabled={likeFn.isLoading}
          ></div>
          <span className="like-count">{likeCount}</span>
          <div className="minus" onClick={onDownvote}></div>
        </div>
        <div className="comments--main">
          <div className="comments--main--upper">
            <div className="comments--details">
              <div className="user-info">
                <p className="name">{user.user}</p>
                {currentUser.id === user.id && (
                  <span className="personal-comments">you</span>
                )}
              </div>
              <span className="date">
                {dateFormatter.format(Date.parse(createdAt))}
              </span>
            </div>

            {currentUser.id === user.id ? (
              <div className="comment-controls">
                <div onClick={Open /*onDelete*/} className="delete-btn">
                  <img src={delete_icon} alt="delete" className="delete-icon" />
                  <span>Delete</span>
                </div>

                <div
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="edit-btn"
                >
                  <img src={edit_icon} alt="edit" className="edit-icon" />
                  <span>Edit</span>
                </div>
                <AnimatePresence initial={false} mode={"wait"}>
                  {openModal && <Modal handleDelete={onDelete} />}
                </AnimatePresence>
              </div>
            ) : (
              <div
                className="reply-btn"
                onClick={() => setIsReplying((prev) => !prev)}
              >
                <img src={reply} alt="reply" className="reply-icon" />
                <span>Reply</span>
              </div>
            )}
          </div>
          {isEditing ? (
            <CommentForm
              InitialVal={message}
              onSub={onEdit}
              isLoading={editFn.isLoading}
              error={editFn.error}
              label="update"
            />
          ) : (
            <div className="paragraph-container">
              <p className="message">{message}</p>
            </div>
          )}
        </div>
      </div>
      {isReplying && (
        <CommentForm
          isLoading={createFn.isLoading}
          error={createFn.error}
          onSub={onReply}
          label="reply"
        />
      )}
      {child?.length > 0 && (
        <>
          <div className={`comments-stack ${hideComments ? "hide" : "show"}`}>
            <button className="collapse-line" onClick={toggle}></button>
            <div className="nested-comments">
              <CommentList rootComments={child} />
            </div>
          </div>
          <button onClick={toggle} className="hide-btn">
            {hideComments ? `Show replies` : "Hide Replies"}
          </button>
        </>
      )}
    </>
  );
}
