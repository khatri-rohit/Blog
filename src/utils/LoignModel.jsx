/* eslint-disable react/prop-types */

export const LoignModel = ({ children, model }) => {
    return (
        <>
            <div
                className={`fixed inset-0 z-10
      ${model ? " visible opacity-100 bg-white/75" : "invisible opacity-0"
                    } transition-all duration-500 `}
            />
            {children}
        </>
    )
};
