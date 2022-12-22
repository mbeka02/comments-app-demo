import { createContext } from "react";
import { fetchPost } from "../services/posts";
import { useAsync } from "../hooks/useAsync";
import { useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import Loader from "../components/Loader";

export const PostContext = createContext();

export const PostProivder = ({ children }) => {
  const { id } = useParams();
  const { isLoading, error, value: post } = useAsync(() => fetchPost(id), [id]);
  const [comments, setComments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [countHandler, setcountHandler] = useState(false);

  if (error) return <p className="error">{error}</p>;
  // console.log(post);
  const groupComments = useMemo(() => {
    const group = {};

    comments.forEach((comment) => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [comments]);

  useEffect(() => {
    if (post?.comments == null) return;
    setComments(post.comments);
  }, [post?.comments]);

  function getReplies(parentId) {
    return groupComments[parentId];
  }
  //Comment specific functions
  function createLocal(comment) {
    setComments((prevComments) => {
      return [comment, ...prevComments];
    });
  }
  function deleteLocal(id) {
    setComments((comments) => comments.filter((comment) => comment.id !== id));
  }
  function editLocal({ id, message }) {
    setComments((prev) =>
      prev.map((comment) => {
        return comment.id === id ? { ...comment, message } : comment;
      })
    );
  }

  //Voting
  function setUpvote(id, addLike) {
    setComments((prev) =>
      prev.map((comment) => {
        return comment.id === id && addLike
          ? { ...comment, likeCount: comment.likeCount + 1, likedByMe: true }
          : comment;
      })
    );
    setcountHandler(false);
  }
  function setDownvote(id, addLike) {
    setComments((prev) =>
      prev.map((comment) => {
        return comment.id === id &&
          !addLike &&
          comment.likeCount > 0 &&
          !countHandler
          ? { ...comment, likeCount: comment.likeCount - 1, likedByMe: false }
          : comment;
      })
    );
    setcountHandler(true);
  }

  //Modal specific functions
  const Open = () => {
    setOpenModal(true);
  };
  const Close = () => {
    setOpenModal(false);
  };

  return (
    <PostContext.Provider
      value={{
        post: { id, ...post },

        rootComments: groupComments[null],
        getReplies,
        createLocal,
        deleteLocal,
        editLocal,
        openModal,
        Open,
        Close,
        setUpvote,
        setDownvote,
      }}
    >
      {isLoading ? <Loader /> : children}
    </PostContext.Provider>
  );
};
