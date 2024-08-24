// import { NavLink } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { SlNote } from "react-icons/sl";


const Navbar = () => {
    return (
        <div className="flex items-center justify-between p-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center mx-3">
                    <img src="/blogicon.png"
                        className="w-10" />
                    <a className="mx-2 font-semibold text-2xl">
                        DevDiscuss
                    </a>
                </div>
                <div
                    className="input-feild flex mx-1 items-center bg-slate-200  rounded-xl">
                    <div className="mx-1">
                        <BiSearch className="text-2xl mx-2" />
                    </div>
                    <input type="text"
                        className="bg-slate-200 p-2 rounded-xl outline-none"
                        placeholder="Search" />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center mx-1 hover:text-slate-500 cursor-pointer">
                    <SlNote className="text-xl" />
                    <p className="mx-1 font-normal">Write</p>
                </div>
                <div className="mx-1">
                    <img src="/blank-avatar.webp"
                        className="w-10 rounded-full" />
                </div>
            </div>
        </div>
    )
};

export default Navbar;
