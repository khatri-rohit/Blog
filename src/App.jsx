import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Create from "./pages/Create";

const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} >
        <Route path="" element={<Home />} />
        <Route path="/:id" element={<Create />} />
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
