/* eslint-disable react/prop-types */

const Model = ({ children, model, setModel }) => {

    return (
        <>
            <div
                onClick={() => setModel(false)}
                className={`fixed inset-0 z-10 
      ${model ? "visible opacity-100 bg-slate-300/60 dark:bg-slate-500/50" : "invisible opacity-0"
                    } transition-all duration-500 `}
            />
            {children}
        </>
    )
};

export default Model;