import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiDotsHorizontalRounded, BiMessageSquareEdit } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { IoBookmarksOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "../../supabaseClient";
import useUsers from "../context/User";
import Model from "../utils/Model";
import useFetch from "../hooks/User";
import DropDown from "../utils/DropDown";
import SharePost from "../components/SharePost";
import PostDropDown from "../utils/PostDropDown";
import RecommendPosts from "../components/RecommendPosts";


const Post = () => {

    const { id } = useParams();

    const [post, setPost] = useState([]);
    const [thatUser, setThatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [like, setLikes] = useState();
    const [comments, setComments] = useState();
    const [likeCount, setLikeCount] = useState(0);
    const [likedUsers, setLikedUsers] = useState([])
    const [registered, setRegister] = useState([]);
    const [alter, setAlter] = useState(false);
    const [slidebar, setSildebar] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [commentsCount, setCommentsCount] = useState([]);
    const [drop, setDrop] = useState(false);
    const [editComment, setEditComment] = useState('');
    const [changeComment, setChangeComment] = useState(false);
    const [curDrop, setCurDrop] = useState('');

    const { user } = useUsers();
    const [cur_user] = useFetch(user.id);
    const navigate = useNavigate();

    useEffect(() => {
        ; (async () => {
            try {
                setLoading(true);

                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

                // Selected Blog
                const { data } = await supabase
                    .from('posts')
                    .select()
                    .eq("id", id);

                if (data) {
                    setPost(data[0]);
                    setLoading(false);
                    console.log(data[0].tags);

                }

                // Author Details
                await supabase.
                    from('users').select().eq("id", data[0].user_id)
                    .then((res) => {
                        setThatUser(res.data[0]);
                    });

            } catch (error) {
                console.log(error);
            }
        })();
    }, [id])

    const comment = async () => {
        try {
            const { data } = await supabase
                .from('comments')
                .select()
                .eq('post_id', id);
            if (data) {
                setComments(data[0]);
                setCommentsCount(data[0].content)
            }
            likes();
        } catch (error) {
            console.log(error);
        }
    }

    const likes = async () => {
        try {
            const { data } = await supabase
                .from('likes')
                .select()
                .eq('post_id', id);
            if (data) {
                setLikeCount(data[0].like);
                setLikedUsers(data[0]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Like Article
    const updateLike = async () => {
        try {
            if (likedUsers.liked_users.length > 0) {

                const usersLike = likedUsers.liked_users.split('"');
                var users = usersLike.filter((user) => user.length > 2 && user);

                setRegister(users);
                users.find((use) => {
                    use === user.id ? setAlter(true) : setAlter(false)
                });

                var updateLikes = (likeCount - 1 <= 0) ? 0 : likeCount - 1;
                var updateLikedUser = registered.filter((reg) => reg !== user.id);
                setRegister(alter ? updateLikedUser : [...registered, user.id]);
                await supabase
                    .from('likes')
                    .update({
                        like: alter ? updateLikes : likeCount + 1,
                        liked_users: alter ? updateLikedUser : [...registered, user.id]
                    })
                    .eq('post_id', id);
                setLikeCount(alter ? updateLikes : likeCount + 1);
                setAlter(prev => !prev);
            } else {
                // 
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        comment();
    }, [commentText.length === 0]);

    const postComment = async (e) => {
        e.preventDefault();
        const updateComment = comments.content;
        const created_date = new Date().getTime();
        const newComment = [...updateComment, {
            key: cur_user.id,
            content: commentText,
            name: cur_user.name,
            img: cur_user.avatar_url,
            created_date
        }];
        var count = 0;
        updateComment.map((comm) => comm.key === cur_user.id && count++)

        try {
            if (count < 2) {
                await supabase
                    .from('comments')
                    .update(
                        {
                            content: newComment
                        }
                    ).eq('post_id', id);
                setCommentText('');
                setCommentsCount(newComment);
                toast('Response Posted', {
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
                toast("You Can't Spam Multiple Comments", {
                    duration: 1200,
                    position: 'top-right',

                    // Styling
                    style: { padding: '1rem 1.5rem' },
                    className: 'font-bold',

                    // Custom Icon
                    icon: '❌',

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
            console.error("Error -> " + error);
        }
    }

    const handleSave = async () => {
        try {
            const { data } = await supabase
                .from('bookmarks')
                .select()
                .eq('post_id', id);
            if (data.length === 0) {
                await supabase.
                    from('bookmarks')
                    .insert([{
                        id: uuidv4(),
                        user_id: cur_user.id,
                        post_id: id,
                        username: cur_user.username,
                        blog_title: post.blog_title,
                        summary: post.summary,
                        cover_img: post.image_url
                    }]);
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

    function convertMinutes(minutes) {
        if (minutes < 60) {
            return [minutes, "minutes"];
        } else if (minutes < 1440) {
            const hours = Math.floor(minutes / 60);
            return [hours, "hours"];
        } else {
            const days = Math.floor(minutes / 1440);
            return [days, "days"];
        }
    }

    const deleteComment = async (key) => {
        const updateComment = commentsCount.filter((comment) => comment.key !== key);
        try {
            await supabase
                .from('comments')
                .update({
                    content: updateComment
                })
                .eq('post_id', id);

            toast('Comment Deleted', {
                duration: 100,
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
            comment();
        } catch (error) {
            console.log(error);
        }
    }

    const deletePost = async (postId) => {
        try {
            await supabase
                .from('posts')
                .delete()
                .eq('id', postId);

            toast('Post Deleted', {
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
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeComment = (e, text) => {
        if (editComment.length === 0) {
            setEditComment(text);
        } else {
            setEditComment(e.target.value);
        }
    }

    const handleEditComment = async (key) => {
        var getComment = commentsCount.filter((comment) => comment.key === key);
        getComment[0].content = editComment;
        var updateComment = commentsCount.filter((comment) => comment.key !== key ? comment : comment.content = editComment)

        await supabase.from('comments').update({
            content: updateComment
        }).eq('post_id', id);
        toast('Response Changed', {
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
        setChangeComment(false);
        comment();
    }

    return (
        <div className="relative">
            {/* Comment Sidebar */}

            {slidebar &&
                <Model model={slidebar} setModel={setSildebar}>
                    <div
                        className={`bg-gray-100 border-r-2 dark:bg-slate-700 fixed top-0 h-full z-30 ${slidebar ? `left-0 transition-colors duration-500 ${slidebar && 'w-[23%]'}` : '-left-full transition-colors duration-500'}`}>
                        <div className="flex items-center justify-between p-4">
                            <p className="text-xl font-medium dark:text-white">
                                Comments
                            </p>
                            <ImCross className="mx-2 cursor-pointer  dark:text-white"
                                onClick={() => setSildebar(prev => !prev)} />
                        </div>
                        <div className="border-t-2">
                            <div className="bg-white rounded-lg border-2 m-3 dark:border-none dark:py-1">
                                <div className="flex items-center justify-start my-3">
                                    <img src={cur_user?.avatar_url || 'blank-avatar.webp'}
                                        alt="profile_pic"
                                        className="mx-2 rounded-full w-12 h-12 object-cover" />
                                    <p className="text-xl font-normal">
                                        {cur_user?.name}
                                    </p>
                                </div>
                                <form className="mx-3 my-2">
                                    <textarea name="comment"
                                        className="w-full h-40 outline-none text-slate-800 text-lg font-medium resize-none bg-slate-100 p-2 rounded-md placeholder:dark:text-gray-500 text-pretty placeholder:opacity-85 border"
                                        value={commentText}
                                        onChange={e => setCommentText(e.target.value)}
                                        placeholder="Your Thoughts on This ..."
                                        autoFocus ></textarea>
                                    <button className="bg-slate-600 my-2 px-4 py-1 rounded-xl text-white"
                                        onClick={postComment}>
                                        Post
                                    </button>
                                </form>
                            </div>
                            <p className="font-medium text-xl mx-3 dark:text-white">
                                {comments?.content?.length <= 0 ? "No Comments Wet" : `Responses (${comments?.content?.length})`}
                            </p>

                            <div className="m-3">
                                {
                                    commentsCount?.map((response, _) => {
                                        const date = new Date().getTime();
                                        var timeSpended = Math.floor((((date - response?.created_date) / 1000) / 60));
                                        const rlt = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
                                        const created_time = rlt.format(-Math.abs(convertMinutes(timeSpended)[0]), `${convertMinutes(timeSpended)[1]}`);

                                        return (
                                            <div className="bg-white my-3 p-3 py-5 flex items-start justify-between rounded-lg"
                                                key={_}>
                                                <div className="mx-1 flex items-start">
                                                    <img src={response?.img || "https://kvgueljvvnnrbfjsohnf.supabase.co/storage/v1/object/public/img_posts/blank-avatar.webp"}
                                                        alt="profile_pic"
                                                        className="w-10 rounded-full" />
                                                    <div className="mx-3 leading-none">
                                                        <div className="mb-1.5">
                                                            <p className="font-medium text-[0.8rem] m-0">
                                                                {response?.name} {cur_user.id === response.key && "(You)"}
                                                            </p>
                                                            <p className="text-[10px] mt-.5 font-sans m-0">
                                                                {created_time === "this minute" ? "just now" : created_time}
                                                            </p>
                                                        </div>
                                                        {/* You Can't Multiple Comments */}
                                                        {
                                                            changeComment && cur_user.id === response.key ?
                                                                (
                                                                    <div className="flex flex-col items-start">
                                                                        <textarea rows="4"
                                                                            className="my-1 text-slate-800 font-medium resize-none bg-slate-100 placeholder:dark:text-gray-500  placeholder:opacity-85 border"
                                                                            value={editComment}
                                                                            onChange={(e) => handleChangeComment(e, response.content)}
                                                                        >
                                                                        </textarea>
                                                                        <button className="text-xs"
                                                                            onClick={() => handleEditComment(response.key)}>
                                                                            Save
                                                                        </button>
                                                                    </div>
                                                                ) :
                                                                <p className="text-[1rem] font-light leading-none">
                                                                    {response?.content}
                                                                </p>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    {
                                                        (cur_user.id === response.key && !changeComment) &&
                                                        <button
                                                            className="absolute right-0"
                                                            onClick={() => setCurDrop((response.key))}>
                                                            <BiDotsHorizontalRounded className="text-3xl" />
                                                            {
                                                                curDrop === response.key && <PostDropDown curPost={curDrop}
                                                                    postid={response.key} setCurPost={setCurDrop} size={"w-[8rem]"}>
                                                                    <button className="border-b" onClick={() => {
                                                                        setChangeComment(true);
                                                                        setEditComment(response.content);
                                                                        setCurDrop('');
                                                                    }}>
                                                                        Edit Response
                                                                    </button>
                                                                    <button onClick={() => {
                                                                        deleteComment(response.key);
                                                                        setCurDrop('');
                                                                    }
                                                                    }>
                                                                        Delete
                                                                    </button>
                                                                </PostDropDown>
                                                            }
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </Model>
            }

            <section className="md:p-2 lg:p-5">
                <div className="my-3 flex items-center justify-between w-[80%] mx-auto p-4 border-b-2">
                    <div className="flex items-center">
                        <img src={thatUser ? thatUser?.avatar_url : '/blank-avatar.webp'}
                            alt="profile-pic"
                            className="md:w-20 w-12 rounded-full" />
                        <div className="mx-4">
                            <p className="text-slate-500 dark:text-white md:text-2xl font-bold text-[0.6em]">
                                {thatUser?.name} {cur_user.id === post.user_id && (<p className="md:text-lg text-[0.6em] m-0 inline-flex">(You)</p>)}
                            </p>
                            <p className="text-black md:text-[0.9rem] text-[0.6em] font-medium dark:text-white">
                                {post?.formated_time}
                            </p>
                        </div>
                    </div>
                    {
                        user.id &&
                        <div className="flex items-start">

                            <div className="flex items-start">

                                <div className="mx-2 cursor-pointer">
                                    <SharePost />
                                </div>
                                <div className="mx-2 dark:text-white flex items-center cursor-pointer">
                                    <IoBookmarksOutline
                                        className="md:text-2xl text-[1.2em]"
                                        onClick={handleSave} />
                                </div>
                                <div className="md:mx-2 dark:text-white flex items-start cursor-pointer">
                                    <BiMessageSquareEdit className="md:text-2xl text-[1.2em]"
                                        onClick={() => setSildebar(true)} />
                                    <p className="mx-1 font-medium md:text-xl text-[1.2em]">
                                        {comments?.content.length}
                                    </p>
                                </div>
                                <div className="dark:text-white flex items-start cursor-pointer"
                                    onClick={updateLike}>
                                    <FaHeart className="md:text-2xl text-[1.2em] text-pink-500 cursor-pointer" />
                                    <p className="mx-1 font-medium md:text-xl md:mb-1 text-[1em]">
                                        {likeCount}
                                    </p>
                                </div>
                            </div>

                            <div className="relative mb-7 mx-3">
                                {
                                    cur_user.id === post.user_id &&
                                    <button
                                        className="absolute right-0"
                                        onClick={() => setDrop(true)}>
                                        <BiDotsHorizontalRounded className="text-3xl dark:text-white" />
                                        {
                                            drop && <DropDown setShowDrop={setDrop} showDrop={drop} size={"w-[8rem]"}>
                                                <button className=""
                                                    onClick={() => {
                                                        deletePost(id);
                                                        setDrop(false);
                                                    }}>
                                                    Delete
                                                </button>
                                            </DropDown>
                                        }
                                    </button>
                                }
                            </div>
                        </div>
                    }

                </div>
                {
                    loading &&
                    <p className="text-center">
                        <BeatLoader color="#73777B" />
                    </p>
                }
                {
                    post &&
                    (
                        <>
                            <div className="md:p-3 p-1">
                                <div className="md:mt-10">
                                    <div className="md:w-10/12 mx-auto">
                                        <p className="md:text-3xl lg:text-5xl text-[1.5em] text-center font-extrabold md:mb-7 dark:text-white md:text-pretty">
                                            {post?.blog_title}
                                        </p>
                                        <p className="md:text-xl text-[1.2em] text-center text-gray-400 md:mt-3 md:mb-5 my-3 text-pretty dark:text-stone-200"
                                            dangerouslySetInnerHTML={{ __html: post?.summary }}>
                                        </p>
                                    </div>
                                    <div className="w-full my-3">
                                        <img src={post?.image_url}
                                            alt={post?.blog_title}
                                            className="md:h-[35em] mx-auto pb-2 border-gray-400 border-b-2" />
                                    </div>
                                    <div className="md:w-[85%] lg:w-[75%] mx-auto">
                                        <div className="dark:text-white p-3 text-xl w-full"
                                            dangerouslySetInnerHTML={{ __html: post?.blog_content }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </section>
            {post && <RecommendPosts post={post} />}
        </div>
    )
};

export default Post;
