import { createContext, useContext } from "react";

export const UserContext = createContext({
    oAuthStateChange: () => { },
    user: {},
    model: false,
    changeModel: () => { },
});



export const ContextProvider = UserContext.Provider;

export default function useUsers() {
    return useContext(UserContext);
}