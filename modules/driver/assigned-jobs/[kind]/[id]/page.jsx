"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import Container from "@/components/shared/Container";
import Loading from "@/components/shared/Loading";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AssignedJobDetailsPage() {
  const params = useParams();
  
  const {
    data: job,
    isLoading,
    error
  } = useQuery({
    queryKey: ["assigned-job-details", params.kind, params.id],
    queryFn: async () => {
      if (!params.kind || !params.id) {
        throw new Error('Missing URL parameters');
      }

      try {
        console.log('Fetching job:', params.id, params.kind);
        const response = await ApiKit.me.job.assigned.getJobDetails(params.id, params.kind);
        
        if (!response.data) {
          throw new Error('No data received from API');
        }

        console.log('Job data:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch job details');
      }
    },
    enabled: Boolean(params.kind && params.id),
    retry: 1
  });

  if (isLoading) return <Loading className="h-screen" />;
  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-600 font-semibold">{error.message}</div>
        <Link href="/driver/assigned-jobs">
          <Button className="mt-4">Back to Jobs</Button>
        </Link>
      </div>
    );
  }
  if (!job) return <div className="p-4">Job not found</div>;

  return (
    <Container>
      <div className="space-y-6 bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        
        {/* Job Status */}
        {job.quotation?.status && (
          <div className="bg-blue-50 p-3 rounded">
            <p className="font-semibold">Status: {job.quotation.status}</p>
          </div>
        )}

        {/* Job Details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{job?.title}</h2>
          <p className="text-gray-600">Job ID: {job?.slug}</p>
          
          {job?.moving_date && (
            <div className="bg-primary/10 p-3 rounded">
              <p className="font-semibold">
                Execution Date: {format(new Date(job.moving_date), "PPP")}
              </p>
            </div>
          )}

          {/* Location Details */}
          <div className="space-y-4 mt-6">
            <div className="flex flex-col md:flex-row justify-between">
              <span className="font-semibold md:w-1/3">Moving From:</span>
              <span className="md:w-2/3">{job.distance?.moving_from || "Not specified"}</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <span className="font-semibold md:w-1/3">Moving To:</span>
              <span className="md:w-2/3">{job.distance?.moving_to || "Not specified"}</span>
            </div>
          </div>
        </div>

        {/* Quotation Details */}
        {job.quotation && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Quotation Details</h3>
            <div className="space-y-2">
              <p>Amount: {job.quotation.total_amount} {job.quotation.currency}</p>
              <p>Status: {job.quotation.status}</p>
              <p>Created: {format(new Date(job.quotation.created_at), "PPP")}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link href="/driver/assigned-jobs">
          <Button>Back to Assigned Jobs</Button>
        </Link>
      </div>
    </Container>
  );
}
