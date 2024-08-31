import { useEffect, useRef } from "react";
import { useForm } from 'react-hook-form';
import { BiLogoGoogle, BiSearch } from "react-icons/bi";
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
        reset
    } = useForm();

    const { model, changeModel, user, oAuthStateChange } = useUsers();

    const modalContainerRef = useRef(null);
    const modalRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!modalContainerRef.current.contains(event.target)) {
                if (!modalRef.current.contains(event.target)) {
                    changeModel();
                }
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [modalContainerRef, modalRef]);

    const onSubmit = async (data) => {
        const { email, password } = data
        console.log(email, password);
        try {
            const { data } = await supabase.auth.signUp({
                email: email,
                password: password
            });
            console.log(data.user);
            if (data) {
                oAuthStateChange(data.user);
                authUser(data);
                navigate("/");
                changeModel();
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
            console.log(user);
            // if (user.identities[0].provider === 'email') {
            const { data } = await supabase
                .from('users')
                .insert({
                    id: user.id,
                    name: "Ritika Nimesh",
                    email: user.email,
                    created_at: user.created_at,
                    avatar_url: null
                });
            console.log(data);
            // } else {
            //     var name = response.user?.user_metadata.full_name;
            //     var avatarImg = response.user?.user_metadata.avatar_url;
            //     console.log(avatarImg);
            //     const { data } = await supabase
            //         .from('users')
            //         .insert({
            //             id: user.id,
            //             name,
            //             email: user.email,
            //             created_at: user.created_at,
            //             avatar_url: avatarImg
            //         });
            //     console.log(data);
            // }
        } catch (error) {
            console.log(error);
        }
    }

    const googleSighUp = async () => {
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                if (Object.keys(user).length === 0) {
                    const data = (await supabase.auth.getSession()).data
                    oAuthStateChange(data.session.user);
                    console.log(data.session.user);
                }
            } catch (err) {
                console.log(err);
            }
        })()
    }, [])

    // Remove Scroll while Login Model is Open
    useEffect(() => {
        document.body.style.overflow = model ? "hidden" : "unset";
    }, [model]);

    return (
        <>
            {model && (
                <>
                    <div ref={modalRef} className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 shadow-sm mx-auto w-[23%]">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-2">
                            {/* <!-- Modal header --> */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Sign in to  <span className="text-gray-600">DevDiscuss</span>
                                </h3>
                                <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white outline-none" data-modal-hide="authentication-modal"
                                    onClick={() => changeModel()} >
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
                                    type="submit"
                                    className="w-full text-white bg-slate-300 hover:bg-slate-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-gray-500 dark:hover:bg-gray-500 flex items-center justify-center outline-none" onClick={googleSighUp}>
                                    <BiLogoGoogle
                                        className="mx-1" />
                                    Login to your account
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
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="Email" autoFocus />
                                        {errors.email &&
                                            (<p className="text-red-500">{`${errors.email?.message}`}</p>)}
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
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                                        {errors.password &&
                                            (<p className="text-red-500">{`${errors.password?.message}`}</p>)}
                                    </div>
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 outline-none ">
                                        Login to your account
                                    </button>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                        Not registered? <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <nav ref={modalContainerRef} className={`flex items-center justify-between px-2 py-4 border-b-2 ${model ? 'blur' : ''}`}>
                <div className="flex items-center justify-between">
                    <NavLink to={'/'} className="flex items-center mx-3 outline-none">
                        <img src="/blogicon.png"
                            className="w-10" />
                        <p className="mx-2 font-semibold text-2xl">
                            DevDiscuss
                        </p>
                    </NavLink>
                    <div
                        className="input-feild flex mx-1 items-center bg-slate-200  rounded-xl">
                        <div className="mx-1">
                            <BiSearch className="text-2xl mx-2" />
                        </div>
                        <input type="text"
                            className="bg-slate-200 p-2 rounded-xl outline-none"
                            placeholder="Search" />
                    </div>
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
                                    onClick={() => changeModel()}>
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
