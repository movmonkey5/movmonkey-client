import { useQuery } from "@tanstack/react-query";
import { ApiKit } from "@/common/ApiKit";

// Custom hook to fetch VAT configuration
export const useVATConfig = (countryCode = "GB") => {
  return useQuery({
    queryKey: ["vat-config", countryCode],
    queryFn: async () => {
      try {
        // Make a direct API call to the public VAT config endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"}/public/vat-config/default/?country_code=${countryCode}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch VAT configuration");
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching VAT config:", error);
        // Return default VAT configuration if API fails
        return {
          vat_percentage: 20.00,
          country_code: countryCode,
          currency: countryCode === "GB" ? "GBP" : "USD",
          name: "Default VAT"
        };
      }
    },
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });
};

// Helper function to calculate VAT amount
export const calculateVAT = (subtotal, extraCharges, vatPercentage) => {
  const totalBeforeVAT = parseFloat(subtotal || 0) + parseFloat(extraCharges || 0);
  const vatAmount = (totalBeforeVAT * parseFloat(vatPercentage || 0)) / 100;
  return {
    totalBeforeVAT: totalBeforeVAT.toFixed(2),
    vatAmount: vatAmount.toFixed(2),
    totalWithVAT: (totalBeforeVAT + vatAmount).toFixed(2)
  };
};

// Helper function to format currency based on country
export const formatCurrency = (amount, countryCode = "GB") => {
  const currencyMap = {
    GB: { symbol: "£", currency: "GBP" },
    US: { symbol: "$", currency: "USD" },
    CA: { symbol: "$", currency: "CAD" },
    AU: { symbol: "$", currency: "AUD" }
  };
  
  const config = currencyMap[countryCode] || currencyMap.GB;
  return `${config.symbol}${parseFloat(amount).toFixed(2)}`;
};
