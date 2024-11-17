"use client";

import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ApiKit from "@/common/ApiKit";
import useStore from "@/store";

const CheckoutPage = ({ amount, uid }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const user = useStore((state) => state.user);

  // Enhanced error handling for client secret fetch
  const { refetch: fetchClientSecret, isLoading: clientSecretLoading } =
    useQuery({
      queryKey: ["clientSecret", uid, amount],
      queryFn: async () => {
        try {
          const response = await ApiKit.me.updateStatus(uid, { status: "ACCEPTED" });
          console.log("Client Secret Response:", response);
          
          if (!response.data?.client_secret) {
            throw new Error("No client secret received from server");
          }
          
          return response.data.client_secret;
        } catch (error) {
          console.error("Error fetching client secret:", error);
          throw new Error(`Failed to initialize payment: ${error.message}`);
        }
      },
      enabled: false,
      retry: 2,
      retryDelay: 1000,
    });

  useEffect(() => {
    // Validate Stripe initialization
    if (!stripe) {
      console.error("Stripe has not been initialized");
      setErrorMessage("Payment system initialization failed");
      return;
    }

    const initializePayment = async () => {
      try {
        // Check for existing client secret
        const storedSecret = sessionStorage.getItem("paymentIntentClientSecret");
        
        if (storedSecret) {
          // Validate stored secret still works
          const { paymentIntent } = await stripe.retrievePaymentIntent(storedSecret);
          
          if (paymentIntent && paymentIntent.status !== "succeeded") {
            setClientSecret(storedSecret);
            setPaymentIntent(paymentIntent);
            return;
          }
        }
        
        // Fetch new client secret if needed
        const result = await fetchClientSecret();
        if (result) {
          setClientSecret(result);
          sessionStorage.setItem("paymentIntentClientSecret", result);
          
          // Retrieve and store payment intent details
          const { paymentIntent } = await stripe.retrievePaymentIntent(result);
          setPaymentIntent(paymentIntent);
        }
      } catch (error) {
        console.error("Payment initialization error:", error);
        setErrorMessage("Failed to initialize payment. Please try again.");
      }
    };

    initializePayment();
  }, [stripe, fetchClientSecret]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (!stripe || !elements || !clientSecret) {
        throw new Error("Payment system not fully initialized");
      }

      // Validate payment intent status before proceeding
      if (paymentIntent?.status === "succeeded") {
        console.log("Payment already completed");
        router.push(`/payment/success?uid=${uid}&clientSecret=${clientSecret}`);
        return;
      }

      // Submit the payment form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      // Confirm the payment
      const { error: confirmError, paymentIntent: updatedIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment/success?uid=${uid}&clientSecret=${clientSecret}`,
        },
      });

      if (confirmError) {
        throw confirmError;
      }

      // Handle immediate success case
      if (updatedIntent?.status === "succeeded") {
        router.push(`/payment/success?uid=${uid}&clientSecret=${clientSecret}`);
      }

    } catch (error) {
      console.error("Payment processing error:", error);
      setErrorMessage(
        error.message || "An error occurred while processing your payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (clientSecretLoading) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="text-surface inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md bg-white p-2">
      <form onSubmit={handleSubmit}>
        {clientSecret && stripe && elements && <PaymentElement />}
        {errorMessage && (
          <div className="mt-2 rounded-md bg-red-50 p-2 text-red-600">
            {errorMessage}
          </div>
        )}
        <button
          disabled={!stripe || loading}
          className="mt-2 w-full rounded-md bg-primary p-5 font-bold text-black disabled:animate-pulse disabled:opacity-50"
        >
          {!loading ? `Pay ${amount} ${user?.currencySymbol || '$'}` : "Processing..."}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;

// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   useStripe,
//   useElements,
//   PaymentElement,
// } from "@stripe/react-stripe-js";
// import { useQuery } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import ApiKit from "@/common/ApiKit";
// import useStore from "@/store";

// const CheckoutPage = ({ amount, uid }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const router = useRouter();
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showPayment, setShowPayment] = useState(false);
//   const [clientSecret, setClientSecret] = useState(null);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

//   // Fetch the client secret using createPaymentIntent
//   const { refetch: fetchClientSecret, isLoading: clientSecretLoading } =
//     useQuery({
//       queryKey: ["clientSecret", uid, amount],
//       queryFn: () => {
//         return ApiKit.me
//           .updateStatus(uid, { status: "ACCEPTED" })
//           .then((response) => response.data.client_secret);
//       },
//       enabled: false, // Disable auto-fetching
//     });

//   const [currency, setCurrency] = useState("$"); // Default currency symbol
//   const user = useStore((state) => state.user);

//   useEffect(() => {
//     if (user?.currencySymbol) {
//       setCurrency(user.currencySymbol);
//     }
//   }, [user]);
// /*
//   useEffect(() => {
//     // Check if there's a stored client secret in sessionStorage
//     const storedClientSecret = sessionStorage.getItem(
//       "paymentIntentClientSecret",
//     );
//     if (storedClientSecret) {
//       setClientSecret(storedClientSecret);
//     } else {
//       // If not, fetch a new one and store it
//       fetchClientSecret().then((result) => {
//         if (result.data) {
//           setClientSecret(result.data);
//           sessionStorage.setItem("paymentIntentClientSecret", result.data);
//         }
//       });
//     }
//   }, [fetchClientSecret]);
// */
// useEffect(() => {
//   console.log("Stripe instance:", stripe);
//   console.log("Elements instance:", elements);
//   console.log("User currency symbol:", user?.currencySymbol);

//   // Check if there's a stored client secret in sessionStorage
//   const storedClientSecret = sessionStorage.getItem(
//     "paymentIntentClientSecret",
//   );
//   console.log("Stored Client Secret:", storedClientSecret);

//   if (storedClientSecret) {
//     setClientSecret(storedClientSecret);
//   } else {
//     // If not, fetch a new one and store it
//     fetchClientSecret().then((result) => {
//       console.log("Fetched Client Secret:", result?.data);
//       if (result.data) {
//         setClientSecret(result.data);
//         sessionStorage.setItem("paymentIntentClientSecret", result.data);
//       }
//     });
//   }
// }, [fetchClientSecret]);
// /*
//   useEffect(() => {
//     if (elements) {
//       // Listen for payment method selection changes
//       const paymentElement = elements.getElement(PaymentElement);
//       paymentElement?.on("change", (event) => {
//         setSelectedPaymentMethod(event.value?.type); // E.g., "card", "cashapp", etc.
//       });
//     }
//   }, [elements]);
// */
// useEffect(() => {
//   if (elements) {
//     const paymentElement = elements.getElement(PaymentElement);
//     paymentElement?.on("change", (event) => {
//       console.log("Selected Payment Method:", event.value?.type);
//       setSelectedPaymentMethod(event.value?.type);
//     });
//   }
// }, [elements]);
// /*
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);

//     if (!stripe || !elements || !clientSecret) {
//       setErrorMessage(
//         "Stripe has not initialized yet or client secret is missing.",
//       );
//       setLoading(false);
//       return;
//     }

//     const { error: submitError } = await elements.submit();

//     if (submitError) {
//       setErrorMessage(submitError.message);
//       setLoading(false);
//       return;
//     }

//     const { error } = await stripe.confirmPayment({
//       elements,
//       clientSecret,
//       confirmParams: {
//         return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment/success?uid=${uid}&clientSecret=${clientSecret}`,
//       },
//     });

//     if (error) {
//       setErrorMessage(error.message);
//       setLoading(false);
//       return;
//     }

//     router.push(`/payment/success?uid=${uid}&clientSecret=${clientSecret}`);
//   };
// */
// const handleSubmit = async (event) => {
//   event.preventDefault();
//   setLoading(true);
//   console.log("Submitting payment...");
//   console.log("Stripe instance:", stripe);
//   console.log("Elements instance:", elements);
//   console.log("Client Secret:", clientSecret);

//   if (!stripe || !elements || !clientSecret) {
//     setErrorMessage(
//       "Stripe has not initialized yet or client secret is missing.",
//     );
//     setLoading(false);
//     return;
//   }

//   try {
//     const { error: submitError } = await elements.submit();
//     console.log("Submit Error:", submitError);

//     if (submitError) {
//       setErrorMessage(submitError.message);
//       setLoading(false);
//       return;
//     }

//     const { error } = await stripe.confirmPayment({
//       elements,
//       clientSecret,
//       confirmParams: {
//         return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment/success?uid=${uid}&clientSecret=${clientSecret}`,
//       },
//     });
//     console.log("Stripe confirmPayment Response Error:", error);

//     if (error) {
//       setErrorMessage(error.message);
//       setLoading(false);
//       return;
//     }

//     router.push(`/payment/success?uid=${uid}&clientSecret=${clientSecret}`);
//   } catch (err) {
//     console.error("Payment submission error:", err);
//     setErrorMessage("An unexpected error occurred.");
//     setLoading(false);
//   }
// };

//   if (clientSecretLoading) {
//     return (
//       <div className="flex items-center justify-center">
//         <div
//           className="text-surface inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
//           role="status"
//         >
//           <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
//             Loading...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-md bg-white p-2">
//       <form onSubmit={handleSubmit}>
//         {clientSecret && stripe && elements && <PaymentElement />}
//         {errorMessage && <div className="text-red-600">{errorMessage}</div>}
//         <button
//           disabled={!stripe || loading}
//           className="mt-2 w-full rounded-md bg-primary p-5 font-bold text-black disabled:animate-pulse disabled:opacity-50"
//         >
//           {!loading ? `Pay ${amount} ` : "Processing..."} {currency}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CheckoutPage;
