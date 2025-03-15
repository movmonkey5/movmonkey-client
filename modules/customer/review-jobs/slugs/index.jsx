"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ApiKit from "@/common/ApiKit";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";
import CleaningDetails from "./components/CleaningDetails";
import RemovalDetails from "./components/RemovalDetails";
import DeliveryDetails from "./components/DeliveryDetails";
import { Textarea } from "@/components/ui/textarea";
import Container from "@/components/shared/Container";

export default function UserJobDetailsPage({ params }) {
  const category = params.slugs[0].split("-").slice(0, 2).join("_");
  const uid = params.slugs[1];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [moreInfo, setMoreInfo] = useState("");
  
  // Determine if this is a cleaning job for field name selection
  const isCleaningJob = category === "cleaning_job";
  
  const fetchDetails = (category) => {
    let fetchToApi;
    switch (category) {
      case "cleaning_job":
        return (fetchToApi = ApiKit.me.job.cleaning.getJob(uid));
      case "removal_job":
        return (fetchToApi = ApiKit.me.job.removal.getJob(uid));
      case "delivery_job":
        return (fetchToApi = ApiKit.me.job.delivery.getJob(uid));
      default:
        return null;
    }
  };
  
  const handleMoreInfoChange = (e) => {
    setMoreInfo(e.target.value);
  };
  
  const { data: jobData, isLoading } = useQuery({
    queryKey: [category, uid],
    queryFn: () => fetchDetails(category).then(({ data }) => data),
  });

  // Set the initial value based on job type
  useEffect(() => {
    if (jobData) {
      if (isCleaningJob && jobData.additional_cleaning_information) {
        setMoreInfo(jobData.additional_cleaning_information);
      } else if (jobData.any_more_move) {
        setMoreInfo(jobData.any_more_move);
      }
    }
  }, [jobData, isCleaningJob]);

  const updateJobMutation = useMutation({
    mutationFn: (formData) => {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      switch (category) {
        case "cleaning_job":
          return ApiKit.me.job.cleaning.updateJob(uid, formData);
        case "removal_job":
          return ApiKit.me.job.removal.updateJob(uid, formData);
        case "delivery_job":
          return ApiKit.me.job.delivery.updateJob(uid, formData);
        default:
          throw new Error("Invalid job category");
      }
    },
    onSuccess: () => {
      router.push(`/create-job/success`);
      toast.success("Your job has been submitted successfully!");
    },
    onError: (error) => {
      console.error("Job update error:", error);
      let errorMessage = "Failed to update job. Please try again later.";
      if (error.response?.data) {
        const errorKeys = Object.keys(error.response.data);
        errorMessage =
          error.response.data?.detail ||
          error.response.data[errorKeys[0]][0] ||
          errorMessage;
      }
      toast.error(errorMessage);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmitJob = async () => {
    setIsSubmitting(true);

    // Prepare the data to patch
    const formData = new FormData();
    formData.append("status", "ACTIVE");
    
    // Use the appropriate field name based on job category
    if (isCleaningJob) {
      formData.append("additional_cleaning_information", moreInfo);
    } else {
      formData.append("any_more_move", moreInfo);
    }

    updateJobMutation.mutate(formData);
  };

  if (isLoading) {
    return <Loading className="h-screen" />;
  }

  // Define title and placeholder based on job category
  const infoTitle = isCleaningJob 
    ? "Do you have any additional information about this cleaning job?"
    : category === "removal_job" 
      ? "Is there any more you can tell us about your removal?"
      : "Is there any more you can tell us about your delivery?";
  
  const infoPlaceholder = isCleaningJob
    ? "Add any specific instructions about cleaning..."
    : "Write here...";

  return (
    <div>
      <Container>
        {category === "cleaning_job" && <CleaningDetails job={jobData} />}
        {category === "removal_job" && <RemovalDetails job={jobData} />}
        {category === "delivery_job" && <DeliveryDetails job={jobData} />}
        <div>
          <p className="mb-4 text-xl font-semibold">
            {infoTitle}
          </p>
          <Textarea
            id={isCleaningJob ? "additional_cleaning_information" : "any_more_move"}
            name={isCleaningJob ? "additional_cleaning_information" : "any_more_move"}
            placeholder={infoPlaceholder}
            value={moreInfo}
            onChange={handleMoreInfoChange}
          />
        </div>
      </Container>
      <div className="container mx-auto my-4 flex justify-end">
        <Button type="button" className="mt-4" onClick={handleSubmitJob}>
          {isSubmitting ? "Submitting..." : "Submit Job"}
        </Button>
      </div>
    </div>
  );
}
