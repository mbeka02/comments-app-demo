import { fetchPosts } from "../services/posts";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import Loader from "./Loader";
export default function Postlists() {
  /*const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios
      .get("/api/posts")
      .then((res) => setPosts(res.data))
      .catch((error) => console.log(error));
    fetchPosts().then(setPosts);
  }, []);*/
  const { isLoading, error, value: posts } = useAsync(fetchPosts);
  if (isLoading) return <Loader />;
  if (error) return <p className="error">{error}</p>;

  const renderPosts = posts?.map((post) => {
    return (
      <h1 key={post.id}>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h1>
    );
  });
  return <div>{renderPosts}</div>;
}
