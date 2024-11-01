import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";

// Custom Hook for fetching Blogs from Database with a specific Id and without any specific Id
const usePost = (postId = null) => {

    const fetchPost = async () => {
        // Check for null or undefined
        if (!postId) {
            const { data, error } = await supabase
                .from('posts')
                .select(`
                        id,
                        user_id,
                        blog_title,
                        summary,
                        blog_content,
                        formated_time,
                        image_url,
                        preview,
                        tags,
                        comments (
                            id,
                            content
                        ),
                        likes(
                            id,
                            like
                        )
                    `)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }
            return data;
        }

        const { data, error } = await supabase
            .from("posts")
            .select()
            .eq("id", postId);

        if (error) {
            throw error;
        }
        return data[0];
    };

    // Only enable the query when needed
    const { data: post, isLoading, isError, error } = useQuery({
        queryKey: postId ? ["post", postId] : ["posts"],
        queryFn: fetchPost,
    });

    return { post, isLoading, isError, error };
};

export default usePost;
