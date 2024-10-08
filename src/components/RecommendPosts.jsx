/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePost from "../hooks/Blogs";

const RecommendPosts = ({ post, id }) => {

    const [data] = usePost();
    const [commanPosts, setCommanPosts] = useState([]);
    const navigate = useNavigate(null);
    const recommendedPosts = [];

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
    }, [id, data]);

    return (
        commanPosts?.length > 1 &&
        <section className="p-2 border-t-2 border-gray-300 w-[80%] mx-auto" >
            <p className="text-2xl font-bold dark:text-white">
                Recommended Posts
            </p>
            <div className="p-3 md:grid lg:grid-cols-3 md:grid-cols-2 gap-4 lg:w-[95%] mx-auto md:w-full">
                {
                    commanPosts?.map((posts, _) => (
                        posts.id !== post.id &&
                        <div className="border-r p-2 bg-white mr-1  my-2 drop-shadow-lg rounded-lg cursor-auto" onClick={() => navigate(`/post/${posts.id}`)}
                            key={_}>
                            <div className="overflow-hidden transition-shadow duration-300 ease-in-out">
                                <div className="cursor-pointer">
                                    <img src={posts?.image_url}
                                        className="object-cover w-full rounded-xl md:h-[25vh]"
                                        alt={posts?.blog_title}
                                    />
                                </div>
                                <div className="p-2">
                                    <p className="text-pretty font-bold text-[1.5em] my-1 md:text-[1em] lg:text-[1.25em]"
                                        style={{ lineHeight: "1.25em" }}>
                                        {posts?.blog_title}
                                    </p>
                                    <p className="text-pretty mt-2 text-gray-900"
                                        dangerouslySetInnerHTML={{ __html: (posts?.summary)?.substring(0, 150) + ". . ." }} />
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
