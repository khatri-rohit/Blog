import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiLogoGithub, BiSearch } from "react-icons/bi";
import { BsMoonStars } from "react-icons/bs";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { GiBookmarklet } from "react-icons/gi";
import { HiOutlineLogout } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { SlNote } from "react-icons/sl";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import useUsers from "../context/User";
import useTheme from "../context/theme";
import { LoignModel } from "../utils/LoignModel";
import Model from "../utils/Model";
import { IoMoonOutline } from "react-icons/io5";
import { MdOutlineWbSunny } from "react-icons/md";
import { LuSun } from "react-icons/lu";

const Navbar = () => {

    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { darkTheme, lightTheme, themeMode } = useTheme(); // Theme Context API
    const [username, setUsername] = useState(false);
    const [value, setValue] = useState('');
    const [error, setError] = useState('')
    const [isDark, setIsDark] = useState(false);

    const [eye, setEye] = useState(false);
    const [search, setSearch] = useState('');
    const [timeoutId, setTimeoutId] = useState();
    const [model, setModel] = useState(false);
    const [login, setLogin] = useState(false);
    const [reg, setRegister] = useState(false);
    const [cur_user, setCur_user] = useState(false);

    const [userCre, setUserCre] = useState({
        username: "",
        name: "",
        nameError: "",
        email: "",
        password: "",
        confirmPassword: "",
        usernameError: "",
        emailError: "",
        passwordError: "",
        confirmPasswordError: ""
    });


    const {
        user,
        oAuthStateChange,
        changeSearchResult,
        searchResult,
        changePublish,
    } = useUsers();

    const darkMode = () => {
        if (isDark) lightTheme();
        else darkTheme();
        setIsDark(prev => !prev);
    }

    useEffect(() => {
        themeMode === "dark" ? setIsDark(true) : setIsDark(false);
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (login) {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
                if (emailRegex.test(userCre.email) && userCre.password.length >= 8) {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: userCre.email,
                        password: userCre.password
                    });
                    if (data.user) {
                        setCur_user(data.user);
                        loggedInUser(data.user);
                        oAuthStateChange(data.user);
                        handleTost("Successfully LoggedIn ✨");
                        setLogin(false);
                        setUserCre({ ...userCre, confirmPassword: "", email: "", confirmPasswordError: "", emailError: "", name: "", nameError: "", password: "", passwordError: "", username: "", usernameError: "" });
                    }

                    if (error.code === "invalid_credentials") {
                        handleTost("Invalid Credentials Try Again ❌");
                        setUserCre({ ...userCre, confirmPassword: "", email: "", confirmPasswordError: "", emailError: "", name: "", nameError: "", password: "", passwordError: "", username: "", usernameError: "" });
                        return;
                    }
                } else {
                    if (!emailRegex.test(userCre.email))
                        setUserCre({ ...userCre, emailError: "InValid Email" })
                    if (userCre.password.length < 8)
                        setUserCre({ ...userCre, passwordError: "Password must be 8 characters" })
                }

            } else {
                const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
                const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

                if (usernameRegex.test(userCre.username)
                    && userCre.name.trim().length > 0
                    && emailRegex.test(userCre.email)
                    && userCre.password.length >= 8 &&
                    userCre.confirmPassword === userCre.password) {

                    const { data } = await supabase.auth.signUp({
                        email: userCre.email,
                        password: userCre.password
                    });

                    if (data) {
                        try {
                            await supabase
                                .from('users')
                                .insert({
                                    id: data.user.id,
                                    username: userCre.username,
                                    name: userCre.name,
                                    email: userCre.email,
                                    created_at: user.created_at,
                                    avatar_url: null,
                                    bio: ""
                                });
                        } catch (error) {
                            console.log("Error", error);
                        }
                        loggedInUser(data.user);
                        oAuthStateChange(data.user);
                        setRegister(false);
                        setUserCre({ ...userCre, confirmPassword: "", email: "", confirmPasswordError: "", emailError: "", name: "", nameError: "", password: "", passwordError: "", username: "", usernameError: "" });
                    }
                } else {
                    if (!usernameRegex.test(userCre.username))
                        setUserCre({ ...userCre, usernameError: "Not a valid username" })
                    if (!emailRegex.test(userCre.email))
                        setUserCre({ ...userCre, emailError: "Enter Valid Email" })
                    if (userCre.name.trim().length === 0)
                        setUserCre({ ...userCre, nameError: "Can't submit ampty author name" })
                    if (userCre.password.length < 8)
                        setUserCre({ ...userCre, passwordError: "Password is short" })
                    if (userCre.confirmPassword !== userCre.password)
                        setUserCre({ ...userCre, confirmPasswordError: "Password Doesn't Match" })

                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const setUserName = async (e) => {
        e.preventDefault();
        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
        if (usernameRegex.test(value)) {
            await supabase
                .from('users')
                .update({
                    username: value
                }).eq("id", cur_user.id)
            setUsername(false);
            handleTost("🎉 Registered successfully")
            loggedInUser(cur_user);
            console.log(cur_user);
        } else {
            if (value.trim().length > 0)
                setError("only use underscore, charaters, number")
            else {
                setError("can't be empty")
            }
            setUsername(true);
        }
    }

    const githubSignIn = async () => {
        try {
            await supabase.auth.signInWithOAuth({
                provider: "github",
            });
            setRegister(false);
            setLogin(false);
        } catch (error) {
            console.log(error);
        }
    }

    const signOut = async () => {
        try {
            await supabase.auth.signOut()
            oAuthStateChange([]);
            setModel(false);
            navigate('/');
        } catch (error) {
            console.log("Error While Logout -> ", error);
        }
    };

    const googleSighUp = async () => {
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            setRegister(false);
            setLogin(false)
        } catch (error) {
            console.log(error);
        }
    };

    const loggedInUser = async (user) => {
        try {
            const { data } = await supabase
                .from('users')
                .select()
                .eq('id', user.id);

            if (data.length === 0) {
                await supabase
                    .from('users')
                    .insert([{
                        id: user.id,
                        username: "",
                        name: user.user_metadata.full_name,
                        email: user.user_metadata.email,
                        avatar_url: user.user_metadata.avatar_url,
                        bio: ""
                    }]);
                console.log("Successfully Registered");
            }
            const resp = await supabase
                .from('users')
                .select()
                .eq('id', user.id);
            if (resp.data) {
                setCur_user(resp.data[0]);

                if (resp.data[0].username.length <= 0) {
                    setUsername(true)
                } else {
                    setUsername(false);
                }
            }
        } catch (error) {
            console.log("Error", error);
        }
    }

    useEffect(() => {
        ; (async () => {
            const { data } = await supabase.auth.getSession()
            if (data.session !== null) {
                console.log("Session Created");
                oAuthStateChange(data.session.user);
                loggedInUser(data.session.user);
            } else {
                console.log("No Session");
            }
        })();
    }, [])

    // Remove Scroll while Login Model is Open
    useEffect(() => {
        if (model || login || reg)
            document.body.style.overflow = model || login || reg ? "hidden" : "unset";
    }, [login, model, reg]);

    const handleTost = (text) => {
        toast(text, {
            duration: 1500,
            position: 'top-right',

            // Styling
            style: { padding: '1rem 1.5rem' },
            className: 'font-bold',

            // Custom Icon
            icon: '🎉',

            // Change colors of success/error/loading icon
            iconTheme: {
                primary: '#000',
                secondary: '#fff',
            },

            // Aria
            ariaProps: {
                role: 'alert',
                'aria-live': 'polite',
            },
        });
    };

    const handleSearch = useCallback((e) => {
        const input = e.target.value;
        setSearch(input);
        setTimeoutId(
            setTimeout(() => {
                changeSearchResult(input);
            }, 500)
        );
    }, [searchResult])

    const handleSearchSubmit = useCallback((e) => {
        e.preventDefault();
        if (search.trim().length === 0) {
            toast("Enter Something", {
                duration: 800,
                position: 'top-center',

                // Styling
                style: { padding: '1rem 1.5rem' },
                // className: 'font-light',

                // Change colors of success/error/loading icon
                iconTheme: {
                    primary: '#000',
                    secondary: '#fff',
                },

                // Aria
                ariaProps: {
                    role: 'alert',
                    'aria-live': 'polite',
                },
            });
            return
        }
        changeSearchResult(search);
        navigate(`/search?q=${encodeURIComponent(search)}`)
    }, [search]);

    const emptyData = () => {
        setUserCre({ ...userCre, confirmPassword: "", email: "", confirmPasswordError: "", emailError: "", name: "", nameError: "", password: "", passwordError: "", username: "", usernameError: "" });
    }

    useEffect(() => {
        return () => clearTimeout(timeoutId);
    }, [timeoutId]);

    return (
        <>
            <Toaster
                position="top-center"
            />

            {reg &&
                <LoignModel model={reg}>
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 shadow-sm mx-auto lg:w-[28%] md:w-[40%] w-[80%] bg-[#E9EFEC]">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow p-2 dark:bg-transparent dark:bg-[#787A91]">
                            {/* <!-- Modal header --> */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <p className="md:text-xl lg:text-lg text-[1em] font-semibold text-gray-900 dark:text-white">
                                    Welcome to <span className="dark:text-slate-200">DevDiscuss</span>
                                </p>
                                <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white outline-none" data-modal-hide="authentication-modal"
                                    onClick={() => setRegister(false)}>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* <!-- Modal body --> */}
                            <div className="p-4 md:p-5">
                                <button
                                    className="my-3 w-full border bg-slate-200 text-slate-500 hover:bg-slate-300 font-medium rounded-lg md:text-sm text-[0.7em] px-5 py-3 text-center dark:text-black dark:hover:bg-opacity-85 flex items-center justify-center outline-none" onClick={googleSighUp}>
                                    <img src="/google.png" className="w-6 mx-2" />
                                    Continue with Google
                                </button>
                                <button
                                    className="my-3 w-full border text-white bg-gray-700 hover:bg-gray-900 font-medium rounded-lg md:text-sm text-[0.7em] px-5 py-3 text-center dark:bg-gray-700 dark:hover:bg-gray-900 flex items-center justify-center outline-none" onClick={githubSignIn}>
                                    <BiLogoGithub
                                        className="mx-1 md:text-2xl text-[1em]" />
                                    Continue with Github
                                </button>
                                <p className="font-medium text-center my-2">Or</p>
                                <form className="space-y-4"
                                    onSubmit={onSubmit}>
                                    <div>
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={userCre.username}
                                            className="bg-gray-50 dark:text-slate-200  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-400 dark:placeholder-slate-200 outline-none"
                                            placeholder="Username" autoFocus
                                            onChange={e => setUserCre({ ...userCre, username: e.target.value })} />
                                        {
                                            userCre.usernameError.length > 0 &&
                                            <p className="text-red-500 text-sm">
                                                {userCre.usernameError}
                                            </p>
                                        }
                                    </div>
                                    <div>
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={userCre.name}
                                            className="bg-gray-50 dark:text-slate-200  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-400 dark:placeholder-slate-200 outline-none"
                                            placeholder="Enter Name" autoFocus
                                            onChange={e => setUserCre({ ...userCre, name: e.target.value })} />
                                        {
                                            userCre.nameError.length > 0 &&
                                            <p className="text-red-500 text-sm">
                                                {userCre.nameError}
                                            </p>
                                        }
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Your email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="bg-gray-50 dark:text-slate-200  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-400 dark:placeholder-slate-200 outline-none"
                                            placeholder="Email"
                                            value={userCre.email}
                                            onChange={e => setUserCre({ ...userCre, email: e.target.value })}
                                        />
                                        {
                                            userCre.emailError.length > 0 &&
                                            <p className="text-red-500 text-sm">
                                                {userCre.emailError}
                                            </p>
                                        }
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Your password
                                        </label>
                                        <div className="bg-gray-50 text-sm rounded-lg w-full p-2.5 dark:bg-gray-400 dark:text-white active:bg-slate-200  flex items-center justify-between">
                                            <input
                                                type={eye ? `text` : `password`}
                                                name="password"
                                                placeholder="••••••••"
                                                className="outline-none bg-transparent dark:placeholder-slate-200 dark:text-slate-200 text-gray-900"
                                                value={userCre.password}
                                                onChange={e => setUserCre({ ...userCre, password: e.target.value })}
                                            />
                                            <div className="text-[1rem]"
                                                onClick={() => setEye(!eye)}>
                                                {eye ? <FaRegEyeSlash className="text-gray-600" /> : <FaRegEye className="text-gray-600" />}
                                            </div>
                                        </div>
                                        {
                                            userCre.passwordError.length > 0 &&
                                            <p className="text-red-500 text-sm">
                                                {userCre.passwordError}
                                            </p>
                                        }
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Confirm password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="••••••••"
                                            className="bg-gray-50 dark:text-slate-200  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-400 dark:placeholder-slate-200 outline-none"
                                            value={userCre.confirmPassword}
                                            onChange={e => setUserCre({ ...userCre, confirmPassword: e.target.value })} />
                                        {
                                            userCre.confirmPasswordError.length > 0 &&
                                            <p className="text-red-700 text-sm">
                                                {userCre.confirmPasswordError}
                                            </p>
                                        }
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center outline-gray-400 bg-gray-400 hover:bg-opacity-50 text-white">
                                        Create Account
                                    </button>
                                </form>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-300 mt-3">
                                    Already have a Account? <button className="text-blue-700 hover:underline dark:text-blue-500"
                                        onClick={() => {
                                            setLogin(true);
                                            setRegister(false);
                                            emptyData();
                                        }}>
                                        Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </LoignModel>
            }

            {login &&
                <LoignModel model={login}>
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 shadow-sm mx-auto lg:w-[30%] md:w-[40%] w-[80%] bg-[#E9EFEC]">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow p-2 dark:bg-transparent dark:bg-[#787A91]">
                            {/* <!-- Modal header --> */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-slate-400">
                                <p className="md:text-xl lg:text-lg text-[1em] font-semibold text-gray-900 dark:text-white">
                                    Welcome Back <span className="dark:text-slate-200">DevDiscuss</span>
                                </p>
                                <button type="button"
                                    className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white outline-none" data-modal-hide="authentication-modal"
                                    onClick={() => setLogin(false)}>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* <!-- Modal body --> */}
                            <div className="p-4 md:p-5">
                                <button
                                    className="my-3 w-full border bg-slate-200 text-slate-500 hover:bg-slate-300 font-medium rounded-lg md:text-sm text-[0.7em] px-5 py-3 text-center dark:text-black dark:hover:bg-opacity-85 flex items-center justify-center outline-none" onClick={googleSighUp}>
                                    <img src="/google.png" className="w-6 mx-2" />
                                    Continue with Google
                                </button>
                                <button
                                    className="my-3 w-full border text-white bg-gray-700 hover:bg-gray-900 font-medium rounded-lg md:text-sm text-[0.7em] px-5 py-3 text-center dark:bg-gray-700 dark:hover:bg-gray-900 flex items-center justify-center outline-none" onClick={githubSignIn}>
                                    <BiLogoGithub
                                        className="mx-1 md:text-2xl text-[1em]" />
                                    Continue with Github
                                </button>
                                <p className="font-medium text-center w-full dark:text-white">Or</p>
                                <form className="space-y-4"
                                    onSubmit={onSubmit}>
                                    <div>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="bg-gray-50 dark:text-slate-200  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-400 dark:placeholder-slate-200 outline-none"
                                            placeholder="Email" autoFocus
                                            value={userCre.email}
                                            onChange={e => setUserCre({ ...userCre, email: e.target.value })} />
                                        {
                                            userCre.emailError.length > 0 &&
                                            <p className="text-red-500 text-sm">
                                                {userCre.emailError}
                                            </p>
                                        }
                                    </div>
                                    <div>
                                        <label htmlFor="password"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Password
                                        </label>
                                        <div className="bg-gray-50 text-sm rounded-lg w-full p-2.5 dark:bg-gray-400 dark:text-white active:bg-slate-200  flex items-center justify-between">
                                            <input
                                                type={eye ? `text` : `password`}
                                                name="password"
                                                placeholder="••••••••"
                                                className="outline-none bg-transparent dark:placeholder-slate-200 dark:text-slate-200 text-gray-900"
                                                value={userCre.password}
                                                onChange={e => setUserCre({ ...userCre, password: e.target.value })}
                                            />
                                            <div className="text-[1rem]"
                                                onClick={() => setEye(!eye)}>
                                                {eye ? <FaRegEyeSlash className="text-gray-600" /> : <FaRegEye className="text-gray-600" />}
                                            </div>
                                        </div>
                                        {
                                            userCre.passwordError.length > 0 &&
                                            <p className="text-red-500 text-sm">
                                                {userCre.passwordError}
                                            </p>
                                        }
                                    </div>
                                    <button
                                        onClick={onSubmit}
                                        className="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center outline-gray-400 bg-gray-400 hover:bg-opacity-50 text-white">
                                        Login to your account
                                    </button>
                                </form>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-300 mt-2">
                                    Not registered?
                                    <button className="text-blue-500 hover:underline dark:text-slate-300 mx-1"
                                        onClick={() => {
                                            setRegister(true);
                                            setLogin(false);
                                            emptyData();
                                        }}>
                                        Create account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div >
                </LoignModel >
            }

            {
                username &&
                <LoignModel model={username}>
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-30 shadow-sm mx-auto lg:w-[25%] md:w-[40%] w-[80%] bg-slate-200 p-4 rounded-lg">
                        <form className="space-y-4"
                            onSubmit={setUserName}>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Set User_name</label>
                            <input
                                type="text"
                                name="username"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="username"
                                autoFocus
                                value={value}
                                onChange={e => setValue(e.target.value)} />
                            {
                                error.length > 0 &&
                                <p className="text-red-500 text-sm">
                                    {error}
                                </p>
                            }
                            <button
                                onClick={setUserName}
                                className="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center outline-gray-400 bg-[#2b6eff] text-white">
                                Confirm
                            </button>
                        </form>
                    </div>
                </LoignModel>
            }

            <nav className="flex items-center justify-between md:px-2 py-4 border-b-2">
                <div className="flex items-center justify-between">
                    <NavLink to={'/'} className="flex items-center mx-3 outline-none">
                        {themeMode ? <img src={themeMode == "dark" ? "/whiteblogicon.png" : "/blogicon.png"}
                            className="min-w-10 w-10" /> : <img src="/blogicon.png" className="min-w-10 w-10 m-0" />}
                        <p className="mx-2 hidden md:block font-semibold text-2xl dark:text-white">
                            DevDiscuss
                        </p>
                    </NavLink>
                    <form
                        className="input-feild flex mx-1 items-center bg-slate-200 rounded-xl w-full"
                        onSubmit={handleSearchSubmit}
                    >
                        <div className="mx-1"
                            onSubmit={handleSearchSubmit}>
                            <BiSearch className="text-2xl mx-2" />
                        </div>
                        <input type="text"
                            className="p-2 bg-transparent rounded-xl outline-none placeholder:dark:text-black w-[80%] md:w-full"
                            placeholder="Search"
                            value={search}
                            onChange={e => handleSearch(e)}
                        />
                    </form>
                </div>
                {
                    Object.keys(user).length !== 0 ?
                        (
                            <div className="flex items-center justify-between">
                                {
                                    pathname === '/write' ? (
                                        <button
                                            className="px-5 py-1 bg-[#1E3E62] hover:bg-[#1E3E62]/50 rounded-full text-white md:mx-3 md:text-xl text-[0.8em]"
                                            onClick={() => changePublish(true)}>
                                            Post
                                        </button>
                                    )
                                        : <NavLink to={"/write"} className="flex items-center mx-1">
                                            <div className="mx-3 flex items-center hover:text-slate-500 cursor-pointer">
                                                <SlNote className="dark:text-white text-xl" />
                                                <p className="mx-1 font-normal dark:text-white">
                                                    Write
                                                </p>
                                            </div>
                                        </NavLink>
                                }
                                <div className="mx-1" >
                                    <div className="flex items-center cursor-pointer"
                                        onClick={() => setModel(prev => !prev)}>
                                        <img src={cur_user?.avatar_url || "/blank-avatar.webp"}
                                            className="w-[4.1em] h-[2.75em] md:w-[3.2em] md:h-[2.8em] lg:w-[3em] lg:h-[2.95em] object-cover rounded-full hover:scale-90 transition-all duration-200 relative"
                                        />
                                        <IoIosArrowDown className="mx-2 hidden md:block dark:text-white" />
                                    </div>

                                    <Model model={model} setModel={setModel}>
                                        <div className={`absolute z-30 right-7 my-2 bg-slate-100 border border-gray-300 px-2 py-2 w-60 items-start justify-start ${model || `hidden`}`} >
                                            <div className="flex gap-2 items-center px-3 py-1 justify-start cursor-pointer">
                                                <img src={cur_user?.avatar_url || "/blank-avatar.webp"} className="rounded-full w-[2rem] h-[2rem] object-cover" />
                                                <NavLink to={`/user/${cur_user?.username}`}
                                                    onClick={() => setModel(false)}
                                                    className="text-xl font-medium hover:text-slate-500 text-slate-900 mx-1">
                                                    Profile
                                                </NavLink>
                                            </div>
                                            <NavLink to={`/user/${cur_user?.username}#bookmarks`} className="flex gap-2 items-center px-3 py-1 justify-start cursor-pointer" onClick={() => setModel(false)}>
                                                <GiBookmarklet className="text-2xl" />
                                                <p className="text-xl font-medium hover:text-slate-500 text-slate-900 mx-3">
                                                    Saved Posts
                                                </p>
                                            </NavLink>
                                            <div className="flex items-center justify-start px-3 py-1 my-1 cursor-pointer">
                                                <div className="w-[50%] bg-gray-500 py-2 px-2  rounded-s-lg" onClick={darkMode}>
                                                    <BsMoonStars className="text-white text-[1.2em] mx-2" />
                                                </div>
                                                <div className="w-[50%] bg-slate-300 py-2 px-2  rounded-e-lg" onClick={darkMode}>
                                                    <LuSun className="text-[1.2em] mx-2" />
                                                </div>
                                            </div>
                                            <div className="flex gap-2 items-center px-3 py-1 justify-start cursor-pointer"
                                                onClick={signOut}>
                                                <HiOutlineLogout className="text-2xl hover:opacity-85" />
                                                <p className="text-xl font-medium hover:text-slate-500 text-slate-900 mx-3">
                                                    Logout
                                                </p>
                                            </div>
                                        </div>
                                    </Model>

                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center">
                                    <button onClick={darkMode}>
                                        {themeMode !== "dark" ? (
                                            <IoMoonOutline className="w-8 h-8 mx-5" />
                                        ) : (
                                            <MdOutlineWbSunny className="w-8 h-8 mx-5 dark:text-white" />
                                        )}
                                    </button>
                                    <button className="bg-slate-300 md:px-4 p-2 rounded-md text-[1em] outline-none"
                                        onClick={() => {
                                            setLogin(true);
                                            emptyData();
                                        }}>
                                        SignIn
                                    </button>
                                </div>
                            </>
                        )
                }
            </nav>
        </>
    )
};

export default Navbar;
