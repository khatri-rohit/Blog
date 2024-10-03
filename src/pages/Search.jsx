/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa6";
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

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const { data } = await supabase
                .from('posts')
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

            getPosts(data);
            setLoading(false);
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
    }, []);

    const handlePost = (id) => {
        navigate(`/post/${id}`);
    };

    function calculateReadingTime(text) {
        const parser = new DOMParser();
        const desc = parser.parseFromString(text, "text/html");
        const plainText = desc.body.textContent;
        const wordsPerMinute = 200;
        const wordCount = plainText.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return readingTime;
    }
    return (
        <>
            <div className="container mx-auto md:w-3/4 p-2">
                {getPost.length > 0 ?
                    getPost?.map((post, _) => {
                        const persons = users?.find((person) => person.id === post.user_id);
                        const summary = post?.summary.substring(0, 230) + '...';
                        const readingtime = calculateReadingTime(post.blog_content);
                        return (
                            <div key={_}
                                className="w-full custom-font my-5 md:flex justify-around dark:shadow-slate-300 shadow-sm  bg-white dark:bg-gray-800 dark:text-white rounded-lg duration-300 transition hover:-translate-y-4 origin-center 
                                    hover:scale-95">

                                <div className="md:w-[45%] lg:w-[38%] p-1 my-auto cursor-pointer"
                                    onClick={() => handlePost(post?.id)}>
                                    <img src={post?.image_url}
                                        className="object-cover w-full rounded-xl h-[27vh]" />
                                </div>

                                <div className="md:w-[52%] lg:w-[62%] p-2 flex flex-col justify-evenly">
                                    <p className="tracking-wider my-2 md:m-0">
                                        ✨ {persons?.name} {user.id == post.user_id && "(You)"}
                                    </p>

                                    <p onClick={() => handlePost(post?.id)}
                                        className="md:text-2xl lg:text-3xl text-[1.2em] title cursor-pointer mb-1 md:m-0 text-black dark:text-white text-pretty">
                                        {post?.blog_title}
                                    </p>

                                    <p className="text-xl description mb-2 md:mb-3 text-slate-500 dark:text-slate-100 text-balance tracking-widest font-light"
                                        dangerouslySetInnerHTML={{ __html: summary }}>
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <p className="mr-2 font-normal text-black text-[0.8em] dark:text-slate-50">
                                                {post?.formated_time}
                                            </p>
                                            <p className="text-[0.7em] text-gray-400 md:text-[.71em]">
                                                {readingtime} min read
                                            </p>
                                        </div>
                                        {user.id &&
                                            <div className="flex items-center">
                                                <div className="mx-2 flex items-center">
                                                    <FaHeart className="md:text-2xl text-xl text-pink-500" />
                                                    <p className="mx-1 flex items-center font-medium">
                                                        {post?.likes?.map((like) => like.like)}
                                                    </p>
                                                </div>
                                            </div>}
                                    </div>
                                </div>
                            </div>
                        )
                    }) :
                    loading ? <p className="text-center my-9">
                        <BeatLoader color="#16325B" />
                    </p> :
                        <p className="text-3xl dark:text-white text-center font-medium my-6">
                            Didn't find the results {searchResult.trim().length <= 0 ? "" : `'${searchResult}'`}
                        </p>
                }
            </div>
        </>
    )
};

export default Search;
