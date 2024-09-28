/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Model from "../utils/Model";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "../../supabaseClient";
import { useParams } from "react-router-dom";
import useUsers from "../context/User";
import { ImCross } from "react-icons/im";
import { FaHeart } from "react-icons/fa";

const Comment = ({ setModel, model }) => {

    const { id } = useParams();
    const { user } = useUsers();
    const [commentText, setCommentText] = useState('');
    const [commentsCount, setCommentsCount] = useState([]);
    const [comments, setComments] = useState();
    const [likeCommet, setLikeComment] = useState(false);
    const [cur_user, setCur_user] = useState([]);

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
        comment();
        ; (async () => {
            try {
                const { data } = await supabase
                    .from('users')
                    .select()
                    .eq('id', user.id);
                setCur_user(data[0]);
            } catch (error) {
                console.log("Error", error);
            }
        })()
    }, []);

    return (
        <Model setModel={setModel} model={model}>
            <aside className={`bg-gray-100 border-r-2 z-50 dark:bg-slate-700 fixed top-0 m-0 min-h-screen ${model ? `left-0 transition-all duration-200 ${model && 'w-[23%]'}` : '-left-full transition-all duration-500'}`}>
                <div className="flex items-center justify-between p-4">
                    <p className="text-xl font-medium dark:text-white">
                        Comments
                    </p>
                    <ImCross className="mx-2 cursor-pointer  dark:text-white"
                        onClick={() => setModel(prev => !prev)} />
                </div>
                <div className="border-t-2">
                    <div className="bg-white rounded-lg border-2 m-3 dark:border-none dark:py-1">
                        <div className="flex items-center justify-start my-3">
                            <img src={cur_user?.avatar_url}
                                alt="profile_pic"
                                className="mx-2 rounded-full w-12" />
                            <p className="text-lg font-normal">
                                {cur_user?.name}
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
                                                <img src={cur_user?.avatar_url}
                                                    alt="profile_pic"
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
        </Model>
    )
};

export default Comment;
