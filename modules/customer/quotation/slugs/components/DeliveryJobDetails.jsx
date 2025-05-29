import { useQuery } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import DeliveryOverview from "../../components/DeliveryOverview";
import Container from "@/components/shared/Container";
import FeeDetails from "./FeeDetails";
import { Truck, Info } from "lucide-react";

// Skeleton Loader Component
function JobDetailsSkeleton() {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-xl border border-gray-100 animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
            <div className="h-6 w-48 rounded-lg bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="h-4 w-24 rounded bg-gray-200 mb-2"></div>
                <div className="h-6 w-32 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-2xl bg-white p-6 shadow-xl border border-gray-100 animate-pulse">
          <div className="h-6 w-48 rounded-lg bg-gray-200 mb-4"></div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-4 w-full rounded bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DeliveryJobDetails({ job }) {

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
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-50 min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-white border-l-4 border-red-500 p-6 shadow-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-red-800">Error Loading Service Details</h3>
                <p className="text-red-600 mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Calculate the total amount dynamically
  const calculateTotalAmount = (subtotal, extra, vatPercentage) => {
    const baseAmount = +subtotal + +extra;
    const vat = (baseAmount * +vatPercentage) / 100; // Calculate VAT as a percentage
    return baseAmount + vat; // Add VAT to the base amount
  };
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="w-full p-4">
        {/* Display Skeleton Loader when data is loading */}
        {isLoading && <JobDetailsSkeleton />}

        {/* Display actual content when data is available */}
        {!isLoading && jobDetails && (
          <div className="space-y-4 w-full">
            {/* Compact Enhanced Header Section */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center mb-3">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl shadow-lg mr-3"
                  style={{
                    background: "linear-gradient(135deg, #49B74B 0%, #3a9639 100%)",
                  }}
                >
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold" style={{
                    background: "linear-gradient(135deg, #49B74B 0%, #3a9639 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    Service Details
                  </h3>
                  <p className="text-gray-600 text-xs mt-0.5">Complete delivery service overview</p>
                </div>
              </div>
            </div>

            {/* Full Width Service Overview Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full hover:shadow-xl transition-all duration-300">
              <div
                className="px-6 py-3"
                style={{
                  backgroundColor: "#49B74B",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-white">Service Overview</h4>
                </div>
              </div>
              <div className="w-full">
                <DeliveryOverview job={jobDetails} isCustomer={true} />
              </div>
            </div>

            {/* Full Width Fee Details Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full hover:shadow-xl transition-all duration-300">
              <div
                className="px-6 py-3"
                style={{
                  backgroundColor: "#49B74B",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-white">Pricing Details</h4>
                </div>
              </div>
              <div className="p-6 w-full">
                <FeeDetails job={job} />
              </div>
            </div>

            {/* Full Width Additional Information Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full hover:shadow-xl transition-all duration-300">
              <div
                className="px-6 py-3"
                style={{
                  backgroundColor: "#49B74B",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Additional Information</h4>
                </div>
              </div>
              <div className="p-6 w-full">
                <div className="bg-gradient-to-r from-green-50 to-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    The content provided above serves as a reference for delivery services. Any duplication or unauthorized use of this content without explicit permission for the purpose of facilitating delivery services is strictly prohibited.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
