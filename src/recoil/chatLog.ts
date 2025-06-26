import { atom } from "recoil";
import * as Interfaces from "../chatbot/interfaces/Interface";

interface ChatLogState {
  log: Interfaces.MessageType[];
  isLoaded: boolean;
}

export const chatLogState = atom<ChatLogState>({
  key: "chatLogState",
  default: {
    log: [],
    isLoaded: false,
  },
});

export const chatLoading = atom<boolean>({
  key: "chatLoading",
  default: false,
});
