import { useEffect, useState } from "react";

const Model = ({ children, model, setModel }) => {

    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (model) {
            setOpen(true);
        } else setOpen(false);
    }, [model])

    return (
        <>
            <div
                onClick={() => setModel(open ? false : true)}
                className={`fixed inset-0 z-10 
      ${open ? "visible opacity-100 bg-white/50" : "invisible opacity-0"
                    } transition-all duration-500 ${open || "visible opacity-100 bg-white/50"}`}
            />
            {children}
        </>
    )
};

export default Model;
