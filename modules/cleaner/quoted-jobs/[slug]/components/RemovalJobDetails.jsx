import { useQuery } from "@tanstack/react-query";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ApiKit from "@/common/ApiKit";
import RemovalJobOverview from "../../components/RemovalOverview";
function JobDetailsSkeleton() {
  return (
    <div className="mt-10">
      <div className="bg-primary px-5 py-2 text-base font-bold md:text-xl">
        <div>Service Detail</div>
      </div>

      <div className="flex animate-pulse flex-col bg-primary-bg px-4 py-2">
        {/* Skeleton for each section */}
        <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
          <p className="h-6 w-40 rounded-md bg-gray-300"></p>
          <p className="h-6 w-40 rounded-md bg-gray-300"></p>
        </div>
        <hr />
        <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
          <p className="h-6 w-40 rounded-md bg-gray-300"></p>
          <p className="h-6 w-40 rounded-md bg-gray-300"></p>
        </div>
        <hr />
        <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
          <p className="h-6 w-40 rounded-md bg-gray-300"></p>
          <p className="h-6 w-40 rounded-md bg-gray-300"></p>
        </div>
        <hr />
        <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
          <p className="h-6 w-40 rounded-md bg-gray-300"></p>
          <p className="h-6 w-40 rounded-md bg-gray-300"></p>
        </div>
      </div>

      <div className="mt-10 animate-pulse bg-primary-bg px-4 py-2 text-xs md:text-xl">
        <p className="h-6 w-full rounded-md bg-gray-300"></p>
        <p className="mt-2 h-6 w-full rounded-md bg-gray-300"></p>
      </div>
    </div>
  );
}

export default function RemovalJobDetails({ job }) {
  const {
    data: jobDetails,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["jobDetails", job.removal_job.uid],
    queryFn: async () => {
      const response = await ApiKit.me.job.removal.getJob(
        job.removal_job.uid,
      );
      return response.data; // Assuming the response contains the job details in the 'data' field
    },
  });

  if (error) {
    return <div>Error fetching job details: {error.message}</div>;
  }
  return (
    <>
      <div className="bg-primary text-lg font-semibold text-black md:text-2xl lg:mt-2">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-2 px-4 md:h-20">
          <h3>Service Details</h3>
        </div>
      </div>

      <>
        {isLoading && <JobDetailsSkeleton />}

        {/* Display actual content when data is available */}
        {!isLoading && jobDetails && (
          <div className="mt-10">
            <div className="bg-primary px-5 py-2 text-base font-bold md:text-xl">
              <div>Service Detail</div>
            </div>
            <RemovalJobOverview job={jobDetails} isCustomer={true} />

            {/* Detail Fee Section */}
            <div className="mt-10">
              <div className="bg-primary px-5 py-2 text-base font-bold md:text-xl">
                <div>Detail Fee</div>
              </div>
              <div className="flex flex-col bg-primary-bg px-4 py-2">
                <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
                  <p>Job Title</p>
                  <p>{job.title}</p>
                </div>
                <hr />
                <hr />
                <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
                  <p>Quotation Validity</p>
                  <p>{job.quotation_validity} days</p>
                </div>
                <hr />
                <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
                  <p>Subtotal</p>
                  <p>{job.subtotal}</p>
                </div>
                <hr />
                <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
                  <p>Total VAT</p>
                  <p>{job.total_vat}</p>
                </div>
                <hr />
                <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
                  <p>Total Amount</p>
                  <p>{job.total_amount}</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-10 bg-primary-bg px-4 py-2 text-xs md:text-xl">
              <p className="font-semibold">Additional Information</p>
              <p>
                The content provided above serves as a reference for the removal
                of three bedrooms. Any duplication or unauthorized use of this
                content without explicit permission for the purpose of
                facilitating the removal of three bedrooms is strictly
                prohibited.
              </p>
            </div>
          </div>
        )}
      </>
    </>
  );
}
