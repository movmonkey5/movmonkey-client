"use client";

import Container from "@/components/shared/Container";
import MapWrapper from "../components/MapWrapper";

export default function UserJobTrack({ params }) {
  const jobUid = params.slugs[1];
  const category = params.slugs[0].split("_")[0];

  return (
    <Container className="w-full">
      <div className="flex flex-col justify-between bg-[#366935] p-6">
        <h1 className="font-semibold text-white lg:text-3xl">
          Track Your Job
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h4 className="text-lxl my-8 text-center font-semibold">Job Route</h4>

        {/* Pass all distance data to MapWrapper */}
        <MapWrapper jobUid={jobUid} category={category}  />
      </div>
    </Container>
  );
}
