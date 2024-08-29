import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import Layout from "./layout/Layout";
import Create from "./pages/Create";
import Home from "./pages/Home";
import Post from "./pages/Post";
import UserBlogs from "./pages/UserBlogs";
import { ContextProvider } from './context/User.jsx';
import './App.css';
import { useState } from "react";

const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} >
        <Route index element={<Home />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/create" element={<Create />} />
        <Route path="/posts" element={<UserBlogs />} />
      </Route>
    )
  )

  const [model, setModel] = useState(false);
  const user = {};
  const oAuthStateChange = () => {
    console.log("Auth State Change");
  };
  const changeModel = () => {
    setModel(prev => !prev);
    console.log("Model State Change ", model);
  }

  return (
    <ContextProvider value={{ model, oAuthStateChange, changeModel, user }}>
      <div className="p-2">
        <RouterProvider router={router} />
      </div>
    </ContextProvider>
  )
};

export default App;
