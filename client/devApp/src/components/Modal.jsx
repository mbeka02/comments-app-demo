import Backdrop from "./Backdrop";
import { motion } from "framer-motion";
import { usePost } from "../hooks/usePost";
import { DeleteComment } from "../services/comments";
import { useAsyncFn } from "../hooks/useAsync";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "-100vh",
    opacity: 0,
  },
};

export default function Modal({ handleDelete }) {
  const { Close } = usePost();

  return (
    <Backdrop>
      <motion.div
        onClick={(e) => e.stopPropagation}
        className="modal"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h2 className="modal-title">Delete comment</h2>
        <p className="modal-info">
          Are you sure you want to delete this comment? This will remove the
          comment and cannot be undone
        </p>
        <div className="button-wrapper">
          <button onClick={Close} className="cancel-delete">
            No, Cancel
          </button>
          <button onClick={handleDelete} className="delete-comment">
            Yes,Delete
          </button>
        </div>
      </motion.div>
    </Backdrop>
  );
}
