/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";

const PostDropDown = ({ children, size, curPost, setCurPost, postid }) => {
    const dropRef = useRef(null);

    useEffect(() => {
        const clickOutside = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setCurPost('');
            }
        };
        window.addEventListener("mousedown", clickOutside);
        return () => window.removeEventListener("mousedown", clickOutside);
    }, [dropRef, curPost]);

    return (
        <>
            {curPost === postid && (
                <div
                    ref={dropRef}
                    className={`shadows flex flex-col items-start absolute -right-2 top-[1.5rem] px-3 py-1 bg-gray-200 ${size}`}>
                    {children}
                </div>
            )}
        </>
    );
};

export default PostDropDown;
