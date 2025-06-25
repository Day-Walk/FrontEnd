import { atom, selector } from "recoil";
import { api } from "../utils/api";
import { userId } from "./userInfo";
import * as Interfaces from "../chatbot/interfaces/Interface";

export const chatLogState = atom<Interfaces.MessageType[]>({
  key: "chatLogState",
  default: [],
});

export const chatLogSelector = selector({
  key: "chatLogSelector",
  get: async ({ get }) => {
    const userIdState = get(userId);
    try {
      const res = await api.get("/chat/log", {
        params: {
          userId: userIdState,
        },
      });
      return res.data.chatLog;
    } catch (error) {
      console.error("채팅 로그 가져오기 실패 : ", error);
    }
  },
});
