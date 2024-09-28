import { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import { ScaleLoader } from 'react-spinners';
import { ThemeProvider } from "./context/theme.js";
import { ContextProvider } from './context/User.jsx';
import './App.css';

const App = () => {

  const [user, setUser] = useState([]);
  const [searchResult, setSearchResult] = useState('');
  const [getPost, setGetPost] = useState([]);
  const [themeMode, setThemeMode] = useState(false);
  const [publish, setPublish] = useState(false);

  const oAuthStateChange = (data) => {
    setUser(data);
    console.log(data);
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
          <ScaleLoader color="#B2B1B9" />
        </div>
      </>
    )
  }

  const darkTheme = () => {
    setThemeMode('dark');
    localStorage.setItem("theme", 'dark');
  }

  const lightTheme = () => {
    setThemeMode('light');
    localStorage.setItem("theme", 'light');
  }

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    setThemeMode(localTheme);
  }, []);

  const changePublish = (value) => {
    setPublish(value);
  }

  useEffect(() => {
    document.querySelector('html').classList.remove('dark', 'light');
    document.querySelector('html').classList.add(themeMode);
    if (themeMode === 'dark') document.body.style.backgroundColor = "#181D31";
    else document.body.style.backgroundColor = "#f7f7f7";
  }, [themeMode])

  return (
    <ThemeProvider value={{ darkTheme, lightTheme, themeMode }}>
      <ContextProvider value={
        {
          user,
          oAuthStateChange,
          searchResult,
          changeSearchResult,
          getPost,
          getPosts,
          changePublish,
          publish,
        }
      }>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <div className="p-2">
              <Routes>
                <Route path="/" Component={lazy(() => import("./layout/Layout"))}>
                  <Route index Component={lazy(() => import("./pages/Home"))} />
                  <Route path="/post/:id" Component={lazy(() => import("./pages/Post"))} />
                  <Route path="/search" Component={lazy(() => import("./pages/Search"))} />
                  <Route path="/write" Component={lazy(() => import("./pages/Create"))} />
                  <Route path="/:id" Component={lazy(() => import("./pages/Profile"))} />
                  <Route path="/*" Component={lazy(() => import("./pages/Redirect"))} />
                </Route>
              </Routes>
            </div>
          </Suspense>
        </BrowserRouter>
      </ContextProvider>
    </ThemeProvider>
  )
};

export default App;
