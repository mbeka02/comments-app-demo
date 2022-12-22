import { useContext } from "react";
import { PostContext } from "../Context/PostContext";

export const usePost = () => useContext(PostContext);
