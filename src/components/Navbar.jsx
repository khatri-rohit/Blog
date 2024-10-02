import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiLogoGithub, BiLogoGoogle, BiSearch } from "react-icons/bi";
import { CgDarkMode } from "react-icons/cg";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { GiBookmarklet } from "react-icons/gi";
import { HiOutlineLogout } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { SlNote } from "react-icons/sl";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import useUsers from "../context/User";
import useTheme from "../context/theme";
import { LoignModel } from "../utils/LoignModel";
import Model from "../utils/Model";

const Navbar = () => {

    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { darkTheme, lightTheme, themeMode } = useTheme(); // Theme Context API
    const [username, setUsername] = useState(false);
    const [value, setValue] = useState('');
    const [error, setError] = useState('')

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
        themeMode === "light" ? setIsDark(false) : setIsDark(true);
    }, []);


    const [eye, setEye] = useState(false);
    const [search, setSearch] = useState('');
    const [timeoutId, setTimeoutId] = useState();
    const [model, setModel] = useState(false);
    const [login, setLogin] = useState(false);
    const [reg, setRegister] = useState(false);
    const [isDark, setIsDark] = useState(false);
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
                // options: {
                //     redirectTo: 'http://localhost:5173'
                // }
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
                // options: {
                //     redirectTo: 'http://localhost:5173'
                // }
            });
            setRegister(false);
            setLogin(false)
        } catch (error) {
            console.log(error);
        }
    };

    const loggedInUser = async (user) => {
        console.log(user);
        try {
            const { data } = await supabase
                .from('users')
                .select()
                .eq('id', user.id);

            console.log(data.length);
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
                console.log(resp.data[0]);

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
                console.log(data.session);
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
    }, [changeSearchResult, search]);

    useEffect(() => {
        return () => clearTimeout(timeoutId);
    }, [timeoutId]);

    return (
        <>
            {reg &&
                <LoignModel model={reg}>
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 shadow-sm mx-auto w-[23%] bg-[#E9EFEC]">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-2">
                            {/* <!-- Modal header --> */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Welcome to <span className="text-gray-600 font-bold">DevDiscuss</span>
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
                                    className="my-3 w-full border bg-white hover:bg-slate-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-gray-500 dark:hover:bg-gray-500 flex items-center justify-center outline-none" onClick={googleSighUp}>
                                    <BiLogoGoogle
                                        className="mx-1 text-2xl text-slate-500" />
                                    Create Account with Google
                                </button>
                                <button
                                    className="my-3 w-full text-white bg-gray-700 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-gray-700 dark:hover:bg-gray-900 flex items-center justify-center outline-none" onClick={githubSignIn}>
                                    <BiLogoGithub
                                        className="mx-1 text-2xl" />
                                    Create Account with Github
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
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="Enter Name" autoFocus
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
                                            Author Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={userCre.name}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
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
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
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
                                        <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white flex items-center justify-between focus:outline-black outline-2">
                                            <input
                                                type={eye ? `text` : `password`}
                                                name="password"
                                                placeholder="••••••••"
                                                className="outline-none bg-transparent"
                                                value={userCre.password}
                                                onChange={e => setUserCre({ ...userCre, password: e.target.value })}
                                            />
                                            <div className="text-[1rem]" onClick={() => setEye(!eye)}>
                                                {eye ? <FaRegEyeSlash /> : <FaRegEye />}
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
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            value={userCre.confirmPassword}
                                            onChange={e => setUserCre({ ...userCre, confirmPassword: e.target.value })} />
                                        {
                                            userCre.confirmPasswordError.length > 0 &&
                                            <p className="text-red-500 text-sm">
                                                {userCre.confirmPasswordError}
                                            </p>
                                        }
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center outline-none bg-slate-500 text-white">
                                        Create Account
                                    </button>
                                </form>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-300 mt-3">
                                    Already have a Account? <button className="text-blue-700 hover:underline dark:text-blue-500"
                                        onClick={() => {
                                            setLogin(true);
                                            setRegister(false);
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
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 shadow-sm mx-auto w-[23%] bg-[#E9EFEC]">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-2">
                            {/* <!-- Modal header --> */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Welcome Back <span className="text-gray-600">DevDiscuss</span>
                                </p>
                                <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white outline-none" data-modal-hide="authentication-modal"
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
                                    className="my-3 w-full border bg-white hover:bg-slate-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-gray-500 dark:hover:bg-gray-500 flex items-center justify-center outline-none" onClick={googleSighUp}>
                                    <BiLogoGoogle
                                        className="mx-1 text-2xl text-slate-500" />
                                    Login to your account
                                </button>
                                <button
                                    className="my-3 w-full text-white bg-gray-700 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-gray-700 dark:hover:bg-gray-900 flex items-center justify-center outline-none" onClick={githubSignIn}>
                                    <BiLogoGithub
                                        className="mx-1 text-2xl" />
                                    Create Account with Github
                                </button>
                                <p className="font-medium text-center my-2">Or</p>
                                <form className="space-y-4"
                                    onSubmit={onSubmit}>
                                    <div>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
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
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Your password
                                        </label>
                                        <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white flex items-center justify-between focus:outline-black outline-2">
                                            <input
                                                type={eye ? `text` : `password`}
                                                name="password"
                                                placeholder="••••••••"
                                                className="outline-none bg-transparent"
                                                value={userCre.password}
                                                onChange={e => setUserCre({ ...userCre, password: e.target.value })}
                                            />
                                            <div className="text-[1rem]" onClick={() => setEye(!eye)}>
                                                {eye ? <FaRegEyeSlash /> : <FaRegEye />}
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
                                        className="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center outline-gray-400 bg-green-500 text-white">
                                        Login to your account
                                    </button>
                                </form>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-300 mt-2">
                                    Not registered?
                                    <button className="text-blue-700 hover:underline dark:text-blue-500 mx-1"
                                        onClick={() => {
                                            setRegister(true);
                                            setLogin(false);
                                        }}>
                                        Create account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </LoignModel>
            }

            {username && <LoignModel model={username}>
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-30 shadow-sm mx-auto w-[20%] bg-slate-100 p-4 rounded-lg">
                    <form className="space-y-4"
                        onSubmit={setUserName}>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Set User_name </label>
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
                            className="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center outline-gray-400 bg-slate-800 text-white">
                            Confirm
                        </button>
                    </form>
                </div>
            </LoignModel>}

            <Toaster
                position="top-center"
            />

            <nav className="flex items-center justify-between px-2 py-4 border-b-2">
                <div className="flex items-center justify-between">
                    <Link to={'/'} className="flex items-center mx-3 outline-none">
                        {themeMode ? <img src={themeMode === "light" ? "/blogicon.png" : "/whiteblogicon.png"}
                            className="w-10" /> : <img src="/blogicon.png" className="w-10" />}
                        <p className="mx-2 font-semibold text-2xl dark:text-white">
                            DevDiscuss
                        </p>
                    </Link>
                    <form
                        className="input-feild flex mx-1 items-center bg-slate-200 rounded-xl"
                        onSubmit={handleSearchSubmit}
                    >
                        <div className="mx-1"
                            onSubmit={handleSearchSubmit}>
                            <BiSearch className="text-2xl mx-2" />
                        </div>
                        <input type="text"
                            className="bg-slate-200 p-2 rounded-xl outline-none placeholder:dark:text-black"
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
                                            className="px-5 py-1 bg-[#1E3E62] hover:bg-[#1E3E62]/50 rounded-full text-white mx-3 text-xl" onClick={() => changePublish(true)}>
                                            Post
                                        </button>
                                    )
                                        : <Link to={"/write"} className="flex items-center mx-1">
                                            <div className="mx-3 flex items-center hover:text-slate-500 cursor-pointer">
                                                <SlNote className="dark:text-white text-xl" />
                                                <p className="mx-1 font-normal dark:text-white">
                                                    Write
                                                </p>
                                            </div>
                                        </Link>
                                }
                                <div className="mx-1" >
                                    <div className="flex items-center cursor-pointer"
                                        onClick={() => setModel(prev => !prev)}>
                                        <img src={cur_user?.avatar_url || "/blank-avatar.webp"}
                                            className="w-10 h-10 object-cover rounded-full hover:scale-75 transition-all duration-75 relative"
                                        />
                                        <IoIosArrowDown className="mx-2 dark:text-white" />
                                    </div>

                                    <Model model={model} setModel={setModel}>
                                        <div className={`absolute z-30 right-7 my-2 bg-slate-100 border-2 border-gray-300 px-2 py-2 w-60 items-start justify-start ${model || `hidden`}`} >
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
                                            <div className="flex gap-2 items-center px-3 py-1 justify-start cursor-pointer"
                                                onClick={() => {
                                                    darkMode();
                                                    setModel(false);
                                                }}>
                                                <CgDarkMode className="text-2xl" />
                                                <p className="text-xl font-medium hover:text-slate-500 text-slate-900 mx-3">
                                                    Dark / Light
                                                </p>
                                            </div>
                                            <div className="flex gap-2 items-center px-3 py-1 justify-start cursor-pointer"
                                                onClick={signOut}>
                                                <HiOutlineLogout className="text-2xl" />
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
                                <div className="flex">
                                    <div className="flex mx-3 gap-2 items-center px-3 py-1 justify-start cursor-pointer"
                                        onClick={darkMode}>
                                        <CgDarkMode className="text-2xl dark:text-white" />
                                    </div>
                                    <button className="bg-slate-300 px-4 p-2 rounded-md text-xl outline-none"
                                        onClick={() => setLogin(true)}>
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
