import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const useFetch = (id) => {
    const [cur_user, setCur_user] = useState([]);

    useEffect(() => {
        ; (async () => {
            if (id) {
                console.log("User Hook",id);
                const { data } = await supabase
                    .from('users')
                    .select()
                    .eq('id', id);
                setCur_user(data[0]);
            }
        })();
    }, [id])

    return [cur_user];
};

export default useFetch;
