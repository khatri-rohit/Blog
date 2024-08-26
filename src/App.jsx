import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Post from "./pages/Post";

const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} >
        <Route index element={<Home />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/create" element={<Create />} />
      </Route>
    )
  )

  return (
    <div className="p-2">
      <RouterProvider router={router} />
    </div>
  )
};

export default App;
