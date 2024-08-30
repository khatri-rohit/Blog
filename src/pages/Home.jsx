/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import useUsers from "../context/User";

const Home = () => {
    const [blogPost, setBlogPost] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { model, user, oAuthStateChange } = useUsers();

    // Fetching All Blogs
    useEffect(() => {
        ; (async () => {
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select(`
                        id,
                        user_id,
                        blog_title,
                        summary,
                        blog_content,
                        formated_time,
                        image_url,
                        comments (
                            id,
                            content
                        ),
                        likes(
                            id,
                            likes
                        )
                    `)
                    .order('created_at', { ascending: false });

                // console.log("Data fetched successfully:\n", data);
                console.log(error);
                setBlogPost(data);

            } catch (error) {
                console.log("Something Wrong happned while fetching Blog Data\n", error);
            }
        })();

        ; (async () => {
            try {
                const { data } = await supabase
                    .from('users')
                    .select(`
                        id,
                        name, 
                        email                  
                    `);

                // console.log("All Users\n", data);
                setUsers(data);
            } catch (error) {
                console.log("Something Wrong happned While fetching Users\n", error);
            }
        })();



    }, []);

    const handlePost = (id) => {
        navigate(`/post/${id}`);
    }
    const signOut = async () => {
        await supabase.auth.signOut().then(res => oAuthStateChange({}));
    }

    return (
        <main className={`md:p-8 ${model ? 'blur-[5px]' : ''}`}>
            <button className="px-2"
                onClick={signOut}>Logout</button>
            <div className="container mx-auto w-3/4">
                {
                    blogPost?.map((post, _) => {
                        const persons = users?.find((person) => person.id === post.user_id);
                        const summary = (post?.summary).substring(0, 230) + '...';
                        return (
                            <div key={_} className="my-5 flex shadow-md bg-white rounded-lg">
                                <div className="mx-2 w-3/4 p-2">
                                    <p className="my-2 font-medium">
                                        ✨ {persons?.name}
                                    </p>
                                    <p onClick={() => handlePost(post?.id)}
                                        className="text-3xl font-medium cursor-pointer">
                                        {post?.blog_title}
                                    </p>
                                    <p className="text-xl mt-2 mb-3 text-gray-500">
                                        {summary}
                                    </p>
                                    <p className="font-light text-black text-sm mt-2">
                                        {post?.formated_time}
                                    </p>
                                </div>
                                <p className="w-1/3 mx-1 p-1 my-auto cursor-pointer"
                                    onClick={() => Object.keys(user).length !== 0 && handlePost(post?.id)}>
                                    <img src={post?.image_url}
                                        className="object-contain h-72 w-full" />
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </main>
    )
};

export default Home;
