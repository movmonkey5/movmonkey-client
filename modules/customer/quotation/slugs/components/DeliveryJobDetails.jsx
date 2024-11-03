import { useQuery } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import DeliveryOverview from "../../components/DeliveryOverview";
import Container from "@/components/shared/Container";

// Skeleton Loader Component
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

export default function DeliveryJobDetails({ job }) {
  // Fetch job details using the `useQuery` hook
  const {
    data: jobDetails,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["deliveryJobDetails", job.delivery_job.uid],
    queryFn: async () => {
      const response = await ApiKit.me.job.delivery.getJob(
        job.delivery_job.uid,
      );
      return response.data;
    },
  });

  // Handle error state
  if (error) {
    return <div>Error fetching job details: {error.message}</div>;
  }

  return (
    <div>
      <div className="bg-primary text-lg font-semibold text-black md:text-2xl lg:mt-2">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-2 md:h-20 md:px-4">
          <h3>Service Details</h3>
        </div>
      </div>

      {/* Display Skeleton Loader when data is loading */}
      {isLoading && <JobDetailsSkeleton />}

      {/* Display actual content when data is available */}
      {!isLoading && jobDetails && (
        <div className="mt-10">
          <DeliveryOverview job={jobDetails} isCustomer={true} />

          {/* Detail Fee Section */}
          <div className="mt-10">
            <div className="my-4 bg-primary px-5 py-2 text-base font-bold md:text-xl">
              <div>Detail Fee</div>
            </div>
            <div className="flex flex-col bg-primary-bg py-2 md:px-4">
              <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
                <p>Job Title</p>
                <p>{job.title}</p>
              </div>
              <hr />
              <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
                <p>Quotation Validity</p>
                <p>{job.quotation_validity} days</p>
              </div>
              <hr />
              <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
                <p>Subtotal</p>
                <p>£{job.subtotal}</p>
              </div>
              <hr />
              <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
                <p>Total VAT</p>
                <p>£{job.total_vat}</p>
              </div>
              <hr />
              <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
                <p>Total Amount</p>
                <p>£{job.total_amount}</p>
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
              facilitating the removal of three bedrooms is strictly prohibited.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
