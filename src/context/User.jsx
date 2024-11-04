import { createContext, useContext } from "react";

export const UserContext = createContext({
    oAuthStateChange: () => { },
    user: [],
    searchResult: [],
    changeSearchResult: () => { },
    getPost: [],
    getPosts: () => { },
    publish: false,
    changePublish: () => { },
    login: false,
    changeLogin: () => { },
    model: false,
    changeModel: () => { }
});

export const ContextProvider = UserContext.Provider;

export default function useUsers() {
    return useContext(UserContext);
}