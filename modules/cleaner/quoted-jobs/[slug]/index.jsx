"use client";

import { useQuery } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import Loading from "@/components/shared/Loading";
import Container from "@/components/shared/Container";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserJobDetailsPage({ params }) {
  const notificationUid = params.slugs[1];
  const searchParams = useSearchParams();
  const fromNotification = searchParams.get("from") === "notifications";

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

  const renderQuotationDetails = () => (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <h3 className="mb-2 text-xl font-bold">Quotation Details</h3>
      <p>Title: {quotation.title}</p>
      <p>Kind: {quotation.kind}</p>
      <p>Extra Services: {quotation.extra_services || "None"}</p>
      <p>Extra Services Charge: {quotation.extra_services_charge}</p>
      <p>Subtotal: {quotation.subtotal}</p>
      <p>Total VAT: {quotation.total_vat}</p>
      <p>Total Amount: {quotation.total_amount}</p>
      <p>Created At: {new Date(quotation.created_at).toLocaleString()}</p>
      <p>Validity: {quotation.quotation_validity} days</p>
    </div>
  );

  return (
    <Container className="w-full">
      {quotation.status === "DECLINED" ? (
        <div className="my-6 border border-red-500 bg-red-100 p-4 text-red-700">
          <h2 className="text-2xl font-semibold">Quotation Declined</h2>
          <p>
            {job?.message || "Your quotation has been declined for this job."}
          </p>
          {renderQuotationDetails()}
          <Link href="/driver/assigned-jobs">
            <Button className="mt-4">Back to Assigned Jobs</Button>
          </Link>
        </div>
      ) : quotation.status === "COMPLETED" ? (
        <div className="my-6 border border-green-500 bg-green-100 p-4 text-green-700">
          <h2 className="text-2xl font-semibold">Job Completed</h2>
          <p>
            {job?.completionMessage ||
              "This job has been successfully completed."}
          </p>
          {renderQuotationDetails()}
          <Link href="/driver/completed-jobs">
            <Button className="mt-4">Back to Completed Jobs</Button>
          </Link>
        </div>
      ) : (
        <div className="my-8 bg-[#366935] p-4 text-white md:px-10">
          <h1 className="text-3xl font-semibold">Job is already assigned</h1>
          {quotation.status === "ACCEPTED" && (
            <div className="mt-4">
              <h3 className="mb-2 text-xl font-bold">
                Accepted Quotation Details
              </h3>
              {renderQuotationDetails()}
              <Link
                href={`/cleaner/assigned-jobs/${jobCategory}/${quotation.uid}`}
                className="mt-6 block w-fit rounded-lg bg-primary px-4 py-3 font-semibold text-white"
              >
                Go to Job Details
              </Link>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
