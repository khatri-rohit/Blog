import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";


const Post = () => {

    const { id } = useParams();
    const [post, setPost] = useState([]);

    useEffect(() => {
        ; (async () => {

            const { data, error } = await supabase
                .from('blog_posts')
                .select()
                .eq('id', id);

            if (data) {
                setPost(data[0]);
            }
            else
                console.log(error);
        })();

    }, [])

    return (
        <section className="p-5 bg-slate-100">
            {

            }
            {post &&
                (
                    <>
                        <div className="p-3 container mx-auto w-3/4">
                            <div className="mt-10">
                                <div className="w-3/4 mx-auto">
                                    <p className="text-5xl text-center font-extrabold mb-7">
                                        {post?.blog_title}
                                    </p>
                                    <p className="text-xl text-center text-gray-400">
                                        {post?.summary}
                                    </p>
                                </div>
                                <div className="w-full">
                                <img src={post?.image_url}
                                        className="h-[40em] my-4 mx-auto" />
                                </div>
                                <div className="w-3/4 mx-auto">
                                    <div className="text-xl p-3"
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
