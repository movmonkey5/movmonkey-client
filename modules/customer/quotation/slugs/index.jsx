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
  const isCompleted =
    jobCompleted || (quotation || job)?.status === "COMPLETED";

  const isDispute = (quotation || job)?.status === "DISPUTE";
  const isAccepted = (quotation || job)?.status === "ACCEPTED";

  return (
    <div>
      {isDispute ? (
        <div className=" flex  flex-col items-center justify-center p-6 text-center">
          <h1 className="text-3xl font-bold text-red-600">
            Your Job in Dispute
          </h1>
          <p className="text-lg text-red-500">
            There is a dispute regarding this job. Our support team is looking
            into it.
          </p>
          <p className="text-md mt-4">
            Please check your email for any updates regarding the dispute
            resolution, or contact support if you need further assistance.
          </p>
          <div>
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
      ) : isCompleted ? (
        <div className=" flex flex-col gap-2 bg-gray-200 p-6 text-center ">
          <h1 className="text-3xl font-bold">This Job has Completed</h1>
          <p className="text-lg">Thank you for using our services!</p>
          {quotation.is_rated === "False" ? (
            <Button className="mb-8 mt-4" onClick={() => setShowReview(true)}>
              Submit Review
            </Button>
          ) : (
            <span className="mb-8 font-bold">
              You have succesfully rated this job
            </span>
          )}
          <ReviewDialog
            isOpen={showReview}
            onOpenChange={setShowReview}
            jobUid={quotation[jobCategory]?.uid}
            jobkind={quotation?.kind || job?.quotation?.kind}
            userDetails={userDetails}
          />
          <div>
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
      ) : (
        <>
        {/* Work need */}
          <div className="bg-primary text-lg font-semibold text-black md:text-2xl lg:mt-2">
            <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-4 md:h-20 md:px-6">
              <h3>{quotation.title}</h3>
              <p className="text-xl text-white">
                Valid for
                {!fromNotification ? (
                  <span> {quotation.quotation_validity} days </span>
                ) : (
                  <span> {job.quotation.quotation_validity} days </span>
                )}
              </p>
            </div>
          </div>

          <Container className="w-full">
            <div>
              {isAccepted && (
                <div className="flex flex-col justify-between bg-[#366935] p-6">
                  <h1 className="mb-8  text-2xl font-semibold text-white lg:text-3xl">
                    Your Job is Active now
                  </h1>
                  <JobActions job={quotation || job} />
                </div>
              )}
            </div>
            <div className="w-full">
              <h1 className="my-2  w-full  text-center text-2xl font-bold md:my-8 lg:text-left lg:text-4xl">
                Job Assigned to
              </h1>
            </div>

            <div className="flex w-full items-center justify-between pb-6">
              {userDetails ? (
                <div className="w-full md:w-2/3">
                  <div className="flex flex-col">
                    <h5 className=" my-2 text-2xl font-semibold md:my-0 lg:text-3xl">
                      {userDetails.full_name}
                    </h5>
                    <p className="text-sm md:text-lg">{userDetails.email}</p>
                    <p>XXXXXX</p>
                    <p>{userDetails.phone}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <h5 className="text-xl font-medium"> Name : XXXXXXX</h5>
                  <p>XXXXXXX@gmail.com</p>
                  <p>XXXXXX</p>
                  <p>+44 XXXX XXXXX</p>
                </div>
              )}
              <div className="flex flex-col items-center justify-center  gap-4 md:gap-4">
                <Image alt="Driver Icon"
                  src={DrivrIcon}
                  width={100}
                  height={100}
                  className="h-20 w-20 rounded-full"
                />
                <h1 className="text-sm font-bold ">
                  {" "}
                  Ratings {userDetails
                    ? userDetails.rating.toFixed(2)
                    : "XXX"}{" "}
                  <span className="text-yellow-500">★ </span> ({" "}
                  <span className="text-gray-500">
                    {userDetails.rating_count} reviews)
                  </span>
                </h1>
              </div>
            </div>

            {/* Job and Quotation Details */}
            {jobCategory === "cleaning_job" && (
              <CleanerJobDetails job={quotation || job} />
            )}
            {jobCategory === "removal_job" && (
              <RemovalJobDetails job={quotation || job} />
            )}
            {jobCategory === "delivery_job" && (
              <DeliveryJobDetails job={quotation || job} />
            )}

            {/* Action Buttons */}
            <QuotationButton
              onReject={() => {}}
              onAccept={() => {}}
              job={quotation || job}
            />
          </Container>
        </>
      )}
    </div>
  );
}
