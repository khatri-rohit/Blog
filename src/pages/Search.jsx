/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaHeart } from "react-icons/fa6";
import { MdOutlineMessage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { supabase } from "../../supabaseClient";
import useUsers from "../context/User";


const Search = () => {

    const queryParams = new URLSearchParams(location.search);
    const q = queryParams.get('q');

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const { getPost, user, getPosts, searchResult } = useUsers();

    const handleTost = () => {
        toast(() => (
            <span className="text-xl">
                Enter Something
            </span>
        ));
    };

    const fetchBlogs = async () => {
        try {
            setLoading(true);
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
                    `).or(`blog_title.ilike.%${searchResult.trim().length >= 2 ? searchResult : q}%`)
                .order('created_at', { ascending: false });

            setLoading(false);
            getPosts(data);
            console.log(data);
        } catch (error) {
            console.log("Something Wrong happned while fetching Searched Blog\n", error);
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await supabase
                .from('users')
                .select(`
                        id,
                        name, 
                        email
                    `);

            setUsers(data);
        } catch (error) {
            console.log("Something Wrong happned While fetching Users\n", error);
        }
    };

    useEffect(() => {
        if (searchResult.trim().length !== 0) {
            fetchBlogs();
            fetchUsers();
        }
    }, [searchResult.trim().length >= 2, q]);

    const handlePost = (id) => {
        navigate(`/post/${id}`);
    };

    return (
        <>
            <Toaster
                position="top-center"
            />

            {

            }

            <div className="container mx-auto w-3/4">
                {getPost.length > 0 ?
                    getPost?.map((post, _) => {
                        const persons = users?.find((person) => person.id === post.user_id);
                        const summary = post?.summary.substring(0, 230) + '...';
                        return (
                            <div key={_} className="my-5 flex bg-white rounded-lg shadow-white shadow-md dark:bg-[#100f0fab] dark:text-white">
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
                                        className="text-3xl font-medium cursor-pointer text-pretty">
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
                    }) :
                    loading ? <p className="text-center my-9">
                        <BeatLoader color="#16325B" />
                    </p> :
                        <p className="text-3xl text-center font-medium my-6">
                            Didn't find the result {searchResult.trim().length <= 0 ? "from 'blank space'" : `'${searchResult}'`}
                        </p>
                }
            </div>
        </>
    )
};

export default Search;
