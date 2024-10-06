import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const usePost = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        ; (async () => {
            try {
                const response = await supabase
                    .from('posts')
                    .select();
                setData(response.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [])

    return [data];
};

export default usePost;
