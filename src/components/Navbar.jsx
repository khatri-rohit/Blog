import { useEffect, useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import { BiLogoGithub, BiLogoGoogle, BiSearch } from "react-icons/bi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { SlNote } from "react-icons/sl";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import useUsers from "../context/User";

const Navbar = () => {

    // React Hook Form
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset,
        getValues
    } = useForm();

    const {
        model,
        changeModel,
        user,
        oAuthStateChange,
        showNewUser,
        chnageNewUser,
        changeSearchResult
    } = useUsers();

    const modalContainerRef = useRef();
    const modalRef = useRef();
    const showRef = useRef();
    const navigate = useNavigate();

    const [eye, setEye] = useState(false);
    const [search, setSearch] = useState('');
    const [timeoutId, setTimeoutId] = useState();

    const newUser = () => {
        changeModel(!model);
        chnageNewUser();
    }

    const onSubmit = async (data) => {
        try {
            const { email, password, name } = data
            console.log(email, password);
            if (showNewUser) {
                const { data } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                });
                console.log({ ...data, name });
                if (data) {
                    oAuthStateChange({ ...data, name });
                    authUser({ ...data, name });
                    navigate("/");
                    changeModel(!model);
                }
            } else if (model) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                console.log("Login From");
                console.log(data);
                console.log(error);
                oAuthStateChange(data);
                chnageNewUser();
            }
            await new Promise((reslove) => setTimeout(reslove, 100));
            reset();
        } catch (error) {
            console.log(error);
        }
    }

    const authUser = async (response) => {
        try {
            const { user } = response;
            await supabase
                .from('users')
                .insert({
                    id: user.id,
                    name: user.user_metadata.full_name,
                    email: user.email,
                    created_at: user.created_at,
                    avatar_url: user.user_metadata.avatar_url
                });
        } catch (error) {
            console.log(error);
        }
    }

    const githubSignIn = async () => {
        try {
            await supabase.auth.signInWithOAuth({
                provider: "github",
                options: {
                    redirectTo: 'http://localhost:5173'
                }
            });
            changeModel(!model);
            showNewUser && chnageNewUser()
        } catch (error) {
            console.log(error);
        }
    }

    const googleSighUp = async () => {
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'http://localhost:5173'
                }
            });
            changeModel(!model);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!modalContainerRef.current.contains(event.target)) {
                if (!modalRef.current.contains(event.target)) {
                    changeModel(!model);
                }
                if (!showRef.current.contains(event.target)) {
                    chnageNewUser();
                }
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [modalContainerRef, modalRef, showRef]);

    useEffect(() => {
        (async () => {
            try {
                if (user !== null) {
                    const data = (await supabase.auth.getSession()).data
                    oAuthStateChange(data.session.user);
                    authUser(data.session);
                }
            } catch (err) {
                console.log(err);
            }
        })()
    }, [])


    // Remove Scroll while Login Model is Open
    useEffect(() => {
        if (model)
            document.body.style.overflow = model ? "hidden" : "unset";
        else
            document.body.style.overflow = showNewUser ? "hidden" : "unset";
    }, [model, showNewUser]);

    const handleSearch = (e) => {
        const input = e.target.value;
        setSearch(input);
        setTimeoutId(
            setTimeout(() => {
                changeSearchResult(input);
            }, 100)
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        changeSearchResult(search);
        setSearch('');
    };

    useEffect(() => {
        return () => clearTimeout(timeoutId);
    }, [timeoutId])

    return (
        <>

            {showNewUser && (
                <>
                    <div ref={showRef} className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 shadow-sm mx-auto w-[23%] bg-[#E9EFEC]">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-2">
                            {/* <!-- Modal header --> */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Welcome to <span className="text-gray-600 font-bold">DevDiscuss</span>
                                </p>
                                <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white outline-none" data-modal-hide="authentication-modal"
                                    onClick={chnageNewUser} >
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* <!-- Modal body --> */}
                            <div className="p-4 md:p-5">
                                <button
                                    disabled={isSubmitting}
                                    className="my-3 w-full border bg-white hover:bg-slate-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-gray-500 dark:hover:bg-gray-500 flex items-center justify-center outline-none" onClick={googleSighUp}>
                                    <BiLogoGoogle
                                        className="mx-1 text-2xl text-slate-500" />
                                    Create Account with Google
                                </button>
                                <button
                                    disabled={isSubmitting}
                                    className="my-3 w-full text-white bg-gray-700 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-gray-700 dark:hover:bg-gray-900 flex items-center justify-center outline-none" onClick={githubSignIn}>
                                    <BiLogoGithub
                                        className="mx-1 text-2xl" />
                                    Create Account with Github
                                </button>
                                <p className="font-medium text-center my-2">Or</p>
                                <form className="space-y-4"
                                    onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Author Name
                                        </label>
                                        <input {...register("name", {
                                            required: "Enter Name",
                                        })}
                                            type="text"
                                            name="name"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="Enter Name" autoFocus />
                                        {errors.name &&
                                            (<p className="text-red-500 text-sm">{`${errors.name?.message}`}</p>)}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Your email
                                        </label>
                                        <input {...register("email", {
                                            required: "Email is required",
                                        })}
                                            type="email"
                                            name="email"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="Email" />
                                        {errors.email &&
                                            (<p className="text-red-500 text-sm">
                                                {`${errors.email?.message}`}
                                            </p>)}
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Your password
                                        </label>
                                        <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white flex items-center justify-between focus:outline-black outline-2">
                                            <input {...register("password", {
                                                required: "Password is requried",
                                                minLength: {
                                                    value: 8,
                                                    message: "Password must be at least 8 characters"
                                                },
                                            })}
                                                type={eye ? `text` : `password`}
                                                name="password"
                                                placeholder="••••••••"
                                                className="outline-none"
                                            />
                                            <button className="text-xl" onClick={() => setEye(!eye)}>
                                                {eye ? <FaRegEyeSlash /> : <FaRegEye />}
                                            </button>
                                        </div>
                                        {errors.password &&
                                            (<p className="text-red-500 text-sm">
                                                {`${errors.password?.message}`}
                                            </p>)}
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Confirm password
                                        </label>
                                        <input {...register("confirmPassword", {
                                            required: "Confirm password is required",
                                            validate: (value) =>
                                                value === getValues("password") || "Password Must Match"

                                        })}
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="••••••••"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                                        {errors.confirmPassword &&
                                            (<p className="text-red-500 text-sm">
                                                {`${errors.confirmPassword?.message}`}
                                            </p>)}
                                    </div>
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center outline-none bg-slate-500 text-white">
                                        Create Account
                                    </button>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                        Already have a Account? <button className="text-blue-700 hover:underline dark:text-blue-500"
                                            onClick={newUser}>
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {model && (
                <>
                    <div ref={modalRef} className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 shadow-sm mx-auto w-[23%] bg-[#E9EFEC]">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-2">
                            {/* <!-- Modal header --> */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Welcome Back <span className="text-gray-600">DevDiscuss</span>
                                </p>
                                <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white outline-none" data-modal-hide="authentication-modal"
                                    onClick={() => changeModel(!model)} >
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* <!-- Modal body --> */}
                            <div className="p-4 md:p-5">
                                <button
                                    disabled={isSubmitting}
                                    className="my-3 w-full border bg-white hover:bg-slate-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-gray-500 dark:hover:bg-gray-500 flex items-center justify-center outline-none" onClick={googleSighUp}>
                                    <BiLogoGoogle
                                        className="mx-1 text-2xl text-slate-500" />
                                    Login to your account
                                </button>
                                <button
                                    disabled={isSubmitting}
                                    className="my-3 w-full text-white bg-gray-700 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-gray-700 dark:hover:bg-gray-900 flex items-center justify-center outline-none" onClick={githubSignIn}>
                                    <BiLogoGithub
                                        className="mx-1 text-2xl" />
                                    Create Account with Github
                                </button>
                                <p className="font-medium text-center my-2">Or</p>
                                <form className="space-y-4"
                                    onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                        <input {...register("email", {
                                            required: "Email is required",
                                        })}
                                            type="email"
                                            name="email"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="Email" autoFocus />
                                        {errors.email &&
                                            (<p className="text-red-500 text-sm">{`${errors.email?.message}`}</p>)}
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                                        <input {...register("password", {
                                            required: "Password is requried",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters"
                                            },
                                        })}
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                                        {errors.password &&
                                            (<p className="text-red-500 text-sm">{`${errors.password?.message}`}</p>)}
                                    </div>
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center outline-gray-400 bg-green-500 text-white">
                                        Login to your account
                                    </button>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                        Not registered?
                                        <button className="text-blue-700 hover:underline dark:text-blue-500 mx-1"
                                            onClick={newUser}>
                                            Create account
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <nav ref={modalContainerRef} className={`flex items-center justify-between px-2 py-4 border-b-2 ${model || showNewUser ? 'blur ' : ''}`}>
                <div className="flex items-center justify-between">
                    <NavLink to={'/'} className="flex items-center mx-3 outline-none">
                        <img src="/blogicon.png"
                            className="w-10" />
                        <p className="mx-2 font-semibold text-2xl">
                            DevDiscuss
                        </p>
                    </NavLink>
                    <form
                        className="input-feild flex mx-1 items-center bg-slate-200  rounded-xl"
                        onSubmit={handleSearchSubmit}
                    >
                        <div className="mx-1" onSubmit={handleSearchSubmit}>
                            <BiSearch className="text-2xl mx-2" />
                        </div>
                        <input type="text"
                            className="bg-slate-200 p-2 rounded-xl outline-none"
                            placeholder="Search"
                            value={search}
                            onChange={e => handleSearch(e)}
                        />
                    </form>
                </div>
                {
                    Object.keys(user).length !== 0 ?
                        (<>
                            <div className="flex items-center justify-between">
                                <NavLink to={"/create"} className="flex items-center mx-1 hover:text-slate-500 cursor-pointer">
                                    <SlNote className="text-xl" />
                                    <p className="mx-1 font-normal">Write</p>
                                </NavLink>
                                <div className="mx-1">
                                    <img src={user?.user_metadata.avatar_url ? user?.user_metadata.avatar_url : "/blank-avatar.webp"}
                                        className="w-10 rounded-full" />
                                </div>
                            </div>
                        </>) : (
                            <>
                                <button className="bg-slate-300 px-4 p-2 rounded-md text-xl outline-none"
                                    onClick={() => changeModel(!model)}>
                                    SignIn
                                </button>
                            </>
                        )
                }
            </nav>
        </>
    )
};

export default Navbar;
