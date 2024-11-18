"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import Loading from "@/components/shared/Loading";
import Container from "@/components/shared/Container";
import DrivrIcon from "@/public/icon/driver-icon.png";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import MapWrapper from "../components/MapWrapper";

export default function UserJobTrack({ params }) {
  console.log(params);
  const searchParams = useSearchParams();
  const jobUid = params.slugs[1];
  const category = params.slugs[0].split("_")[0];

  const {
    data: distance,
    isLoading: distanceLoading,
    error: distanceError,
  } = useQuery({
    queryKey: ["distance", jobUid, category],
    queryFn: () =>
      jobUid &&
      category &&
      ApiKit.me.job.distance
        .getDistance(jobUid, category)
        .then(({ data }) => data),
    enabled: !!jobUid && !!category,
  });

  if (distanceLoading) return <Loading />;
  if (distanceError) return <div>Error loading distance data</div>;

  return (
    <>
      <Container className="w-full">
        <div>
          <div className="flex flex-col justify-between bg-[#366935] p-6">
            <h1 className="font-semibold text-white lg:text-3xl">
              Track Your Job
            </h1>
          </div>
        </div>
        <div className="w-full">
          {/* <h1 className="my-2  w-full  text-center text-2xl font-bold md:my-8 lg:text-left lg:text-4xl">
            Job Assigned to
          </h1> */}
        </div>
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-lxl my-8 text-center font-semibold">Job Route</h4>
          <MapWrapper coords={distance} /> {/* Pass distance as prop */}
        </div>

        <div className="flex w-full items-center justify-between pb-6"></div>
      </Container>
    </>
  );
}
