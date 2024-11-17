"use client";

import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./components/CheckoutPage";
import Container from "@/components/shared/Container";
import { useParams } from "next/navigation";
import ApiKit from "@/common/ApiKit";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useStore from "@/store";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home({ params }) {
  const category = params.slugs[0];
  const uid = params.slugs[1];
  const [showCheckout, setShowCheckout] = useState(false); // State to show/hide checkout

  // Fetch quotation details (no conditional logic)
  const { data: quotationDetails, isLoading: isJobsLoading } = useQuery({
    queryKey: ["me/quotations", uid],
    queryFn: () => ApiKit.me.getQuotationDetails(uid).then(({ data }) => data),
  });
  const [currency, setCurrency] = useState("$"); // Default currency symbol

  // Get user from store using the hook directly
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (user?.currency && user?.currencySymbol) {
      setCurrency(`${user.currency.toUpperCase()}${user.currencySymbol}`);
    }
  }, [user]);
  

  // Avoid rendering conditional hooks, handle jobDetails query safely
  const onlyCategory = category.split("_")[0];

  const {
    data: jobDetails,
    error,
    isLoading: isJobLoading,
  } = useQuery({
    queryKey: ["jobDetails", `job.${category}`],
    queryFn: async () => {
      if (!quotationDetails) return null; // Safeguard against missing quotationDetails
      const response = await ApiKit.me.job[onlyCategory].getJob(
        quotationDetails[category].uid,
      );
      return response.data;
    },
    enabled: !!quotationDetails, // Make sure this query only runs when quotationDetails is available
  });

  // Handle loading and error states
  if (isJobsLoading || isJobLoading) {
    return <div>Loading...</div>;
  }

  if (!quotationDetails) {
    return <div>No job details available.</div>;
  }

  if (error) {
    return <div>Error fetching job details: {error.message}</div>;
  }

  const amount = parseFloat(quotationDetails.total_amount);

  const handleProceedToPayment = () => {
    console.log("Proceeding to payment...");
    setShowCheckout(true); // Show the child CheckoutPage
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-black/10 lg:min-h-[calc(100vh-80px)]">
      <div className="bg-primary text-2xl font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:h-20">
          <h3>Payment</h3>
        </div>
      </div>

      <Container>
        <main className="mx-auto rounded-md border text-center text-black">
          <div className="flex flex-col gap-12 md:flex-row">
            {/* Job Summary Section */}
            <div className="w-full md:w-1/2">
              <div className="mb-10 flex flex-col gap-4 rounded-lg bg-primary p-5 text-left shadow-md">
                <h1 className="mb-4 text-3xl font-extrabold">Summary</h1>
                <p className="flex justify-between">
                  <span>
                    <strong>Subtotal:</strong>
                  </span>
                  <span>
                    {quotationDetails.subtotal} <small> {currency}</small>
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>
                    <strong>VAT (20%):</strong>
                  </span>
                  <span>
                    {" "}
                    {quotationDetails.total_vat} <small> {currency}</small>
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>
                    <strong>Service Charge:</strong>
                  </span>
                  <span>
                    {quotationDetails.extra_services_charge}{" "}
                    <small> {currency}</small>
                  </span>
                </p>
                <div className="border-t border-black"></div>
                <div className="flex flex-col gap-2">
                  <Label>Discount Code</Label>
                  <span className="my-2 flex gap-2">
                    <Input type="text" placeholder="Enter discount code" />
                    <Button className="w-24 bg-[#FF0000] p-4 hover:bg-red-500">
                      Apply
                    </Button>
                  </span>
                </div>
                <div className="border-t border-black"></div>
                <p className="flex justify-between">
                  <strong>Total Amount:</strong>{" "}
                  <span className="text-xl font-bold">
                    {currency} {quotationDetails.total_amount}
                  </span>
                </p>
                <Button
                  onClick={handleProceedToPayment}
                  disabled={showCheckout}
                  className="w-full rounded-3xl bg-[#FF0000] p-6 font-bold text-white hover:bg-red-500"
                >
                  Accept and Proceed to Payment
                </Button>
              </div>
            </div>

            {/* Driver Details Section */}
            <div className="w-full md:w-1/2">
              <div className="rounded-lg bg-primary p-5 text-left shadow-md">
                <h1 className="text-3xl font-extrabold">Job Details</h1>
                <p>
                  <strong>JOB ID:</strong> XXXX-XXXX-XXXX
                </p>
                <p>
                  <strong>Move From Address:</strong>{" "}
                  {jobDetails.distance?.moving_from}
                </p>
                <p>
                  <strong>Move to Address:</strong>{" "}
                  {jobDetails.distance?.moving_to}
                </p>
              </div>
            </div>
          </div>

          {/* Checkout Section */}
          {showCheckout && (
            <div className="mt-8 w-full">
              <Elements
                stripe={stripePromise}
                options={{
                  mode: "payment",
                  amount: amount,
                  currency: user.currency,
                }}
              >
                <CheckoutPage amount={amount} uid={uid} />
              </Elements>
            </div>
          )}
        </main>
      </Container>
    </div>
  );
}