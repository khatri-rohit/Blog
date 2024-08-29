/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import { BiSearch } from "react-icons/bi";
import { SlNote } from "react-icons/sl";
import { NavLink } from "react-router-dom";
import useUsers from "../context/User";

const Navbar = () => {
    // const [user, setUser] = useState(false);
    const { model, changeModel, user } = useUsers()
    const modalContainerRef = useRef(null);


    useEffect(() => {
        if (model) {

            const handleClickOutside = (event) => {
                if (!modalContainerRef.current.contains(event.target)) {
                    changeModel();
                }
            };
            document.addEventListener('click', handleClickOutside);
            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }
    }, [model, modalContainerRef]);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset,
        getValues
    } = useForm();

    const onSubmit = async (data) => {
        console.log(data);
        await new Promise((reslove) => setTimeout(reslove, 100));
        reset();
    }

    return (
        <>
            {model && (
                <>
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 shadow-sm mx-auto bg-gray-100">
                        <form onSubmit={handleSubmit(onSubmit)}
                            className='flex flex-col gap-y-2 p-2 '>
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                })}
                                type="email"
                                placeholder='Email'
                                className='p-2 w-full' />
                            {errors.email &&
                                (<p className="text-red-500">{`${errors.email?.message}`}</p>)}
                            <input
                                {...register("password", {
                                    required: "Password is requried",
                                    minLength: {
                                        value: 10,
                                        message: "Password must be at least 10 characters"
                                    },
                                })}
                                type="password"
                                placeholder='password'
                                className='p-2 w-full' />
                            {errors.password &&
                                (<p className="text-red-500">{`${errors.password?.message}`}</p>)}
                            <input
                                {...register("consfirmPassword", {
                                    required: "Confirm password is required",
                                    validate: (value) =>
                                        value === getValues("password") || "Password Must Match"

                                })}
                                type="password"
                                placeholder='confirm password'
                                className='p-2 w-full' />
                            {errors.consfirmPassword &&
                                (<p className="text-red-500">{`${errors.consfirmPassword?.message}`}</p>)}
                            <button
                                disabled={isSubmitting}
                                className='p-2 w-full bg-blue-500 disabled:bg-slate-500'>
                                Submit
                            </button>
                        </form>
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
                                    SignUp
                                </button>
                            </>
                        )
                }
            </nav>
        </>
    )
};

export default Navbar;
