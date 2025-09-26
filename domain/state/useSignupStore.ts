import { create } from "zustand";

interface SignupState {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  clearPhoneNumber: () => void;
}

const useSignupStore = create<SignupState>((set) => ({
  phoneNumber: "",
  setPhoneNumber: (phone: string) => set({ phoneNumber: phone }),
  clearPhoneNumber: () => set({ phoneNumber: "" }),
}));

export default useSignupStore; 