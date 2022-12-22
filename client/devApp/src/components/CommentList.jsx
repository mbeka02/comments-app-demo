import Comment from "./Comment";

export default function CommentList({ rootComments }) {
  return rootComments.map((x) => (
    <div key={x.id} className="comments-container">
      <Comment {...x} />
    </div>
  ));
}
