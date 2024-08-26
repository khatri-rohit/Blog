/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { NavLink } from "react-router-dom";

const Home = () => {

    const CDNURL = "https://kvgueljvvnnrbfjsohnf.supabase.co/storage/v1/object/public/img_posts/";

    const [blogPost, setBlogPost] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {

        ; (async () => {
            const { data, error } = await supabase
                .from('blog_posts')
                .select(`
                    id,
                    user_id,
                    blog_title,
                    summary,
                    created_at,
                    comments (
                        id,
                        content
                    ),
                    likes(
                        id,
                        likes
                    )
                `)
                .order('created_at', { ascending: true });

            console.log("Data fetched successfully:\n", data);
            console.log(error);
            setBlogPost(data);
        })();

        ; (async () => {
            const { data } = await supabase
                .from('users')
                .select(`
                    id,
                    name, 
                    email                  
                `);

            console.log(data);
            setUsers(data);
        })();

    }, []);

    return (
        <div className="md:p-8">
            <div className="container mx-auto">
                {
                    blogPost?.map((post, _) => {
                        const user = users?.find((user) => user.id === post.user_id);
                        return (
                            <div key={_} className="my-3 flex items-center border-4">
                                <div className="mx-2">
                                    <p className="my-0 font-light">
                                        {user?.name}
                                    </p>
                                    <NavLink to={`/post/${post.id}`} className="text-2xl font-medium">
                                        {post?.blog_title}
                                    </NavLink>
                                    <p className="text-lg ">
                                        {post?.summary}
                                    </p>
                                    <p className="font-light">
                                        {post?.created_at}
                                    </p>
                                </div>
                                <img src={`${CDNURL}${post?.id}/blogicon.png`} className="w-10" />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};

export default Home;
