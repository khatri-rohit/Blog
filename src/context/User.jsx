import { createContext, useContext } from "react";

export const UserContext = createContext({
    oAuthStateChange: () => { },
    user: {},
    model: false,
    showNewUser: false,
    changeModel: () => { },
    chnageNewUser: () => { },
    searchResult: [],
    changeSearchResult: () => { },
    getPost: [],
    getPosts: () => { },
    publish: false,
    changePublish: () => { }
});

export const ContextProvider = UserContext.Provider;

export default function useUsers() {
    return useContext(UserContext);
}