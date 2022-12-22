import { request } from "./request";

export function fetchPosts() {
  return request("/posts");
}

export function fetchPost(id) {
  return request(`/posts/${id}`);
}
