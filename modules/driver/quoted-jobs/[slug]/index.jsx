"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          {/* Status Banner with adjusted text size */}
          <div className={`rounded-2xl shadow-lg p-6 mb-8 transform hover:scale-[1.01] transition-transform ${
            quotation.status === "DECLINED" ? 
            "bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500" : 
            "bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500"
          }`}>
            <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${
              quotation.status === "DECLINED" ? "text-red-700" : "text-green-700"
            }`}>
              {quotation.status === "DECLINED" ? "Quotation Declined" : "Job Assignment Status"}
            </h1>
            <p className="text-gray-700 text-base">
              {quotation.status === "DECLINED" 
                ? (job?.message || "Your quotation has been declined for this job.") 
                : "Your job has been successfully assigned and is ready for review"}
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-xl shadow-xl p-6 backdrop-blur-sm backdrop-filter">
            {/* Quotation Header */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 hover:text-primary transition-colors">
                {quotation.title}
              </h2>
              <div className="inline-block px-4 py-2 bg-blue-50 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <p className="text-blue-700 font-medium text-sm">
                  {quotation.kind.replace('_', ' ')}
                </p>
              </div>
            </div>

            {/* Quotation Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Financial Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <span className="text-gray-600 text-sm">Subtotal:</span>
                    <span className="font-medium">£{quotation.subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <span className="text-gray-600 text-sm">VAT:</span>
                    <span className="font-medium">£{quotation.total_vat}</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                    <span className="text-gray-800 font-semibold text-sm">Total Amount:</span>
                    <span className="text-green-600 font-bold text-lg">£{quotation.total_amount}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Additional Services</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 font-medium text-sm mb-2">Extra Services:</p>
                  <p className="text-gray-600 text-sm">{quotation.extra_services || "No additional services requested"}</p>
                  {quotation.extra_services_charge > 0 && (
                    <p className="text-gray-700 mt-3 text-sm">
                      Additional Charge: <span className="text-blue-600 font-semibold">£{quotation.extra_services_charge}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Creation Date */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-xs italic">
                Created: {format(new Date(quotation.created_at), "PPP 'at' p")}
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-6 flex justify-center">
              <Link href="/driver/assigned-jobs">
                <Button 
                  variant="outline" 
                  className="px-6 py-3 text-base font-medium rounded-lg hover:shadow-md transition-all duration-300 bg-primary text-white hover:bg-primary/90"
                >
                  ← Return to Assigned Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
