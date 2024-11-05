import ApiKit from "@/common/ApiKit";
import InfoIcon from "@/components/icon/InfoIcon";
import PhotosIcon from "@/components/icon/PhotosIcon";
import VideoIcon from "@/components/icon/VideoIcon";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DeliveryOverview from "@/modules/driver/open-jobs/slug/components/delivery/Overview";
import DeliveryPhotos from "@/modules/driver/open-jobs/slug/components/delivery/Photos";
import DeliveryVideo from "@/modules/driver/open-jobs/slug/components/delivery/Video";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CircleChevronLeft, PencilLineIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <div className="min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-80px)]">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-2 lg:gap-10">
          <div
            onClick={() => {
              setView("overview");
            }}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-3 rounded-full px-10 py-2 text-sm font-semibold max-sm:w-full sm:text-base md:text-lg",
              {
                "bg- border-2 border-secondary bg-secondary text-white":
                  view === "overview",
                "border-2 border-secondary bg-white text-secondary":
                  view !== "overview",
              },
            )}
          >
            <InfoIcon
              className={`h-6 w-6 ${
                view === "overview" ? "fill-white" : "fill-secondary"
              }`}
            />
            Information
          </div>
          <div
            onClick={() => {
              setView("photos");
            }}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-3 rounded-full px-10 py-2 text-sm font-semibold max-sm:w-full sm:text-base md:text-lg",
              {
                "bg- border-2 border-secondary bg-secondary text-white":
                  view === "photos",
                "border-2 border-secondary bg-white text-secondary":
                  view !== "photos",
              },
            )}
          >
            <PhotosIcon
              className={`h-6 w-6 ${
                view === "photos" ? "fill-white" : "fill-secondary"
              }`}
            />
            Photos
          </div>
          <div
            onClick={() => {
              setView("videos");
            }}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-3 rounded-full px-10 py-2 text-sm font-semibold max-sm:w-full sm:text-base md:text-lg",
              {
                "bg- border-2 border-secondary bg-secondary text-white":
                  view === "videos",
                "border-2 border-secondary bg-white text-secondary":
                  view !== "videos",
              },
            )}
          >
            <VideoIcon
              className={`h-6 w-6 ${
                view === "videos" ? "fill-white" : "fill-secondary"
              }`}
            />
            Videos
          </div>
        </div>

        <div className="mt-5">
          {view === "overview" && (
            <DeliveryOverview job={job} isCustomer={true} />
          )}
          {view === "videos" && <DeliveryVideo videos={videos} />}
          {view === "photos" && <DeliveryPhotos photos={photos} />}
        </div>
      </Container>
    </div>
  );
}