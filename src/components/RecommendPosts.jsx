/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import usePost from "../hooks/Blogs";
import { useNavigate } from "react-router-dom";

const RecommendPosts = ({ post }) => {

    const [data] = usePost();
    const [commanPosts, setCommanPosts] = useState([]);
    const recommendedPosts = [];
    const navigate = useNavigate(null);

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
        console.log(recommendedPosts);
        setCommanPosts(recommendedPosts);
    }, [recommendedPosts])

    return (
        commanPosts?.length !== 0 &&
        <div className="container mx-auto p-2 border-t-2 w-full" >
            <p className="text-2xl font-semibold">
                Recommended Posts
            </p>
            <div className="p-3 grid grid-cols-3">
                {
                    commanPosts?.map((posts, _) => (
                        <div className="border-r p-2 bg-white mr-1 drop-shadow-lg rounded-lg cursor-auto"
                            key={_}>
                            <div className="-w-xs overflow-hidden transition-shadow duration-300 ease-in-out">
                                <div className="cursor-pointer" onClick={() => navigate(`/post/${posts.id}`)}>
                                    <img src={posts?.image_url}
                                        className="object-cover w-full rounded-xl h-[25vh]"
                                        alt={posts?.blog_title}
                                    />
                                </div>
                                <div className="p-2 flex justify-between">
                                    <p className="text-pretty">
                                        {posts?.blog_title}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div >
    )
};

export default RecommendPosts;
