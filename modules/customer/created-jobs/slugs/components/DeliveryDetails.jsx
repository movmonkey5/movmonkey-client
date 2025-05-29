import ApiKit from "@/common/ApiKit";
import InfoIcon from "@/components/icon/InfoIcon";
import PhotosIcon from "@/components/icon/PhotosIcon";
import VideoIcon from "@/components/icon/VideoIcon";
import Container from "@/components/shared/Container";
import { cn } from "@/lib/utils";
import DeliveryOverview from "@/modules/driver/open-jobs/slug/components/delivery/Overview";
import DeliveryVideo from "@/modules/driver/open-jobs/slug/components/delivery/Video";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import JobPhotos from "../../components/Photos";

export default function DeliveryDetails({ job }) {
  const [view, setView] = useState("overview");
  const router = useRouter();

  const { data: files } = useQuery({
    queryKey: [`job`, `files`, job?.uid, `delivery`],
    queryFn: () =>
      ApiKit.me.job.delivery
        .getFiles(job?.uid)
        .then(({ data }) => data?.results),
  });

  let videos;
  let photos;

  if (files?.length) {
    videos = files.filter((file) => file?.kind === "VIDEO");
    photos = files.filter((file) => file?.kind === "IMAGE");
  }

  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen">
      <Container className="py-6">
        {/* Compact Tab Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Info Tab */}
          <div
            className={`bg-white rounded-xl shadow-md border transition-all duration-300 cursor-pointer ${
              view === "overview"
                ? "border-green-300 shadow-lg ring-1 ring-green-200"
                : "border-gray-200 hover:border-green-200 hover:shadow-lg"
            }`}
            onClick={() => setView("overview")}
          >
            <div className="p-4">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-all duration-300`}
                  style={{
                    backgroundColor: view === "overview" ? "#49B74B" : "#6b7280",
                  }}
                >
                  <InfoIcon className="w-6 h-6 text-white" />
                </div>
                <h3
                  className={`text-base font-bold mb-1 ${
                    view === "overview" ? "text-green-700" : "text-gray-700"
                  }`}
                >
                  Job Information
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Service details & specifications
                </p>
                <div
                  className={`w-full py-2 px-4 rounded-lg font-medium text-xs transition-all duration-300`}
                  style={{
                    backgroundColor: view === "overview" ? "#49B74B" : "#f3f4f6",
                    color: view === "overview" ? "white" : "#6b7280",
                  }}
                >
                  {view === "overview" ? "Active" : "View"}
                </div>
              </div>
            </div>
          </div>

          {/* Photos Tab */}
          <div
            className={`bg-white rounded-xl shadow-md border transition-all duration-300 cursor-pointer ${
              view === "photos"
                ? "border-green-300 shadow-lg ring-1 ring-green-200"
                : "border-gray-200 hover:border-green-200 hover:shadow-lg"
            }`}
            onClick={() => setView("photos")}
          >
            <div className="p-4">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-all duration-300`}
                  style={{
                    backgroundColor: view === "photos" ? "#49B74B" : "#6b7280",
                  }}
                >
                  <PhotosIcon className="w-6 h-6 text-white" />
                </div>
                <h3
                  className={`text-base font-bold mb-1 ${
                    view === "photos" ? "text-green-700" : "text-gray-700"
                  }`}
                >
                  Photo Gallery
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Images & documentation
                </p>
                <div
                  className={`w-full py-2 px-4 rounded-lg font-medium text-xs transition-all duration-300`}
                  style={{
                    backgroundColor: view === "photos" ? "#49B74B" : "#f3f4f6",
                    color: view === "photos" ? "white" : "#6b7280",
                  }}
                >
                  {view === "photos" ? "Active" : "View"}
                </div>
              </div>
            </div>
          </div>

          {/* Videos Tab */}
          <div
            className={`bg-white rounded-xl shadow-md border transition-all duration-300 cursor-pointer ${
              view === "videos"
                ? "border-green-300 shadow-lg ring-1 ring-green-200"
                : "border-gray-200 hover:border-green-200 hover:shadow-lg"
            }`}
            onClick={() => setView("videos")}
          >
            <div className="p-4">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-all duration-300`}
                  style={{
                    backgroundColor: view === "videos" ? "#49B74B" : "#6b7280",
                  }}
                >
                  <VideoIcon className="w-6 h-6 text-white" />
                </div>
                <h3
                  className={`text-base font-bold mb-1 ${
                    view === "videos" ? "text-green-700" : "text-gray-700"
                  }`}
                >
                  Video Content
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Visual documentation
                </p>
                <div
                  className={`w-full py-2 px-4 rounded-lg font-medium text-xs transition-all duration-300`}
                  style={{
                    backgroundColor: view === "videos" ? "#49B74B" : "#f3f4f6",
                    color: view === "videos" ? "white" : "#6b7280",
                  }}
                >
                  {view === "videos" ? "Active" : "View"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Content Area */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full">
          {view === "overview" && (
            <DeliveryOverview job={job} isCustomer={true} />
          )}
          {view === "videos" && (
            <div className="p-6">
              <DeliveryVideo videos={videos} />
            </div>
          )}
          {view === "photos" && (
            <div className="p-6">
              <JobPhotos photos={photos} />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
