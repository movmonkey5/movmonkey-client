import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Link from "next/link";
import ApiKit from "@/common/ApiKit";

const QuotationButton = ({ job }) => {
  console.log("job", job);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReject = async () => {
    try {
      setIsProcessing(true); // Show loading or disable buttons during the process
      // Make the API call to reject the job, but ignore any client_secret related data
      await ApiKit.me.updateStatus(job.uid, { status: "DECLINED" });
      console.log("Job rejected successfully");
      // Add any additional logic after rejecting the job (like notifying the user)
    } catch (error) {
      console.error("Error rejecting job:", error);
    } finally {
      setIsProcessing(false); // Reset loading state
    }
  };

  if (job.status === "ACCEPTED") {
    if (job.delivery_job) {
      return (
        <div className="mx-auto mt-10 flex max-w-[250px] flex-col items-center justify-center gap-6">
          <p className="text-center text-xl font-medium">
            Your job is active now
          </p>
          <Link
            href={`/track-jobs/${job.kind.toLowerCase()}/${job.delivery_job.uid}`}
            className="w-full max-w-[200px]"
          >
            <Button size="lg" className="w-full">
              Track Your Job
            </Button>
          </Link>
        </div>
      );
    }
    if (job.cleaning_job) {
      return (
        <div className="mx-auto mt-10 flex max-w-[250px] flex-col items-center justify-center gap-6">
          <p className="text-center text-xl font-medium">
            Your job is active now
          </p>
        </div>
      );
    } else {
      return (
        <div className="mx-auto mt-10 flex max-w-[250px] flex-col items-center justify-center gap-6">
          <p className="text-center text-xl font-medium">
            Your job is active now
          </p>
          {}
          <Link
            href={`/track-jobs/${job.kind.toLowerCase()}/${job.removal_job.uid}`}
            className="w-full max-w-[200px]"
          >
            <Button size="lg" className="w-full">
              Track Your Job
            </Button>
          </Link>
        </div>
      );
    }
  }

  if (job.status === "DECLINED") {
    return (
      <div className="mx-auto mt-10 flex flex-col items-center justify-center gap-6">
        <p className="text-center text-xl font-medium text-red-500">
          This job has been rejected.
        </p>
        <Link href="/quotation" className="w-full max-w-[200px]">
          <Button size="lg" className="w-full">
            Back to Quotations
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 flex max-w-[250px] flex-col-reverse items-center justify-between gap-6 sm:max-w-full sm:flex-row sm:gap-24">
      <Link href="/quotation" className="w-full max-w-[200px]">
        <Button size="lg" className="w-full">
          Back
        </Button>
      </Link>

      <Button
        variant="danger"
        size="lg"
        className="w-full max-w-[200px]"
        onClick={handleReject}
        disabled={isProcessing} // Disable during process
      >
        {isProcessing ? "Processing..." : "Reject"}
      </Button>

      <Link
        href={`/payment/${job.kind.toLowerCase()}/${job.uid}`}
        className="w-full max-w-[200px]"
      >
        <Button variant="secondary" size="lg" className="w-full">
          Accept
        </Button>
      </Link>
    </div>
  );
};

export default QuotationButton;
