"use client";
import React, { useEffect } from "react";
import ApiKit from "@/common/ApiKit";

export default function PaymentSuccess({ searchParams }) {
  const { uid } = searchParams;

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        // Retrieve the client secret from sessionStorage
        const clientSecret = sessionStorage.getItem(
          "paymentIntentClientSecret",
        );

        if (clientSecret) {
          const payload = {
            client_secret: clientSecret,
          };

          await ApiKit.me.confirmPayment(uid, payload);
          // You can handle success message here or update state if needed
        } else {
          console.warn("Client secret not found in sessionStorage");
          // Handle the case where the client secret is not available
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
        // Handle error state if necessary
      }
    };

    confirmPayment();
    // Delete the client secret from sessionStorage
    sessionStorage.removeItem("paymentIntentClientSecret");
  }, [uid]);

  return (
    <main className="m-10 mx-auto max-w-2xl rounded-2xl border bg-[#366935] p-10 text-center text-white">
      <div className="mb-10">
        <h1 className="mb-4 text-2xl font-bold text-white">Confirmation</h1>
        <h2 className="my-2 text-xl">Your Job is added as Active Job</h2>
        <p>Job Id : {uid}</p>

        <div className="rounded-mdp-2 mt-5 text-xl text-primary">
          {"<"} View Your Job from My Jobs
        </div>
      </div>
    </main>
  );
}
