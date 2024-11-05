import ApiKit from "@/common/ApiKit";
import InfoIcon from "@/components/icon/InfoIcon";
import PhotosIcon from "@/components/icon/PhotosIcon";
import VideoIcon from "@/components/icon/VideoIcon";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CleanerJobOverview from "@/modules/cleaner/open-jobs/[slugs]/components/CleanerJobOverview";
import CleanerJobPhotos from "@/modules/cleaner/open-jobs/[slugs]/components/CleanerJobPhotos";
import CleanerJobVideos from "@/modules/cleaner/open-jobs/[slugs]/components/CleanerJobVideos";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CircleChevronLeft, PencilLineIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function CleaningDetails({ job }) {
  const [view, setView] = useState("overview");
  const router = useRouter();

  const { data: files } = useQuery({
    queryKey: [`job`, `files`, job?.uid, `cleaning`],
    queryFn: () =>
      ApiKit.me.job.cleaning
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
                router.push(`/review-jobs/edit/cleaning_job/${job.uid}`);
              }}
            >
              <PencilLineIcon />
              Edit Job
            </Button>
          </div>
          <h2 className="text-lg font-bold md:text-2xl">
            Job Kind: Cleaning Job
          </h2>

          <h2 className="w-fit bg-primary p-2 text-lg font-bold md:text-2xl">
            Job Execution Date: {format(job?.moving_date, "PPP")}
          </h2>

          <div>
            <h2 className="mt-4 text-lg font-bold md:text-2xl">
              Description of the job:
            </h2>
            <p className="text-sm md:text-lg">
              {job?.item_description || "No description provided"}
            </p>
          </div>
        </div>

        {/* Design changes need */}

        {/* <div className="mt-10 flex flex-wrap items-center justify-between gap-2 lg:gap-10">
          <div onClick={() => { setView("overview"); }} className={cn(
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
              className={`h-6 w-6 ${view === "overview" ? "fill-white" : "fill-secondary"
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
              className={`h-6 w-6 ${view === "photos" ? "fill-white" : "fill-secondary"
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
              className={`h-6 w-6 ${view === "videos" ? "fill-white" : "fill-secondary"
                }`}
            />
            Videos
          </div>
        </div> */}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-2 lg:gap-10">
          {/* <div
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
          </div> */}

          <div className="bg-[#FFF2DE] p-4 border-primary rounded-2xl border ">
            <InfoIcon
              className={`size-16 mx-auto mt-1 mb-4 text-secondary`}
            />

            <button
              onClick={() => {
                setView("overview");
              }}
              className={cn(
                "cursor-pointer rounded-full px-8 py-2 text-sm font-semibold max-sm:w-full sm:text-base md:text-lg",
                {
                  "bg- border-2 border-secondary bg-secondary text-white":
                    view === "overview",
                  "border-2 border-secondary bg-white text-secondary":
                    view !== "overview",
                },
              )}
            >
              Information
            </button>
          </div>

          <div className="bg-[#FFF2DE] p-4 border-primary rounded-2xl border ">
            <PhotosIcon
              className={`size-16 mx-auto mt-1 mb-4 text-secondary`}
            />
            <button
              onClick={() => {
                setView("photos");
              }}
              className={cn(
                "cursor-pointer rounded-full px-10 py-2 text-sm font-semibold max-sm:w-full sm:text-base md:text-lg",
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
          <div className="bg-[#FFF2DE] p-4 border-primary rounded-2xl border ">
            <VideoIcon
              className={`size-16 mx-auto mt-1 mb-4 text-secondary`}
            />
            <button
              onClick={() => {
                setView("videos");
              }}
              className={cn(
                "cursor-pointer rounded-full px-10 py-2 text-sm font-semibold max-sm:w-full sm:text-base md:text-lg",
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
            <CleanerJobOverview job={job} isCustomer={true} />
          )}
          {view === "videos" && <CleanerJobVideos videos={videos} />}
          {view === "photos" && <CleanerJobPhotos photos={photos} />}
        </div>
      </Container>
    </div>
  );
}
