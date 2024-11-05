import { create } from "zustand";
import ApiKit from "./common/ApiKit";
import HttpKit from "./common/HttpKit";
import { AUTH_TOKEN_KEY } from "./lib/keyChain";

let location;
if (typeof window !== "undefined") {
  location = window.location;
}

// Map country codes to currencies
const currencyMap = {
  uk: "gbp",
  au: "aud",
  ca: "cad",
  us: "usd",
};

const useStore = create((set) => ({
  user: null,
  userLoading: false,

  fetchUser: async () => {
    try {
      set({ userLoading: true });
      const { data } = await ApiKit.me.getMe();

      // Add currency based on country code
      const currency = currencyMap[data.country] || "usd"; // default to USD if not listed

      set({ user: { ...data, currency } });
      set({ userLoading: false });
    } catch (error) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      HttpKit.client.defaults.headers.common["Authorization"] = "";
      window.location.reload();
    }
  },

  logOut: async () => {
    set({ user: null });
    localStorage.removeItem(AUTH_TOKEN_KEY);
    await HttpKit.removeClientToken();
  },
}));

export default useStore;