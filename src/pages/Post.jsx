import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";


const Post = () => {

    const { id } = useParams();
    const [post, setPost] = useState([])


    useEffect(() => {
        ; (async () => {

            const { data, error } = await supabase
                .from('blog_posts')
                .select()
                .eq('id', id);

            if (data) {
                setPost(data);
                console.log(data[0].blog_content);
            }
            else
                console.log(error);
        })();

    }, [])

    return (
        <div className="p-5">
            {post?.map((blog) => {
                return (
                    <>
                        <p className="text-xl">
                            {blog?.blog_title}
                        </p>
                        <div className="text-xl border-2 p-3"
                            dangerouslySetInnerHTML={{ __html: blog?.blog_content }}
                        />

                    </>
                )
            })}
        </div>
    )
};

export default Post;
