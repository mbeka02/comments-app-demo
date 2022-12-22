import Postlists from "./components/PostLists";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import { PostProivder } from "./Context/PostContext";
import Post from "./components/Post";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Postlists />} />
      <Route
        path="/posts/:id"
        element={
          <PostProivder>
            <Post />
          </PostProivder>
        }
      />
    </Routes>
  );
}

export default App;
