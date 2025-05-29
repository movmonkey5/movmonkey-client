import { useQuery } from "@tanstack/react-query";
import Container from "@/components/shared/Container";
import ApiKit from "@/common/ApiKit";
import CleanerJobOverview from "../../components/CleaningOverview";
import FeeDetails from "./FeeDetails";
import { Sparkles, Info } from "lucide-react";

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

export default function CleaningJobDetails({ job }) {

  const {
    data: jobDetails,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["jobDetails", job.cleaning_job.uid],
    queryFn: async () => {
      const response = await ApiKit.me.job.cleaning.getJob(
        job.cleaning_job.uid,
      );
      return response.data;
    },
  });

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

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-4">
        {isLoading && <JobDetailsSkeleton />}

        {!isLoading && jobDetails && (
          <div className="space-y-4">
            {/* Enhanced Header Section */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div
                  className="flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mr-4"
                  style={{
                    background: "linear-gradient(135deg, #49B74B 0%, #3a9639 100%)",
                  }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-3xl font-bold" style={{
                    background: "linear-gradient(135deg, #49B74B 0%, #3a9639 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    Service Details
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">Complete overview of your cleaning service</p>
                </div>
              </div>
              <div
                className="h-1 w-24 rounded-full mx-auto"
                style={{
                  background: "linear-gradient(135deg, #49B74B 0%, #3a9639 100%)",
                }}
              ></div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4">
              {/* Service Overview Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div
                  className="px-6 py-4"
                  style={{
                    background: "linear-gradient(135deg, #49B74B 0%, #3a9639 100%)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-white">Cleaning Service Overview</h4>
                  </div>
                </div>
                <div className="p-6">
                  <CleanerJobOverview job={jobDetails} isCustomer={true} />
                </div>
              </div>

              {/* Fee Details Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div
                  className="px-6 py-4"
                  style={{
                    background: "linear-gradient(135deg, #49B74B 0%, #3a9639 100%)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-white">Pricing Details</h4>
                  </div>
                </div>
                <div className="p-6">
                  <FeeDetails job={job} />
                </div>
              </div>

              {/* Enhanced Additional Information Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div
                  className="px-6 py-4"
                  style={{
                    background: "linear-gradient(135deg, #49B74B 0%, #3a9639 100%)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white">Additional Information</h4>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      The content provided above serves as a reference for cleaning services. Any duplication or unauthorized use of this content without explicit permission for the purpose of facilitating cleaning services is strictly prohibited.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
