import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";

const useFetch = (id) => {
    const fetchUser = async () => {
        if (!id) return null;
        const { data, error } = await supabase
            .from("users")
            .select()
            .eq("id", id)
            .single();

        if (error) {
            throw new Error(error.message);
        }
        return data;
    };

    const { data: cur_user } = useQuery({
        queryKey: ["user", id],
        queryFn: fetchUser,
        enabled: !!id,
    });

    return { cur_user };
};

export default useFetch;
