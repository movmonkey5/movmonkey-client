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

const CheckoutPage = ({ amount, uid }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  // Fetch the client secret using createPaymentIntent
  const { refetch: fetchClientSecret, isLoading: clientSecretLoading } =
    useQuery({
      queryKey: ["clientSecret", uid, amount],
      queryFn: () => {
        return ApiKit.me
          .updateStatus(uid, { status: "ACCEPTED" })
          .then((response) => response.data.client_secret);
      },
      enabled: false, // Disable auto-fetching
    });

  useEffect(() => {
    // Check if there's a stored client secret in sessionStorage
    const storedClientSecret = sessionStorage.getItem(
      "paymentIntentClientSecret",
    );
    if (storedClientSecret) {
      setClientSecret(storedClientSecret);
    } else {
      // If not, fetch a new one and store it
      fetchClientSecret().then((result) => {
        if (result.data) {
          setClientSecret(result.data);
          sessionStorage.setItem("paymentIntentClientSecret", result.data);
        }
      });
    }
  }, [fetchClientSecret]);

  // Handle payment submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) {
      setErrorMessage(
        "Stripe has not initialized yet or client secret is missing.",
      );
      setLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `/payment/success?uid=${uid}&clientSecret=${clientSecret}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    router.push(`/payment/success?uid=${uid}&clientSecret=${clientSecret}`);
  };

  const handleAccept = () => {
    setShowPayment(true);
  };

  // Display loading state if clientSecret is still being fetched
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
        {errorMessage && <div className="text-red-600">{errorMessage}</div>}
        <button
          disabled={!stripe || loading}
          className="mt-2 w-full rounded-md bg-primary p-5 font-bold text-black disabled:animate-pulse disabled:opacity-50"
        >
          {!loading ? `Pay £${amount}` : "Processing..."}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
