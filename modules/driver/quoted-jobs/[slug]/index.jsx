"use client";

import { useQuery } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import Loading from "@/components/shared/Loading";
import Container from "@/components/shared/Container";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserJobDetailsPage({ params }) {
  const notificationUid = params.slugs[1];
  const searchParams = useSearchParams();
  const fromNotification = searchParams.get("from") === "notifications";

  // Fetch job details based on notification or directly from quotation
  const {
    data: job,
    isLoading: jobLoading,
    error: jobError,
  } = useQuery({
    queryKey: ["jobDetails", notificationUid],
    queryFn: () =>
      fromNotification &&
      ApiKit.me
        .getNotificationDetails(notificationUid)
        .then(({ data }) => data),
  });

  const uid = job?.quotation?.uid;

  // Fetch quotation details only if `fromNotification` is false, else it's already included in the job details
  const {
    data: quotation,
    isLoading: quotationLoading,
    error: quotationError,
  } = useQuery({
    queryKey: ["quotation", uid],
    queryFn: () =>
      ApiKit.me
        .getQuotationDetails(fromNotification ? uid : notificationUid)
        .then(({ data }) => data),
  });

  // Combine loading and error states
  const isLoading = jobLoading || quotationLoading;
  const error = jobError || quotationError;

  if (isLoading) {
    return <Loading className="h-screen" />;
  }

  if (error) {
    return <div>Error loading details: {error.message}</div>;
  }

  const jobCategory = !fromNotification
    ? quotation.kind.toLowerCase()
    : job.quotation.kind.toLowerCase();

  return (
    <div>
      {/* <div className="bg-primary text-lg font-semibold text-black md:text-2xl lg:mt-2">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-6 md:h-20">
          <h3>{quotation.title}</h3>
          <p className="text-xl text-red-500">
            Valid for{" "}
            <span className="text-red-500">
              {quotation.quotation_validity} days{" "}
            </span>
          </p>
        </div>
      </div> */}
      <Container className="w-full">
        {/* Handle Declined Status */}
        {quotation.status === "DECLINED" ? (
          <div>
          <div className="my-6 border border-red-500 bg-red-100 p-4 text-red-700">
            <h2 className="text-2xl font-semibold">Quotation Declined</h2>
            <p>
              {job?.message || "Your quotation has been declined for this job."}
            </p>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-bold">Quotation Details</h3>
              <p>Title: {quotation.title}</p>
              <p>Kind: {quotation.kind}</p>
              <p>Extra Services: {quotation.extra_services || "None"}</p>
              <p>Extra Services Charge: {quotation.extra_services_charge}</p>
              <p>Subtotal: {quotation.subtotal}</p>
              <p>Total VAT: {quotation.total_vat}</p>
              <p>Total Amount: {quotation.total_amount}</p>
              <p>
                Created At: {new Date(quotation.created_at).toLocaleString()}
              </p>
          </div>
          <Link href="/driver/assigned-jobs">
            <Button className="mt-4">Back to Assigned Jobs</Button>
           </ Link>
          </div>
        ) : (
          <div>
            <div className="my-8  flex flex-col justify-between bg-[#366935] p-4  md:px-10">
              <h1 className="text-3xl font-semibold text-white">
                Job is already assigned
              </h1>
            </div>

            {/* Handle other statuses like ACCEPTED */}
            <div className="flex w-full items-center justify-between py-6">
              {quotation.status === "ACCEPTED" && (
                <>
                  <div className="flex flex-col font-semibold test-2xl">
                    <h3 className="text-2xl font-bold my-4">Quotation Details</h3>
                    <p>Title: {quotation.title}</p>
                    <p>Kind: {quotation.kind}</p>
                    <p>Extra Services: {quotation.extra_services || "None"}</p>
                    <p>
                      Extra Services Charge: {quotation.extra_services_charge}
                    </p>
                    <p>Subtotal: {quotation.subtotal}</p>
                    <p>Total VAT: {quotation.total_vat}</p>
                    <p>Total Amount: {quotation.total_amount}</p>
                  </div>
                </>
              )}
            </div>

            {/* Quotation Details */}

            {/* Add link based on job status */}
            <div className="mt-8">
              <Link
                href={`/${quotation?.status === "ACCEPTED" ? "driver/assigned-jobs" : "driver/completed-jobs"}/${jobCategory}/${quotation?.uid}`}
                key={job?.uid}
                className="mb-3 block w-fit cursor-pointer rounded-lg bg-primary px-4 font-semibold max-lg:py-4 lg:rounded-full lg:px-6 lg:py-5"
              >
                Go to job Details {job?.title}
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
