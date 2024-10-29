/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePost from "../hooks/Blogs";

const RecommendPosts = ({ post, id }) => {

    const [data] = usePost();
    const [commanPosts, setCommanPosts] = useState([]);
    const navigate = useNavigate(null);
    const recommendedPosts = useMemo(() => {
        return []
    }, []);

    useEffect(() => {
        data.map((blog) => {
            const PostTags = blog.tags.map(tag => tag.toLowerCase());
            const commantags = PostTags.filter((tags) => post?.tags?.includes(tags));
            if (commantags.length > 0) {
                recommendedPosts.push({
                    ...blog
                })
            }
        });
        setCommanPosts(recommendedPosts);
    }, [id, data, recommendedPosts, post?.tags]);

    return (
        commanPosts?.length > 1 &&
        <section className="md:p-2 p-3 border-t-2 border-gray-300 md:w-[80%] mx-auto" >
            <p className="md:text-2xl text-xl font-bold dark:text-white">
                Recommended Posts
            </p>
            <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 lg:w-[95%] mx-auto w-full">
                {
                    commanPosts?.map((posts) => (
                        posts.id !== post.id &&
                        <div className="p-2 bg-white mt-2 drop-shadow-lg rounded-lg cursor-auto" onClick={() => navigate(`/post/${posts.id}`)}
                            key={posts.id}>
                            <div className="overflow-hidden transition-shadow duration-300 ease-in-out">
                                <div className="cursor-pointer">
                                    <img src={posts?.image_url}
                                        className="object-cover w-full md:rounded-xl rounded-lg md:h-[25vh] h-[20vh]"
                                        alt={posts?.blog_title}
                                    />
                                </div>
                                <div className="p-2">
                                    <p className="text-pretty font-bold text-[0.8em] my-1 md:text-[1em] lg:text-[1.25em]"
                                        style={{ lineHeight: "1.25em" }}>
                                        {posts?.blog_title}
                                    </p>
                                    <p className="text-pretty mt-2 text-gray-900 text-[0.8em] md:text-[1em]"
                                        dangerouslySetInnerHTML={{ __html: (posts?.summary)?.substring(0, 120) + ". . ." }} />
                                </div>

                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    )
};

export default RecommendPosts;
