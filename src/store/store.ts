import { create } from "zustand"
import { AuthSlice, createAuthSlce } from "./slices"


type StoreState = AuthSlice

export const useAppStore = create<StoreState>()((...a) => ({
    ...createAuthSlce(...a)
}))