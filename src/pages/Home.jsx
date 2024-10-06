/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa6";
import { IoBookmarksOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "../../supabaseClient";
import useUsers from "../context/User";
import useFetch from "../hooks/User";

const Home = () => {
    
    const [blogPost, setBlogPost] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const {
        user,
        searchResult,
        getPosts,
        changePublish
    } = useUsers();
    const [cur_user] = useFetch(user.id);


    // Fetching All Blogs
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
                        preview,
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
            setLoading(false);
        } catch (error) {
            console.log("Something Wrong happned while fetching Blog Data\n", error);
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
    }

    const searchPost = (searchResult) => {
        const results = blogPost?.filter((post) => post?.blog_title?.toLowerCase().includes(searchResult) && post);
        setBlogPost(results);
        getPosts(results);
    };

    const handlePost = (id) => {
        navigate(`/post/${id}`);
    };

    const handleSave = async (post) => {
        try {
            const { data } = await supabase
                .from('bookmarks')
                .select()
                .eq('post_id', post.id);
            if (data.length === 0) {
                await supabase.
                    from('bookmarks')
                    .insert([{
                        id: uuidv4(),
                        user_id: cur_user.id,
                        post_id: post.id,
                        username: cur_user.username,
                        blog_title: post.blog_title,
                        summary: post.summary,
                        cover_img: post.image_url
                    }]);
                toast('Bookmark Saved', {
                    duration: 1000,
                    position: 'top-right',

                    // Styling
                    style: { padding: '1rem 1.5rem' },
                    className: 'font-bold',

                    // Custom Icon
                    icon: '✅',

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
            } else {
                await supabase.
                    from('bookmarks')
                    .delete()
                    .eq('post_id', post.id);
                toast('Bookmark Removed', {
                    duration: 2000,
                    position: 'top-right',

                    // Styling
                    style: { padding: '1rem 1.5rem' },
                    className: 'font-bold',

                    // Custom Icon
                    icon: '⚠️',

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
            }
        } catch (error) {
            console.log(error);
        }
    }

    function calculateReadingTime(text) {
        const parser = new DOMParser();
        const desc = parser.parseFromString(text, "text/html");
        const plainText = desc.body.textContent;
        const wordsPerMinute = 200;
        const wordCount = plainText.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return readingTime;
    }

    useEffect(() => {
        searchResult.trim().length >= 2 ? searchPost(searchResult) : fetchBlogs();
    }, [searchResult])

    useEffect(() => {
        fetchBlogs();
        fetchUsers();
        changePublish(false);
    }, []);



    return (
        <main className="md:px-8 md:pb-4">
            <div className="container mx-auto md:w-3/4 p-3 flex flex-col items-center justify-center transition-all">
                {
                    loading ?
                        <p className="flex justify-center">
                            <PuffLoader speedMultiplier={1} color="#B2B1B9" />
                        </p>
                        : blogPost?.length === 0 && (<p className="text-3xl font-medium flex justify-center flex-col">
                            Can't find blog
                        </p>)
                }
                {
                    blogPost?.map((post, _) => {
                        const persons = users?.find((person) => person.id === post.user_id);
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
                                        className="md:text-2xl lg:text-[1.8em] text-[1.2em] title cursor-pointer mb-1 md:m-0 text-black dark:text-white text-pretty" dangerouslySetInnerHTML={{ __html: post?.preview._title }} style={{ lineHeight: "1.3em" }}>
                                    </p>

                                    <p className="text-xl description my-2 md:mb-3 text-slate-500 dark:text-slate-100 text-pretty tracking-widest font-light"
                                        dangerouslySetInnerHTML={{ __html: (post?.summary)?.substring(0, 222) + "..." }}>
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
                                                <div className="mx-2 dark:text-white flex items-center cursor-pointer">
                                                    <IoBookmarksOutline
                                                        className="md:text-2xl text-xl"
                                                        onClick={() => handleSave(post)} />
                                                </div>
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
                    })
                }
            </div>
        </main>
    )
};

export default Home;

