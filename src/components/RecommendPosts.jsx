/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePost from "../hooks/Blogs";

const RecommendPosts = ({ post }) => {

    const [data] = usePost();
    const [commanPosts, setCommanPosts] = useState([]);
    const navigate = useNavigate(null);

    useEffect(() => {
        const recommendedPosts = [];
        data.map((blog) => {
            const PostTags = blog.tags.map(tag => tag.toLowerCase());
            const commantags = PostTags.filter((tags) => post?.tags?.includes(tags));

            if (commantags.length > 0) {
                recommendedPosts.push({
                    ...blog
                })
            }
        });
        console.log(recommendedPosts);
        setCommanPosts(recommendedPosts);
        
    }, [post]);

    return (
        commanPosts?.length !== 0 &&
        <section className="p-2 border-t-2 border-gray-300 w-[80%] mx-auto" >
            <p className="text-2xl font-bold">
                Recommended Posts
            </p>
            <div className="p-3 md:grid md:grid-cols-2 gap-4 md:w-[70%]">
                {
                    commanPosts?.map((posts, _) => (
                        posts.id !== post.id &&
                        <div className="border-r p-2 bg-white mr-1 drop-shadow-lg rounded-lg cursor-auto"
                            key={_}>
                            <div className="overflow-hidden transition-shadow duration-300 ease-in-out">
                                <div className="cursor-pointer"
                                    onClick={() => navigate(`/post/${posts.id}`)}>
                                    <img src={posts?.image_url}
                                        className="object-cover w-full rounded-xl h-[25vh]"
                                        alt={posts?.blog_title}
                                    />
                                </div>
                                <div className="p-2">
                                    <p className="text-pretty font-bold text-[1.5em] my-1"
                                        style={{ lineHeight: "1em" }}>
                                        {posts?.blog_title}
                                    </p>
                                    <p className="text-pretty mt-2"
                                        dangerouslySetInnerHTML={{ __html: posts?.summary }} />
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
