import { useQuery } from "@tanstack/react-query";
import Container from "@/components/shared/Container";
import ApiKit from "@/common/ApiKit";
import RemovalJobOverview from "../../components/RemovalOverview";
import FeeDetails from "./FeeDetails";

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
      const response = await ApiKit.me.job.removal.getJob(job.removal_job.uid);
      return response.data; // Assuming the response contains the job details in the 'data' field
    },
  });

  if (error) {
    return <div>Error fetching job details: {error.message}</div>;
  }

  return (
    <div className="w-full">
      {isLoading && <JobDetailsSkeleton />}

      {/* Display actual content when data is available */}
      {!isLoading && jobDetails && (
        <Container className="" extraClassName='px-0 py-0'>
          <div className="pt-4 pb-8 flex flex-col gap-2">
            <h3 className="text-xl md:text-2xl font-bold">Service Details</h3>
        
            <div className="h-1 md:h-1.5 w-16 md:w-20 bg-primary rounded-2xl"></div>
            <h4 className="text-lg md:text-xl text-primary font-semibold">
                  Removal Item Category: {jobDetails.category?.title}
                </h4>
          </div>

          <div className="flex flex-col gap-4 md:gap-8">
            <RemovalJobOverview job={jobDetails} isCustomer={true} />

            {/* Detail Fee Section */}
            <FeeDetails job={job} />
          </div>
          <div className="w-full bg-primary/10 rounded-lg shadow-md mt-4 md:mt-2">
          <h1 className="text-lg font-semibold rounded-t-lg bg-primary/60 p-4">Additional Information</h1>
          <p className="p-4 rounded-b-lg">
            The content provided above serves as a reference for removal services. Any duplication or unauthorized use of this content without explicit permission for the purpose of facilitating removal services is strictly prohibited.
          </p>
        </div>

          {/* Additional Information */}
        </Container>
      )}
    </div>
  );
}
