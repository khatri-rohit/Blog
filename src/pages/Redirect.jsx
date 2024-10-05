import { HiHome } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Redirect = () => {
    const navigate = useNavigate(null);
    return (
        <div className="flex flex-col items-center justify-center md:h-full h-[80vh]">
            <img src="/404.png" alt="404" />
            <button className="px-2 bg-black py-2 flex items-center text-white text-2xl rounded-full"
                onClick={() => navigate('/')}>
                <HiHome className="mx-1 text-2xl" />
                <p className="mb-1 font-bold">Go Home</p>
            </button>
        </div>
    )
};

export default Redirect;
