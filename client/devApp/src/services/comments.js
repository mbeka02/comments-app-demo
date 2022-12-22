import { request } from "./request";

export function CreateComment({ postId, message, parentId }) {
  return request(`/posts/${postId}/comments`, {
    method: "POST",
    data: { message, parentId },
  });
}
export function EditComment({ postId, message, id }) {
  return request(`/posts/${postId}/comments/${id}`, {
    method: "PUT",
    data: { message },
  });
}

export function DeleteComment({ postId, id }) {
  return request(`/posts/${postId}/comments/${id}`, {
    method: "DELETE",
  });
}

export function Upvote({ postId, id }) {
  return request(`/posts/${postId}/comments/${id}/Upvote`, {
    method: "POST",
  });
}
export function Downvote({ postId, id }) {
  return request(`/posts/${postId}/comments/${id}/Downvote`, {
    method: "POST",
  });
}
