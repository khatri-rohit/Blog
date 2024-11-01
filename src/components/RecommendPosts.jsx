/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import usePost from "../hooks/Blogs";

const RecommendPosts = ({ _post, id }) => {

    const { post } = usePost();
    const [commanPosts, setCommanPosts] = useState([]);
    const [show, setShow] = useState(4);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(null);
    const recommendedPosts = useMemo(() => {
        return []
    }, []);

    useEffect(() => {
        post?.map((blog) => {
            const PostTags = blog.tags.map(tag => tag.toLowerCase());
            const commantags = PostTags.filter((tags) => _post?.tags?.includes(tags));
            if (commantags.length > 0) {
                recommendedPosts.push({
                    ...blog
                });
            }
        });
        setCommanPosts(recommendedPosts);
    }, [id, post, recommendedPosts, _post?.tags]);

    const handleShowMore = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setShow(commanPosts.length);
        }, 250);
    }

    return (
        commanPosts?.length !== 0 &&
        <section className="md:p-2 p-3 border-t-2 border-gray-300 md:w-[80%] mx-auto flex flex-col justify-around mb-10">
            <p className="md:text-2xl text-xl font-bold dark:text-white">
                Recommended Posts
            </p>
            <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 lg:w-[95%] mx-auto w-full">
                {
                    commanPosts?.map((posts, _) => (
                        posts.id !== _post.id &&
                        show >= _ &&
                        (<div className="p-2 bg-white mt-2 drop-shadow-lg rounded-lg cursor-auto duration-300"
                            onClick={() => navigate(`/post/${posts.id}`)}
                            key={crypto.randomUUID()}>

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
                        </div>)
                    ))
                }
            </div>
            {loading &&
                <div className="my-3 flex items-center justify-center">
                    <ClipLoader size={40} color="gray" />
                </div>
            }
            {
                commanPosts.length > show &&
                show !== commanPosts.length &&
                <button className="my-4 text-[1em] font-medium dark:text-white"
                    onClick={handleShowMore}>
                    Show More
                </button>
            }
        </section>
    )
};

export default RecommendPosts;
