"use client";

import ApiKit from "@/common/ApiKit";
import { useQuery } from "@tanstack/react-query";
import CleaningDetails from "./components/CleaningDetails";
import RemovalDetails from "./components/RemovalDetails";
import DeliveryDetails from "./components/DeliveryDetails";
import Loading from "@/components/shared/Loading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleChevronLeft, PencilLineIcon, Calendar, FileText, Briefcase, Clock } from "lucide-react";
import { format } from "date-fns";
import Container from "@/components/shared/Container";

export default function UserJobDetailsPage({ params }) {
  const category = params.slugs[0].split(/[-_]/)[0];
  const uid = params.slugs[1];

  // Helper function to get the correct job type for the URL
  const getJobUrlType = (category) => {
    switch (category) {
      case "cleaning":
        return "cleaning_job";
      case "removal":
        return "removal_job";
      case "delivery":
        return "delivery_job";
      default:
        return "cleaning_job"; // fallback, though this shouldn't happen
    }
  };

  const fetchDetails = (category) => {
    let fetchToApi;
    switch (category) {
      case "cleaning":
        return (fetchToApi = ApiKit.me.job.cleaning.getJob(uid));
      case "removal":
        return (fetchToApi = ApiKit.me.job.removal.getJob(uid));
      case "delivery":
        return (fetchToApi = ApiKit.me.job.delivery.getJob(uid));
      default:
        return null;
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: [category, uid],
    queryFn: () => fetchDetails(category).then(({ data }) => data),
  });


  if (isLoading) {
    return <Loading className="h-screen" />;
  }
  const jobID = data?.quotation?.uid;
  const jobKind = data?.quotation?.kind;
  console.log("jobKind", data?.item_description);
  const jobUrlType = getJobUrlType(category);
console.log(data,data)

  // Get status styling
  const getStatusStyling = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
          icon: "✓"
        };
      case "IN_PROGRESS":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
          icon: "⏳"
        };
      default:
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
          icon: "📋"
        };
    }
  };

  const statusStyle = getStatusStyling(data?.status);

  return (
    <div className="min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-80px)] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Premium Header with enhanced gradient */}
      <div className="bg-gradient-to-r from-green-900 via-emerald-900 to-teal-900 shadow-2xl relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #2d5016 0%, #49B74B 50%, #3a9c3d 100%)"
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-600/20"></div>
        <div className="relative mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-6 md:h-20">
          <Link href="/created-jobs" className="flex items-center group">
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-white hover:bg-white/10 transition-all duration-300 rounded-lg backdrop-blur-sm border border-white/20 hover:border-white/30"
            >
              <CircleChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform duration-300" />
            </Button>
            <div className="ml-3">
              <h3 className="text-white text-lg md:text-2xl font-bold truncate max-w-md">{data?.title}</h3>
              <p className="text-green-200 text-xs mt-0.5">Job Management Dashboard</p>
            </div>
          </Link>
          
          {(data?.status === "IN_PROGRESS" || data?.status === "COMPLETED") && (
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-full ${statusStyle.bg} ${statusStyle.border} border backdrop-blur-sm shadow-md`}>
                <p className={`${statusStyle.text} font-semibold text-xs flex items-center gap-2`}>
                  <span className="text-sm">{statusStyle.icon}</span>
                  {data?.status === "COMPLETED" ? "Job Completed" : "Job In Progress"}
                </p>
              </div>
              {jobID && (
                <Link
                  href={`/quotation/${jobKind}/${jobID}`}
                  className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border border-white/30 hover:from-white/30 hover:to-white/20 transition-all duration-300 flex items-center gap-2 rounded-lg px-4 py-2 text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <FileText size={16} />
                  View Details
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <Container className="py-6">
        {/* Enhanced Job Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {/* Job ID Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-full -mr-8 -mt-8 transition-transform duration-300 group-hover:scale-110"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md" style={{
                  background: "linear-gradient(135deg, #49B74B 0%, #3a9c3d 100%)"
                }}>
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Job ID</h3>
                  <p className="text-gray-500 text-xs">Unique Identifier</p>
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 mb-4">{data?.slug}</p>
              {data?.status !== "IN_PROGRESS" && data?.status !== "COMPLETED" && (
                <Link href={`/created-jobs/edit/${jobUrlType}/${data?.uid}`} className="block">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full flex items-center gap-2 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 border hover:border-green-300 rounded-lg py-2 font-medium hover:text-green-800 shadow-sm hover:shadow-md"
                    style={{
                      borderColor: "#49B74B",
                      color: "#3a9c3d"
                    }}
                  >
                    <PencilLineIcon size={14} />
                    Edit Job
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Job Type Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full -mr-8 -mt-8 transition-transform duration-300 group-hover:scale-110"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md" style={{
                  background: "linear-gradient(135deg, #10b981 0%, #49B74B 100%)"
                }}>
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Service Type</h3>
                  <p className="text-gray-500 text-xs">Category</p>
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 capitalize">{category} Service</p>
            </div>
          </div>

          {/* Execution Date Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 relative overflow-hidden group md:col-span-2 xl:col-span-1">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-50 rounded-full -mr-8 -mt-8 transition-transform duration-300 group-hover:scale-110"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md" style={{
                  background: "linear-gradient(135deg, #0d9488 0%, #49B74B 100%)"
                }}>
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Execution Date</h3>
                  <p className="text-gray-500 text-xs">Scheduled</p>
                </div>
              </div>
              <p className="text-xl font-black text-gray-900">
                {data?.moving_date
                  ? format(new Date(data.moving_date), "PPP")
                  : "Date not available"}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Job Description Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full -mr-12 -mt-12 transition-transform duration-300 group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md" style={{
                background: "linear-gradient(135deg, #49B74B 0%, #16a34a 100%)"
              }}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Job Description</h2>
                <p className="text-gray-500 text-sm">Detailed information about this job</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <p className="text-gray-700 leading-relaxed text-base font-medium">
                {data?.item_description || "No description provided"}
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Job Details Components with premium styling */}
      <div className="bg-gradient-to-b from-green-50 via-white to-emerald-50 border-t border-green-200">
        {category === "cleaning" && <CleaningDetails job={data} />}
        {category === "removal" && <RemovalDetails job={data} />}
        {category === "delivery" && <DeliveryDetails job={data} />}
      </div>
    </div>
  );
}