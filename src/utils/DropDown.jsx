import { useEffect, useRef } from "react";

const DropDown = ({ children, size, showDrop, setShowDrop }) => {
  const dropRef = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (showDrop && dropRef.current && !dropRef.current.contains(e.target)) {
        setShowDrop(false);
      }
    };
    window.addEventListener("mousedown", clickOutside);
    return () => window.removeEventListener("mousedown", clickOutside);
  }, [dropRef, showDrop]);

  return (
    <>
      {showDrop && (
        <div
          ref={dropRef}
          className={`shadows flex flex-col items-start absolute -right-2 top-[1.5rem] px-3 py-1 bg-gray-200 ${size}`}>
          {children}
        </div>
      )}
    </>
  );
};

export default DropDown;
