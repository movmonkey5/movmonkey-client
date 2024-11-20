import { create } from "zustand";
import ApiKit from "./common/ApiKit";
import HttpKit from "./common/HttpKit";
import { AUTH_TOKEN_KEY } from "./lib/keyChain";

let location;
if (typeof window !== "undefined") {
  location = window.location;
}

// Enhanced currency map with both code and symbol
const currencyMap = {
  uk: { code: "gbp", symbol: "£" },
  au: { code: "aud", symbol: "AUS$" },
  ca: { code: "cad", symbol: "CAD$ " },
  us: { code: "usd", symbol: "US$" },
};

// Format currency helper
const formatCurrency = (amount, currency) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.code.toUpperCase(),
    currencyDisplay: "symbol",
  });
  return formatter.format(amount);
};

const useStore = create((set) => ({
  user: null,
  userLoading: false,

  fetchUser: async () => {
    try {
      set({ userLoading: true });
      const { data } = await ApiKit.me.getMe();

      // Add currency info based on country code
      const currency = currencyMap[data.country] || {
        code: "usd",
        symbol: "$",
      }; // default to USD if not listed

      set({
        user: {
          ...data,
          currency: currency.code,
          currencySymbol: currency.symbol,
          formatPrice: (amount) => formatCurrency(amount, currency),
        },
      });
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
