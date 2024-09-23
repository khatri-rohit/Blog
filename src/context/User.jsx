import { createContext, useContext } from "react";

export const UserContext = createContext({
    oAuthStateChange: () => { },
    user: {},
    // gModel: false,
    // changeModel: () => { },
    // showNewUser: false,
    // chnageNewUser: () => { },
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