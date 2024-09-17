import { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import { ScaleLoader } from 'react-spinners';
import './App.css';
import { ThemeProvider } from "./context/theme.js";
import { ContextProvider } from './context/User.jsx';

const App = () => {

  const [model, setModel] = useState(false);
  const [showNewUser, setNewUser] = useState(false);
  const [user, setUser] = useState({});
  const [searchResult, setSearchResult] = useState('');
  const [getPost, setGetPost] = useState([]);
  const [themeMode, setThemeMode] = useState(false);

  const oAuthStateChange = (data) => {
    setUser(data);
  };

  const chnageNewUser = () => {
    setNewUser(prev => !prev);
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
    if (localTheme === null) {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(isDarkMode ? 'dark' : 'light');
    } else {
      setThemeMode(localTheme);
    }
  }, []);

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
          model,
          oAuthStateChange,
          changeModel,
          user,
          chnageNewUser,
          showNewUser,
          searchResult,
          changeSearchResult,
          getPost,
          getPosts
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
                  <Route path="/create" Component={lazy(() => import("./pages/Create"))} />
                  <Route path="/profile"
                    Component={lazy(() => import("./pages/Profile"))} />
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
