export function useUser() {
  //regex
  return { id: document.cookie.match(/userId=(?<id>[^;]+);?$/).groups.id };
}
