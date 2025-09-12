"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import Loading from "@/components/shared/Loading";
import CleanerJobDetails from "./components/CleanerJobDetails";
import RemovalJobDetails from "./components/RemovalJobDetails";
import DeliveryJobDetails from "./components/DeliveryJobDetails";
import Container from "@/components/shared/Container";
import DrivrIcon from "@/public/icon/driver-icon.png";
import Image from "next/image";
import QuotationButton from "../components/QuotationButton";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import JobActions from "./components/JobActions";
import ReviewDialog from "./components/ReviewDialog";
import { Star, Clock, CheckCircle, AlertTriangle, User, Mail, Phone, Star as StarIcon } from "lucide-react";
import Link from "next/link";

export default function UserJobDetailsPage({ params }) {
  const notificationUid = params.slugs[1];
  const searchParams = useSearchParams();
  const fromNotification = searchParams.get("from") === "notifications";
  const [showReview, setShowReview] = useState(false);
  const [jobCompleted, setJobCompleted] = useState(false);

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

  const driverUid =
    quotation?.status === "ACCEPTED" || "COMPLETED" ? quotation?.uid : null;

  const {
    data: userDetails,
    isLoading: driverLoading,
    error: driverError,
  } = useQuery({
    queryKey: ["userDetails", driverUid],
    queryFn: () =>
      driverUid &&
      ApiKit.me.quotations.user
        .getUserDetails(driverUid)
        .then(({ data }) => data),
    enabled: !!driverUid,
  });

  const handleJobCompleted = () => {
    setJobCompleted(true);
  };

  const isLoading = jobLoading || quotationLoading || driverLoading;
  const error = jobError || quotationError || driverError;

  if (isLoading) {
    return <Loading className="h-screen" />;
  }

  if (error) {
    return <div>Error loading details: {error.message}</div>;
  }

  const jobCategory = !fromNotification
    ? quotation.kind.toLowerCase()
    : job.quotation.kind.toLowerCase();
  console.log("jobCategory adnannnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", quotation, job);//it is pending yet so used !isAccepted instead of isAccepted
  const isCompleted =
    jobCompleted || (quotation || job)?.status === "COMPLETED";

  const isDispute = (quotation || job)?.status === "DISPUTE";
  const isAccepted = (quotation || job)?.status === "ACCEPTED";

  return (
    <div className="min-h-screen bg-gray-50">
      {isDispute ? (
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-2xl bg-white p-8 shadow-lg border border-red-200">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="mb-4 text-3xl font-bold text-red-600">
                Your Job is in Dispute
              </h1>
              <p className="mb-6 text-lg text-red-500">
                There is a dispute regarding this job. Our support team is looking into it.
              </p>
              <p className="mb-8 text-gray-600">
                Please check your email for any updates regarding the dispute resolution, 
                or contact support if you need further assistance.
              </p>
              <Link href="/quotation" className="inline-block">
                <Button size="lg" className="px-8 py-3">
                  Back to Quotations
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 border-t pt-8">
              {jobCategory === "cleaning_job" && (
                <CleanerJobDetails job={quotation || job} />
              )}
              {jobCategory === "removal_job" && (
                <RemovalJobDetails job={quotation || job} />
              )}
              {jobCategory === "delivery_job" && (
                <DeliveryJobDetails job={quotation || job} />
              )}
            </div>
          </div>
        </div>
      ) : isCompleted ? (
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="mb-4 text-3xl font-bold text-green-600">
                Job Completed Successfully!
              </h1>
              <p className="mb-8 text-lg text-gray-600">
                Thank you for using our services!
              </p>
            </div>

            {quotation.is_rated === "False" ? (
              <div className="text-center">
                <Button 
                  className="mb-8 px-8 py-3" 
                  onClick={() => setShowReview(true)}
                >
                  Submit Review
                </Button>
              </div>
            ) : (
              <div className="mb-8">
                <div className="rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 p-6 border border-yellow-200">
                  <p className="mb-4 text-center text-lg font-semibold text-gray-800">
                    ✨ Your Review
                  </p>
                  
                  <div className="mb-4 flex items-center justify-center">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`h-6 w-6 ${
                          index < quotation.rating.rating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-gray-700">Date</p>
                      <p className="text-gray-600">
                        {new Date(quotation.rating.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-700">Rating</p>
                      <p className="text-gray-600">{quotation.rating.rating} / 5</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-700">Message</p>
                      <p className="text-gray-600">{quotation.rating.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <ReviewDialog
              isOpen={showReview}
              onOpenChange={setShowReview}
              jobUid={quotation[jobCategory]?.uid}
              jobkind={quotation?.kind || job?.quotation?.kind}
              userDetails={userDetails}
            />

            <div className="border-t pt-8">
              {jobCategory === "cleaning_job" && (
                <CleanerJobDetails job={quotation || job} />
              )}
              {jobCategory === "removal_job" && (
                <RemovalJobDetails job={quotation || job} />
              )}
              {jobCategory === "delivery_job" && (
                <DeliveryJobDetails job={quotation || job} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#49B74B] to-[#3a9639] text-white">
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-2xl md:text-3xl font-bold">{quotation.title}</h3>
                <div className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
                  <Clock className="h-5 w-5" />
                  <span className="text-lg font-semibold">
                    Valid for{" "}
                    {!fromNotification ? (
                      <span>{quotation.quotation_validity} days</span>
                    ) : (
                      <span>{job.quotation.quotation_validity} days</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Container className="py-8 max-w-none px-4 md:px-8">
            {/* Active Job Status */}
            {isAccepted && (
              <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#49B74B] to-[#3a9639] p-8 text-white shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold">
                    Your Job is Active Now
                  </h1>
                </div>
                <JobActions job={quotation || job} userDetails={userDetails} />
              </div>
            )}

            {/* Optimized Driver Assignment Card */}
            <div className="mb-6 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
              {/* Compact Header Section */}
              <div className="px-8 py-4" style={{
                backgroundColor: "#49B74B"
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-white">Service Provider</h2>
                    <p className="text-green-100 text-xs">Your dedicated professional</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="flex flex-col xl:flex-row xl:items-center gap-8">
                  {/* Compact Driver Details */}
                  <div className="flex-1">
                    {isAccepted ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-600 font-medium text-xs uppercase tracking-wide">Active</span>
                        </div>
                        
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">
                          {userDetails.full_name}
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                              <Mail className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Email</p>
                              <p className="text-base font-semibold text-gray-800">{userDetails.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-md flex items-center justify-center">
                              <Phone className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Phone</p>
                              <p className="text-base font-semibold text-gray-800">{userDetails.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                          <span className="text-yellow-600 font-medium text-xs uppercase tracking-wide">Pending</span>
                        </div>
                        
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-400">
                          Not Yet Assigned
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                            <div className="w-10 h-10 bg-gray-400 rounded-md flex items-center justify-center">
                              <Mail className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Email</p>
                              <p className="text-base font-semibold text-gray-400">The Details Will be revealed once accepted</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                            <div className="w-10 h-10 bg-gray-400 rounded-md flex items-center justify-center">
                              <Phone className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Phone</p>
                              <p className="text-base font-semibold text-gray-400">The Details Will be revealed once accepted</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Compact Driver Image and Rating */}
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className={`w-24 h-24 rounded-full p-0.5 ${isAccepted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}>
                        <div className="w-full h-full bg-white rounded-full p-1">
                          <Image
                            alt="Service Provider"
                            src={DrivrIcon}
                            width={96}
                            height={96}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                      </div>
                      {isAccepted && (
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                      {!isAccepted && (
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <Clock className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <div className={`p-4 rounded-lg ${isAccepted ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200'}`}>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <StarIcon className={`h-5 w-5 ${isAccepted ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                          <span className="text-xl font-bold text-gray-800">
                            {isAccepted ? userDetails.rating?.toFixed(1) : "---"}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          ({isAccepted ? userDetails?.rating_count : "--"} reviews)
                        </p>
                        <div className="flex justify-center">
                          {Array.from({ length: 5 }, (_, index) => (
                            <StarIcon
                              key={index}
                              className={`h-4 w-4 ${
                                isAccepted && index < Math.floor(userDetails.rating)
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Job Details Card */}
            <div className="mb-6 rounded-xl bg-white shadow-lg border border-gray-100">
              {jobCategory === "cleaning_job" && (
                <CleanerJobDetails job={quotation || job} />
              )}
              {jobCategory === "removal_job" && (
                <RemovalJobDetails job={quotation || job} />
              )}
              {jobCategory === "delivery_job" && (
                <DeliveryJobDetails job={quotation || job} />
              )}
            </div>

            {/* Compact Action Buttons Card */}
            <div className="rounded-xl bg-white p-8 shadow-lg border border-gray-100">
              <QuotationButton
                onReject={() => {}}
                onAccept={() => {}}
                job={quotation || job}
              />
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}
