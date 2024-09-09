import { Suspense, lazy, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import { ScaleLoader } from 'react-spinners';
import './App.css';
import { ContextProvider } from './context/User.jsx';
import Layout from "./layout/Layout";

const Home = lazy(() => import("./pages/Home"))
const Post = lazy(() => import("./pages/Post"))
const Search = lazy(() => import("./pages/Search"))
const Create = lazy(() => import("./pages/Create"))
const UserBlogs = lazy(() => import("./pages/UserBlogs"))

const App = () => {

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

  const getPosts = (post) => {
    setGetPost(post);
  }

  const Loader = () => {
    return (
      <>
        <div className="flex items-center justify-center my-auto p-2 h-screen">
          <ScaleLoader />
        </div>
      </>
    )
  }

  return (
    <ContextProvider value={
      { model, oAuthStateChange, changeModel, user, chnageNewUser, showNewUser, searchResult, changeSearchResult, getPost, getPosts }
    }>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <div className="p-2">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index Component={Home} />
                <Route path="/post/:id" Component={Post} />
                <Route path="/search" Component={Search} />
                <Route path="/create" Component={Create} />
                <Route path="/posts" element={UserBlogs} />
              </Route>
            </Routes>
          </div>
        </Suspense>
      </BrowserRouter>
    </ContextProvider>
  )
};

export default App;
