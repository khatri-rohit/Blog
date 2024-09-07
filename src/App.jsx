import { useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import './App.css';
import { ContextProvider } from './context/User.jsx';
import Layout from "./layout/Layout";
import Create from "./pages/Create";
import Home from "./pages/Home";
import Post from "./pages/Post";
import UserBlogs from "./pages/UserBlogs";
import Search from "./pages/Search.jsx";

const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} >
        <Route index element={<Home />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/search" element={<Search />} />
        <Route path="/create" element={<Create />} />
        <Route path="/posts" element={<UserBlogs />} />
      </Route>
    )
  );

  const [model, setModel] = useState(false);
  const [showNewUser, setNewUser] = useState(false);
  const [user, setUser] = useState({});
  const [searchResult, setSearchResult] = useState('');
  const [getPost, setGetPost] = useState([]);

  const oAuthStateChange = (data) => {
    setUser(data);
  };

  const chnageNewUser = () => {
    setNewUser(prev => {
      return !prev;
    });
  };

  const changeModel = (value) => {
    setModel(value);
  };

  const changeSearchResult = (result) => {
    setSearchResult(result);
  }

  const getPosts = (post) =>{
    setGetPost(post);
  }

  return (
    <ContextProvider value={
      { model, oAuthStateChange, changeModel, user, chnageNewUser, showNewUser, searchResult, changeSearchResult, getPost, getPosts }
    }>
      <div className="p-2">
        <RouterProvider router={router} />
      </div>
    </ContextProvider>
  )
};

export default App;
