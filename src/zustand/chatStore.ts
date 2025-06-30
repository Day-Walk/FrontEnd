import { create } from "zustand";
import * as Interfaces from "../chatbot/interfaces/Interface";

interface ChatStore {
  chatLog: Interfaces.MessageType[];
  isLoaded: boolean;
  loading: boolean;

  setChatLog: (chatLog: Interfaces.MessageType[]) => void;
  appendchatLog: (message: Interfaces.MessageType) => void;
  setIsLoaded: (loaded: boolean) => void;
  setLoading: (isLoading: boolean) => void;

  updateLastAnswer: (answer: Interfaces.MessageType["answer"]) => void;
  updateLastAnswerWithError: (errorMessage: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatLog: [],
  isLoaded: false,
  loading: false,

  setChatLog: (chatLog) => set({ chatLog }),
  appendchatLog: (message) =>
    set((state) => ({
      chatLog: [...state.chatLog, message],
    })),
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  setLoading: (isLoading) => set({ loading: isLoading }),

  updateLastAnswer: (answer) =>
    set((state) => {
      if (state.chatLog.length === 0) return state;

      const updated = [...state.chatLog];
      const lastIndex = updated.length - 1;
      updated[lastIndex] = {
        ...updated[lastIndex],
        answer,
      };

      return { chatLog: updated };
    }),

  updateLastAnswerWithError: (errorMessage) =>
    set((state) => {
      if (state.chatLog.length === 0) return state;

      const updated = [...state.chatLog];
      const lastIndex = updated.length - 1;
      updated[lastIndex] = {
        ...updated[lastIndex],
        answer: {
          placeList: [],
          detail: errorMessage,
        },
      };

      return { chatLog: updated };
    }),
}));
