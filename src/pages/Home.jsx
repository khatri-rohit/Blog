/* eslint-disable no-unsafe-optional-chaining */
import {  useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaHeart } from "react-icons/fa6";
import { MdOutlineMessage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import useUsers from "../context/User";


const Home = () => {
    const [blogPost, setBlogPost] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { model, user, oAuthStateChange, showNewUser } = useUsers();

    // Pending Logic
    const fetchBlogs = async () => {
        try {
            const { data } = await supabase
                .from('blog_posts')
                .select(`
                        id,
                        user_id,
                        blog_title,
                        summary,
                        blog_content,
                        formated_time,
                        image_url,
                        comments (
                            id,
                            content
                        ),
                        likes(
                            id,
                            like
                        )
                    `)
                .order('created_at', { ascending: false });

            setBlogPost(data);
            console.log(data);
        } catch (error) {
            console.log("Something Wrong happned while fetching Blog Data\n", error);
        }
    };


    // Fetching All Blogs
    useEffect(() => {

        fetchBlogs();

        ; (async () => {
            try {
                const { data } = await supabase
                    .from('users')
                    .select(`
                        id,
                        name, 
                        email
                    `);

                setUsers(data);
                console.log(data);
            } catch (error) {
                console.log("Something Wrong happned While fetching Users\n", error);
            }
        })();

    }, [user]);

    const handlePost = (id) => {
        navigate(`/post/${id}`);
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut()
            oAuthStateChange({});
        } catch (error) {
            console.log("Error While Logout -> ", error);
        }
    };

    const handleTost = () => {
        toast(() => (
            <span>
                Login to Read
            </span>
        ));
    };

    // function Loading() {
    //     console.log("Loading");
    //     return (
    //         <p className="text-3xl text-black">Loading...</p>
    //     )
    // }

    return (
        <>
            <Toaster
                position="top-center"
            />
            <main className={`md:p-8 ${model || showNewUser ? 'blur-[5px]' : ''}`}>
                {Object.keys(user).length > 0 && <button className="px-2"
                    onClick={signOut}>Logout</button>}

                {/* <Suspense fallback={<Loading />}> */}
                <div className="container mx-auto w-3/4">
                    {
                        blogPost?.map((post, _) => {
                            const persons = users?.find((person) => person.id === post.user_id);
                            const summary = (post?.summary).substring(0, 230) + '...';
                            return (
                                <div key={_} className="my-5 flex shadow-md bg-white rounded-lg">
                                    <div className="w-1/3 mx-1 p-1 my-auto cursor-pointer"
                                        onClick={() => Object.keys(user).length > 0 ? handlePost(post?.id) : handleTost()}>
                                        <img src={post?.image_url}
                                            className="object-contain h-72 w-full" />
                                    </div>
                                    <div className="mx-2 w-3/4 p-2 flex flex-col justify-evenly">
                                        <p className="my-2 font-medium">
                                            ✨ {persons?.name}
                                        </p>
                                        <p onClick={() => Object.keys(user).length > 0 ? handlePost(post?.id) :
                                            handleTost()
                                        }
                                            className="text-3xl font-medium cursor-pointer">
                                            {post?.blog_title}
                                        </p>
                                        <p className="text-xl mt-2 mb-3 text-gray-500">
                                            {summary}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <p className="font-light text-black text-sm mt-2">
                                                {post?.formated_time}
                                            </p>
                                            <div className="flex items-center">
                                                <div className="mx-2 flex items-center">
                                                    <MdOutlineMessage className="text-2xl" />
                                                    <p className="mx-1 flex items-center font-medium text-lg mb-1">
                                                        {post?.comments?.map((comment) => (comment.content).length)}
                                                    </p>
                                                </div>
                                                <div className="mx-2 flex items-center">
                                                    <FaHeart className="text-2xl text-pink-500" />
                                                    <p className="mx-1 flex items-center font-medium text-lg mb-1">
                                                        {post?.likes?.map((like) => like.like)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {/* </Suspense> */}
            </main>
        </>
    )
};

export default Home;

