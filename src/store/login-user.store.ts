

import User from "types/interface/user.interface";
import { create } from "zustand";


interface LoginUserStore {
    loginUser: User | null;
    setLoginUser: (LoginUser: User) => void;
    resetLoginUser: () => void;
};

const useLoginUserStore = create<LoginUserStore>(set => ({
    loginUser: JSON.parse(localStorage.getItem("loginUser") || "null"),
    setLoginUser: (loginUser) => {
        set(state => ({...state, loginUser}));
        localStorage.setItem("loginUser", JSON.stringify(loginUser));
    },
    resetLoginUser: () => {
        set(state => ({ ...state, loginUser: null}))
        localStorage.removeItem("loginUser");
    }
}));

export default useLoginUserStore;