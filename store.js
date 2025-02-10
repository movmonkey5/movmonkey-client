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
  ca: { code: "cad", symbol: "CAD$" },
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
  showPendingModal: false, // Add new state for modal

  fetchUser: async () => {
    try {
      set({ userLoading: true });
      const { data } = await ApiKit.me.getMe();
      console.log("User data:", data);

      const currency = currencyMap[data.country] || {
        code: "usd",
        symbol: "$",
      };

      // Explicitly check status
      const isPending = data.status && data.status.toUpperCase() === "PENDING";
      console.log("Is pending:", isPending, "Status:", data.status);

      set({
        user: {
          ...data,
          currency: currency.code,
          currencySymbol: currency.symbol,
          formatPrice: (amount) => formatCurrency(amount, currency),
        },
        showPendingModal: isPending, // Set modal visibility based on status
      });
      set({ userLoading: false });
    } catch (error) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      HttpKit.client.defaults.headers.common["Authorization"] = "";
      window.location.reload();
    }
  },

  // Add function to close modal
  closePendingModal: () => set({ showPendingModal: false }),

  logOut: async () => {
    set({ user: null });
    localStorage.removeItem(AUTH_TOKEN_KEY);
    await HttpKit.removeClientToken();
  },
}));

export default useStore;
