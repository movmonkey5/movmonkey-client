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
  initialized: false, // Add initialization state
  showPendingModal: false, // Add new state for modal
  showDisabledModal: false, // Add new state for disabled modal

  setInitialized: (value) => set({ initialized: value }),

  fetchUser: async () => {
    try {
      set({ userLoading: true });
      const { data } = await ApiKit.me.getMe();
      console.log("User data:", data);

      const currency = currencyMap[data.country] || {
        code: "usd",
        symbol: "$",
      };

      // Check both pending and disabled status
      const isPending = data.status && data.status.toUpperCase() === "PENDING";
      const isDisabled = data.status && data.status.toUpperCase() === "DISABLED";

      set({
        user: {
          ...data,
          currency: currency.code,
          currencySymbol: currency.symbol,
          formatPrice: (amount) => formatCurrency(amount, currency),
        },
        showPendingModal: isPending, // Set modal visibility based on status
        showDisabledModal: isDisabled,
        initialized: true, // Set initialized to true after successful fetch
      });
    } catch (error) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      HttpKit.client.defaults.headers.common["Authorization"] = "";
      window.location.reload();
    } finally {
      set({ userLoading: false });
    }
  },

  // Add function to close modal
  closePendingModal: () => set({ showPendingModal: false }),
  closeDisabledModal: () => set({ showDisabledModal: false }),

  logOut: async () => {
    set({ 
      user: null,
      initialized: false,
      showPendingModal: false,
      showDisabledModal: false
    });
    localStorage.removeItem(AUTH_TOKEN_KEY);
    await HttpKit.removeClientToken();
    // Removed automatic window.location.reload()
  },
}));

export default useStore;
