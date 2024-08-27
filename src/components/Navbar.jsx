import { BiSearch } from "react-icons/bi";
import { SlNote } from "react-icons/sl";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-2 py-4 border-b-2">
            <div className="flex items-center justify-between">
                <NavLink to={'/'} className="flex items-center mx-3">
                    <img src="/blogicon.png"
                        className="w-10" />
                    <p className="mx-2 font-semibold text-2xl">
                        DevDiscuss
                    </p>
                </NavLink>
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
                <NavLink to={"/create"} className="flex items-center mx-1 hover:text-slate-500 cursor-pointer">
                    <SlNote className="text-xl" />
                    <p className="mx-1 font-normal">Write</p>
                </NavLink>
                <div className="mx-1">
                    <img src="/blank-avatar.webp"
                        className="w-10 rounded-full" />
                </div>
            </div>
        </nav>
    )
};

export default Navbar;
