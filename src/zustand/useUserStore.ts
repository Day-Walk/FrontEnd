import { create } from "zustand";

interface UserStore {
  userId: string;
  userName: string;
  setUserId: (id: string) => void;
  setUserName: (name: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userId: localStorage.getItem("userId") || "",
  userName: localStorage.getItem("userName") || "",
  setUserId: (id) => {
    localStorage.setItem("userId", id);
    set({ userId: id });
  },
  setUserName: (name) => {
    localStorage.setItem("userName", name);
    set({ userName: name });
  },
}));
