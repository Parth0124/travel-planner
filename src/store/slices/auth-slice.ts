import { UserType } from "@/types/user";
import { StateCreator } from "zustand";

export interface AuthSlice{
    userInfo: undefined | UserType;
    setUserInfo: (userInfo: UserType) => void;
}

export const createAuthSlce : StateCreator<AuthSlice> = (set) => ({
    userInfo:undefined,
    setUserInfo : (userInfo: UserType) => set({userInfo}),
})