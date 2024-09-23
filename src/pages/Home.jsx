import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from 'react-spinners';
import { supabase } from "../../supabaseClient";
import useTheme from "../context/theme";
import useUsers from "../context/User";
import { IoBookmarksOutline } from "react-icons/io5";
import toast from "react-hot-toast";


const Home = () => {
    const [blogPost, setBlogPost] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const { themeMode } = useTheme();

    const navigate = useNavigate();
    const {
        // model,
        user,
        // showNewUser,
        searchResult,
        getPosts
    } = useUsers();

    // Pending Logic
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
            console.log(data);

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
                console.log(data);

            } catch (error) {
                console.log("Something Wrong happned While fetching Users\n", error);
            }
        })();

    }, []);

    const handlePost = (id) => {
        navigate(`/post/${id}`);
    };

    const handleSave = () => {
        toast('Bookmark Saved', {
            duration: 2000,
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

    return (
        <>
            <main className="md:p-8">
                <div className="container mx-auto w-3/4 flex flex-col items-center justify-center transition-all">
                    {
                        loading ?
                            <p className="flex justify-center">
                                <PuffLoader speedMultiplier={1} color="#B2B1B9" />
                            </p>
                            : blogPost?.length === 0 && (<p className="text-3xl font-medium flex justify-center flex-col">Empty Server Cant find Blogs <br /> <span className="text-center">Comeback later</span></p>)
                    }
                    {
                        blogPost?.map((post, _) => {
                            const persons = users?.find((person) => person.id === post.user_id);
                            const readingtime = calculateReadingTime(post.blog_content);

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
                                            <div className="flex items-center">
                                                <p className="mx-2 font-normal text-black text-[10px] dark:text-slate-50">
                                                    {post?.formated_time}
                                                </p>
                                                <p className="text-gray-500 text-xs">
                                                    {readingtime} min read
                                                </p>
                                            </div>

                                            <div className="flex items-center">
                                                {user.id && (<div className="mx-2 dark:text-white flex items-center cursor-pointer">
                                                    <IoBookmarksOutline
                                                        className="text-2xl"
                                                        onClick={handleSave} />
                                                </div>)}
                                                <div className="mx-2 flex items-center">
                                                    <FaHeart className="text-xl text-pink-500" />
                                                    <p className="mx-1 flex items-center font-medium">
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

