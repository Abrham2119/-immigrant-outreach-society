import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface TState {
  currentLang: string;
  changeLang: (lang: string) => void;
}

const useStore = create(
  persist<TState>(
    (set) => ({
      currentLang: "/en",
      changeLang: (lang: string) =>
        set(() => ({
          currentLang: lang === "am" ? "/am" : "/en",
        })),
    }),
    {
      name: "langauge",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStore;
