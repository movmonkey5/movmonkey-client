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

//   // Handle payment submission
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

//   const handleAccept = () => {
//     setShowPayment(true);
//   };

//   // Display loading state if clientSecret is still being fetched
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
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [clientSecret, setClientSecret] = useState(null);
  const user = useStore((state) => state.user);

  const { refetch: fetchClientSecret, isLoading: clientSecretLoading } =
    useQuery({
      queryKey: ["clientSecret", uid, amount],
      queryFn: async () => {
        try {
          const response = await ApiKit.me.updateStatus(uid, { status: "ACCEPTED" });
          return response.data.client_secret;
        } catch (error) {
          console.error("Error fetching client secret:", error);
          setErrorMessage("Failed to initialize payment. Please try again.");
          throw error;
        }
      },
      enabled: false,
      retry: 2,
    });

  useEffect(() => {
    const storedClientSecret = sessionStorage.getItem("paymentIntentClientSecret");
    
    const initializePayment = async () => {
      if (storedClientSecret) {
        setClientSecret(storedClientSecret);
      } else {
        try {
          const result = await fetchClientSecret();
          if (result?.data) {
            setClientSecret(result.data);
            sessionStorage.setItem("paymentIntentClientSecret", result.data);
          }
        } catch (error) {
          setErrorMessage("Could not initialize payment. Please refresh and try again.");
        }
      }
    };

    initializePayment();
  }, [fetchClientSecret]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPaymentStatus('processing');
    setErrorMessage(null);

    if (!stripe || !elements || !clientSecret) {
      setErrorMessage("Payment system not initialized. Please refresh the page.");
      setPaymentStatus('idle');
      return;
    }

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message);
        setPaymentStatus('error');
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL2}/payment/success?uid=${uid}&clientSecret=${clientSecret}`,
        },
      });

      if (confirmError) {
        setErrorMessage(confirmError.message);
        setPaymentStatus('error');
        return;
      }

      setPaymentStatus('success');
      router.push(`/payment/success?uid=${uid}&clientSecret=${clientSecret}`);
      
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setPaymentStatus('error');
    }
  };

  if (clientSecretLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-2 text-sm text-gray-600">Initializing payment...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {clientSecret && stripe && elements && (
          <div className="rounded-md border p-4">
            <PaymentElement />
          </div>
        )}
        
        <button
          type="submit"
          disabled={!stripe || paymentStatus === 'processing'}
          className="w-full rounded-md bg-primary p-4 font-bold text-black transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {paymentStatus === 'processing' ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `Pay ${user?.currencySymbol || '$'}${amount}`
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;