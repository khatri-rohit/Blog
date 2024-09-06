import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import useUsers from "../context/User";


const Post = () => {

    const { id } = useParams();
    const [post, setPost] = useState([]);
    const [thatUser, setThatUser] = useState('');

    const [like, setLikes] = useState();

    const [comments, setComments] = useState();

    const [likeCount, setLikeCount] = useState(0);

    const [registered, setRegistered] = useState([]);

    const { user } = useUsers();

    const [alter, setAlter] = useState(false);

    useEffect(() => {
        ; (async () => {
            try {
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
                    setThatUser(data[0].user_id);

                    // Author Details
                    const response = await supabase.
                        from('users')
                        .select()
                        .eq('id', data[0].user_id);
                    console.log(response.data[0]);
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
            console.log("Comment", data);
            if (data) {
                setComments(data[0]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        likes();
        comment();
    }, [likeCount]);


    const likes = async () => {
        try {
            const { data } = await supabase
                .from('likes')
                .select()
                .eq('post_id', id);
            console.log("Likes", data[0]);
            if (data) {
                setLikes(data[0]);
                setLikeCount(data[0].like);
                // const usersLike = data[0].liked_users.split('"');
                // console.log(usersLike.filter((user) => user.length > 2 && user));
                // setRegistered(usersLike.filter((user) => user.length > 2 && user));
                console.log(registered);
                console.log(user.id);
                registered.find((use) => use === user.id ? setAlter(true) : setAlter(false));
            }
        } catch (error) {
            console.log(error);
        }
    }


    // Like Article
    const updateLike = async () => {
        try {
            // const updateLike = like.like;
            // const usersLike = like.liked_users.split('"')
            // var users = usersLike.filter((user) => user.length > 2 && user)
            // console.log(users);
            // console.log(user.id);
            // if (!alter)
            //     users.find((use) => use === user.id ? setAlter(true) : setAlter(false));

            if (alter) {
                console.log("Registered --");
                var updateLikes = (likeCount - 1 <= 0) ? 0 : likeCount - 1;
                const { data } = await supabase
                    .from('likes')
                    .update({ like: updateLikes })
                    .eq('post_id', id);
                console.log(data);
                console.log("Like Decrement -> ", updateLikes);
                setLikeCount(updateLikes);
                setAlter(false);
            } else {
                setRegistered(prev => console.log([...prev, user.id]));
                console.log("Not Registered ++");
                await supabase
                    .from('likes')
                    .update({
                        like: likeCount + 1,
                        liked_users: registered
                    })
                    .eq('post_id', id);
                console.log("Like Increment -> ", likeCount + 1);
                console.log(registered);
                setLikeCount(likeCount + 1);
                setAlter(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section className="p-5 bg-slate-100">
            <div className="my-3 flex items-center justify-between container mx-auto p-4">
                <div className="flex items-center">
                    <img src={thatUser?.avatar_url ? thatUser?.avatar_url : "/blank-avatar.webp"}
                        className="w-20 rounded-full" />
                    <div className="mx-2">
                        <p className="text-slate-500 text-2xl font-semibold">
                            {thatUser?.name}
                        </p>
                        <p className="text-black text-lg font-medium">
                            {post?.formated_time}
                        </p>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="mx-2 flex items-center">
                        <MdOutlineMessage className="text-3xl" />
                        <p className="mx-1 flex items-center font-medium text-lg mb-1">
                            {comments?.content.length}
                        </p>
                    </div>
                    <div className="mx-2 flex items-center cursor-pointer"
                        onClick={updateLike}>
                        <FaHeart className="text-3xl text-pink-500" />
                        <p className="mx-1 flex items-center font-medium text-lg mb-1">
                            {likeCount}
                        </p>
                    </div>
                </div>

            </div>
            {post &&
                (
                    <>
                        <div className="p-3 container mx-auto w-3/4">
                            <div className="mt-10">
                                <div className="w-3/4 mx-auto">
                                    <p className="text-5xl text-center font-extrabold mb-7">
                                        {post?.blog_title}
                                    </p>
                                    <p className="text-xl text-center text-gray-400 mt-3 mb-5">
                                        {post?.summary}
                                    </p>
                                </div>
                                <div className="w-full my-3">
                                    <img src={post?.image_url}
                                        className="h-[35em] mx-auto border" />
                                </div>
                                <div className="w-3/4 mx-auto">
                                    <div className="text-2xl p-3"
                                        dangerouslySetInnerHTML={{ __html: post?.blog_content }}
                                    />
                                </div>
                            </div>
                        </div>

                    </>
                )
            }
        </section>
    )
};

export default Post;
