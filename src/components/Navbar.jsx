/* eslint-disable no-unused-vars */
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
                if (!modalRef.current.contains(event.target))
                    changeModel();
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
        await supabase.auth.signUp({
            email: email,
            password: password
        }).then(res => {
            oAuthStateChange(res);
            authUser(res);
            navigate("/")
            changeModel();
        })
        await new Promise((reslove) => setTimeout(reslove, 100));
        reset();
    }

    // http://localhost:3000/#access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6Ik1EWHhhU0FXZjRGQnl3RFciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2t2Z3VlbGp2dm5ucmJmanNvaG5mLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJhMzE1MzBlMC1jYzgyLTQ4ZDMtYmU5OC00ZjRhZDJmYThmOTgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzI1MDEzNDgzLCJpYXQiOjE3MjUwMDk4ODMsImVtYWlsIjoicm9oaXRraGF0cmkxMTExMTJAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJnb29nbGUiLCJwcm92aWRlcnMiOlsiZ29vZ2xlIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJeE9qeWZnc083WTZMS2xaTUd1Y1pCMEJlQ3doM2VDWVppenpvM3QxVjYySWRKRVREejZBPXM5Ni1jIiwiZW1haWwiOiJyb2hpdGtoYXRyaTExMTExMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiUm9oaXQgS2hhdHJpIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tIiwibmFtZSI6IlJvaGl0IEtoYXRyaSIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0l4T2p5ZmdzTzdZNkxLbFpNR3VjWkIwQmVDd2gzZUNZWml6em8zdDFWNjJJZEpFVER6NkE9czk2LWMiLCJwcm92aWRlcl9pZCI6IjEwNjU5NjkxMzU2Nzc0MDE2NDA2NCIsInN1YiI6IjEwNjU5NjkxMzU2Nzc0MDE2NDA2NCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im9hdXRoIiwidGltZXN0YW1wIjoxNzI1MDA5ODgzfV0sInNlc3Npb25faWQiOiJmYTFmZTUzZi0wZDk1LTQxZjgtYjcwMi0yNzVhMmRiYjBmNDUiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ._7oJxyK5TKo_BGwS93AN4qaRIokCNnURELILn4tAuSQ&expires_at=1725013483&expires_in=3600&provider_token=ya29.a0AcM612wDoWuS9Nr7iC0yBa-uXahgxrle_bglPRNZukZFEMFxrRPiVcJSJS3RRzGeNnNWVqezCbyOdTvPfNZoZUtDT4LxUmu1LwANz2IkBxUiR5rsmLeqwFcnQqgp-xIfEE-qQni914qcMcusObQ7UzLPfkckOiKiv4kaCgYKAfESARISFQHGX2MitvJOaazCPwuxcVs4ZU296g0170&refresh_token=TqkTogKGkdLoq-Ke8oUBwQ&token_type=bearer
    
    const authUser = async (response) => {
        try {
            var name = "Rohit Khatri";
            const { data: { user } } = response;
            const { data, error } = await supabase
                .from('users')
                .insert({
                    id: user.id,
                    name,
                    email: user.email,
                    created_at: user.created_at
                });
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    const googleSighUp = async () => {
        try {
            const { data } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options:{
                    redirectTo:"http://localhost:5173/"
                }
            })
            oAuthStateChange(data);
            authUser(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

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
                                <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal"
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
                                    className="w-full text-white bg-slate-300 hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-slate-200 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-gray-500 dark:hover:bg-gray-500 dark:focus:ring-gray-300 flex items-center justify-center" onClick={googleSighUp}>
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
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="Email" />
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
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                                        {errors.password &&
                                            (<p className="text-red-500">{`${errors.password?.message}`}</p>)}
                                    </div>
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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
                    <NavLink to={'/'} className="flex items-center mx-3">
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
                                    <img src="/blank-avatar.webp"
                                        className="w-10 rounded-full" />
                                </div>
                            </div>
                        </>) : (
                            <>
                                <button className="bg-slate-300 px-4 p-2 rounded-md text-xl"
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
