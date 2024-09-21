import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { MdOutlineMessage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from 'react-spinners';
import { supabase } from "../../supabaseClient";
import useTheme from "../context/theme";
import useUsers from "../context/User";


const Home = () => {
    const [blogPost, setBlogPost] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const { themeMode } = useTheme();

    const navigate = useNavigate();
    const {
        model,
        user,
        showNewUser,
        searchResult,
        getPosts
    } = useUsers();

    // Pending Logic
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

    useEffect(() => {
        searchResult.trim().length >= 2 ? searchPost(searchResult) : fetchBlogs();
    }, [searchResult])

    const searchPost = (searchResult) => {
        const results = blogPost?.filter((post) => post?.blog_title?.toLowerCase().includes(searchResult) && post);
        setBlogPost(results);
        getPosts(results);
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
            } catch (error) {
                console.log("Something Wrong happned While fetching Users\n", error);
            }
        })();

    }, []);

    const handlePost = (id) => {
        navigate(`/post/${id}`);
    };

    return (
        <>
            <main className={`md:p-8 ${model || showNewUser ? 'blur-[5px]' : ''}`}>
                <div className="container mx-auto w-3/4 flex flex-col items-center justify-center transition-all">
                    {
                        loading &&
                        <p className="flex justify-center">
                            <PuffLoader speedMultiplier={2} color="#B2B1B9" />
                        </p>
                    }
                    {
                        blogPost?.map((post, _) => {
                            const persons = users?.find((person) => person.id === post.user_id);

                            return (
                                <div key={_}
                                    className={`w-full custom-font my-5 flex justify-around ${themeMode && 'shadow-white'} shadow-md bg-white dark:bg-[#100f0fab] dark:text-white rounded-lg duration-300 transition hover:-translate-y-4 origin-center hover:scale-95 `}>
                                    <div className="w-[33%] p-1 my-auto cursor-pointer"
                                        onClick={() => handlePost(post?.id)}>
                                        <img src={post?.image_url}
                                            className="object-cover w-full rounded-xl h-[27vh]" />
                                    </div>
                                    <div className="w-[65%] p-2 flex flex-col justify-evenly">
                                        <p className="tracking-wider">
                                            ✨ {persons?.name} {user.id == post.user_id && "(You)"}
                                        </p>
                                        <p onClick={() => handlePost(post?.id)}
                                            className="text-3xl title hover:subpixel-antialiased cursor-pointer text-black dark:text-white text-pretty" dangerouslySetInnerHTML={{ __html: post?.preview._title }}>
                                        </p>
                                        <p className="text-xl description mb-3 text-slate-500 dark:text-slate-100 text-balance tracking-widest font-light"
                                            dangerouslySetInnerHTML={{ __html: post?.summary }}>
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <p className="font-normal text-black text-sm mt-2 dark:text-slate-50">
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
            </main>
        </>
    )
};

export default Home;

