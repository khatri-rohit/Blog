
const Model = ({ children, profile, setProfile }) => {
    return (
        <>
            <div
                onClick={() => setProfile(false)}
                className={`fixed inset-0 z-10 
      ${profile ? "visible opacity-100 bg-white/50" : "invisible opacity-0"
                    } transition-all duration-500`}
            />
            {children}
        </>
    )
};

export default Model;
