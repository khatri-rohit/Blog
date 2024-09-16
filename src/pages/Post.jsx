import { useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { MdOutlineMessage } from "react-icons/md";
import { useParams } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "../../supabaseClient";
import useUsers from "../context/User";



const Post = () => {

    const { id } = useParams();

    const [post, setPost] = useState([]);
    const [thatUser, setThatUser] = useState('');
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [like, setLikes] = useState();
    const [comments, setComments] = useState();
    const [likeCount, setLikeCount] = useState(0);
    const [registered, setRegister] = useState([]);
    const [alter, setAlter] = useState(false);
    const [slidebar, setSildebar] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [commentsCount, setCommentsCount] = useState([]);
    const [likeCommet, setLikeComment] = useState(false);

    const commentRef = useRef();
    const postRef = useRef();
    const { user } = useUsers();

    useEffect(() => {
        ; (async () => {
            try {
                setLoading(true);
                // Selected Blog
                const { data } = await supabase
                    .from('blog_posts')
                    .select(`
                        id,
                        user_id,
                        blog_title,
                        summary,
                        blog_content,
                        formated_time,
                        image_url
                    `)
                    .eq('id', id);

                if (data) {
                    setPost(data[0]);
                    setLoading(false);
                    setThatUser(data[0].user_id);

                    // Author Details
                    const response = await supabase.
                        from('users')
                        .select()
                        .eq('id', data[0].user_id);
                    setThatUser(response.data[0]);
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, [])

    const comment = async () => {
        try {
            const { data } = await supabase
                .from('comments')
                .select()
                .eq('post_id', id);
            console.log("Comment ", data[0]);
            if (data) {
                setComments(data[0]);
                setCommentsCount(data[0].content)
            }
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
                setLikes(data[0]);
                setLikeCount(data[0].like);
                const usersLike = data[0].liked_users.split('"');
                var users = usersLike.filter((user) => user.length > 2 && user);
                setRegister(users);
                users.find((use) => use === user.id ? setAlter(true) : setAlter(false));
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Like Article
    const updateLike = async () => {
        try {
            var updateLikes = (likeCount - 1 <= 0) ? 0 : likeCount - 1;
            var updateLikedUser = registered.filter((reg) => reg != user.id);
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

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        likes();
        comment();
    }, [commentText.length === 0]);

    const postComment = async (e) => {
        e.preventDefault();
        const updateComment = comments.content;
        const created_date = new Date().getTime();
        const newComment = [...updateComment, {
            key: uuidv4(),
            like: 0,
            content: commentText,
            name: user.user_metadata.full_name,
            img: user.user_metadata.avatar_url,
            created_date
        }];
        try {
            await supabase
                .from('comments')
                .update(
                    {
                        content: newComment
                    }
                ).eq('post_id', id);
            console.log("Comment Posted");
            setCommentText('');
            setCommentsCount(newComment);
        } catch (error) {
            console.error("Error -> " + error);
        }
    }

    const likeComment = async (e, changeID) => {
        e.preventDefault();
        const liked_user = comments.user;
        console.log(liked_user);
        liked_user.find((that) => that === user.id ? setLikeComment(true) : setLikeComment(false));
        console.log(likeCommet);

        const updateComment = comments.content;
        console.log(updateComment);

        const newComment = updateComment.map((changeComment) => (
            changeComment.key === changeID ?
                {
                    ...changeComment, like: likeCommet ? changeComment.like - 1
                        : changeComment.like + 1
                }
                : { ...changeComment }
        ))

        console.log(newComment);
        try {
            await supabase
                .from('comments')
                .update(
                    {
                        content: newComment,
                        user: likeCommet ? [...liked_user] : [...liked_user, user.id]
                    }
                ).eq('post_id', id);
            console.log("Comment Liked");
            console.log(likeCommet);

            setCommentsCount(newComment);
        } catch (error) {
            console.error("Error -> " + error);
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!commentRef.current.contains(event.target)) {
                if (slidebar) {
                    console.log("Open");
                    console.log(slidebar);
                }
                else if (!slidebar) {
                    console.log(slidebar);
                    setSildebar();
                    console.log("CLose");
                    return
                }
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [postRef])

    return (
        <div > {/* Sidebar */}
            <section className="p-5" ref={postRef}>
                <aside ref={commentRef}
                    className={`bg-gray-100 border-r-2 dark:bg-slate-700 fixed top-0 m-0 min-h-screen ${slidebar ? `left-0 transition-all duration-200 ${slidebar && 'w-[23%]'}` : '-left-full transition-all duration-500'}`}>
                    <div className="flex items-center justify-between p-4">
                        <p className="text-xl font-medium dark:text-white">
                            Comments
                        </p>
                        <ImCross className="mx-2 cursor-pointer  dark:text-white"
                            onClick={() => setSildebar(false)} />
                    </div>
                    <div className="border-t-2">
                        <div className="bg-white rounded-lg border-2 m-3 dark:border-none dark:py-1">
                            <div className="flex items-center justify-start my-3">
                                <img src={user?.user_metadata?.avatar_url}
                                    alt="profile_pic"
                                    className="mx-2 rounded-full w-12" />
                                <p className="text-xl font-normal">
                                    {user?.user_metadata?.full_name}
                                </p>
                            </div>
                            <form className="mx-3 my-2">
                                <textarea name="comment"
                                    className="w-full h-40 outline-none text-slate-800 text-lg font-medium resize-none bg-slate-100 p-2 rounded-md placeholder:dark:text-black text-pretty placeholder:opacity-85 border"
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    placeholder="Your Thoughts on This ..." autoFocus autoCorrect ></textarea>
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
                                        <>
                                            <div className="bg-white my-4 p-3 py-5 flex items-center justify-between rounded-lg"
                                                key={_}>
                                                <div className="mx-1 flex items-center">
                                                    <img src={response?.img ? response?.img : `"/blank-avatar.webp"`}
                                                        className="w-10 rounded-full" />
                                                    <div className="mx-3 leading-none">
                                                        <p className="font-medium">
                                                            {response?.name}
                                                        </p>
                                                        <p className="text-2xl text-balance font-light">
                                                            {response?.content}
                                                        </p>
                                                        <p className="text-xs font-sans">
                                                            {created_time === "this minute" ? "just now" : created_time}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="me-3 flex items-center">
                                                    <FaHeart className="text-pink-300 cursor-pointer active:text-pink-500"
                                                        onClick={() => likeComment(event, response?.key)} />
                                                    <span className="mx-1 font-semibold">
                                                        {response?.like <= 0 ? "" : response?.like}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>
                </aside>
                <div className="my-3 flex items-center justify-between container mx-auto p-4 border-b-2">
                    <div className="flex items-center">
                        <img src={thatUser?.avatar_url ? thatUser?.avatar_url : "/blank-avatar.webp"}
                            className="w-20 rounded-full" />
                        <div className="mx-4">
                            <p className="text-slate-500 dark:text-white text-2xl font-bold">
                                {thatUser?.name}
                            </p>
                            <p className="text-black text-lg font-medium dark:text-white">
                                {post?.formated_time}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="mx-2 dark:text-white flex items-center cursor-pointer">
                            <MdOutlineMessage className="text-3xl"
                                onClick={() => setSildebar(true)} />
                            <p className="mx-1 flex items-center font-medium text-lg mb-1">
                                {comments?.content.length}
                            </p>
                        </div>
                        <div className="dark:text-white mx-2 flex items-center cursor-pointer"
                            onClick={updateLike}>
                            <FaHeart className="text-3xl text-pink-500 cursor-pointer" />
                            <p className="mx-1 flex items-center font-medium text-lg mb-1">
                                {likeCount}
                            </p>
                        </div>
                    </div>

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
                            <div className="p-3 container mx-auto w-3/4">
                                <div className="mt-10">
                                    <div className="w-3/4 mx-auto">
                                        <p className="text-5xl text-center font-extrabold mb-7 dark:text-white text-balance">
                                            {post?.blog_title}
                                        </p>
                                        <p className="text-xl text-center text-gray-400 mt-3 mb-5 text-balance dark:text-stone-200">
                                            {post?.summary}
                                        </p>
                                    </div>
                                    <div className="w-full my-3">
                                        <img src={post?.image_url}
                                            className="h-[35em] mx-auto" />
                                    </div>
                                    <div className="w-[75%] mx-auto">
                                        <div className="text-2xl dark:text-white p-3 text-pretty"
                                            dangerouslySetInnerHTML={{ __html: post?.blog_content }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </section>
        </div >
    )
};

export default Post;
