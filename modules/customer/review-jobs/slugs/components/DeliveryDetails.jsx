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
      <div className="bg-primary text-lg font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-2 px-4 md:h-20">
          <Link href="/created-jobs">
            <Button size="icon" variant="ghost">
              <CircleChevronLeft size={24} />
            </Button> 
          </Link>
          <h3>{job?.title}</h3>
        </div>
      </div>

      <Container>
        <div className="space-y-3">
          <div className="flex gap-2 text-lg font-bold max-sm:flex-col-reverse sm:items-center sm:justify-between md:text-2xl">
            <span>Job Id: {job?.slug}</span>
            <Button
              variant="secondary"
              className="flex gap-1 text-base"
              onClick={() => {
                router.push(`/review-jobs/edit/delivery_job/${job.uid}`);
              }}
            >
              <PencilLineIcon />
              Edit Job
            </Button>
          </div>
          <h2 className="text-lg font-bold md:text-2xl">
            Job Kind: Delivery Job
          </h2>

          <h2 className="w-fit bg-primary p-2 text-lg font-bold md:text-2xl">
            Job Execution Date: {format(job?.moving_date, "PPP")}
          </h2>

          <div>
            <h2 className="mt-4 text-lg font-bold md:text-2xl">
              Description of the job:
            </h2>
            <p className="text-sm md:text-lg">
              {job?.description || "No description provided"}
            </p>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-3 place-items-center w-full gap-3 sm:gap-5 md:gap-10 p-1 sm:p-5">
    
    <div className="bg-[#FFF2DE] px-1.5 py-2 md:p-4 border-primary rounded-2xl border flex flex-col items-center justify-center w-full sm:w-48 md:w-60 ">
      <InfoIcon
        className={`size-10 md:size-16 mx-auto mt-1 mb-4 text-secondary`}
      />

      <button
        onClick={() => {
          setView("overview");
        }}
        className={cn(
          "cursor-pointer rounded-full px-2 md:px-8 py-1 md:py-2 text-sm sm:font-semibold sm:text-base md:text-lg w-full",
          {
            "bg- border-2 border-secondary bg-secondary text-white":
              view === "overview",
            "border-2 border-secondary bg-white text-secondary":
              view !== "overview",
          },
        )}
      >
        Info
      </button>
    </div>

    <div className="bg-[#FFF2DE] px-1.5 py-2 md:p-4 border-primary rounded-2xl border w-full sm:w-48 md:w-60 ">
      <PhotosIcon
        className={`size-10 md:size-16 mx-auto mt-1 mb-4 text-secondary`}
      />
      <button
        onClick={() => {
          setView("photos");
        }}
        className={cn(
          "cursor-pointer rounded-full px-2 py-1 md:px-10 md:py-2 text-sm font-semibold w-full sm:text-base md:text-lg",
          {
            "bg- border-2 border-secondary bg-secondary text-white":
              view === "photos",
            "border-2 border-secondary bg-white text-secondary":
              view !== "photos",
          },
        )}
      >
        Photos
      </button>
    </div>
    <div className="bg-[#FFF2DE] px-1.5 py-2 md:p-4 border-primary rounded-2xl border w-full sm:w-48 md:w-60 ">
      <VideoIcon
        className={`size-10 md:size-16 mx-auto mt-1 mb-4 text-secondary`}
      />
      <button
        onClick={() => {
          setView("videos");
        }}
        className={cn(
          "cursor-pointer rounded-full px-2 py-1 md:px-10 md:py-2 text-sm font-semibold w-full sm:text-base md:text-lg",
          {
            "bg- border-2 border-secondary bg-secondary text-white":
              view === "videos",
            "border-2 border-secondary bg-white text-secondary":
              view !== "videos",
          },
        )}
      >
        Videos
      </button>
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
