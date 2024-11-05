"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import Loading from "@/components/shared/Loading";
import Container from "@/components/shared/Container";
import DrivrIcon from "@/public/icon/driver-icon.png";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function UserJobTrack({ params }) {
  const searchParams = useSearchParams();

  return (
    <>
      <Container className="w-full">
        <div>
          <div className="flex flex-col justify-between bg-[#366935] p-6">
            <h1 className=" font-semibold text-white lg:text-3xl">
              Track you Job
            </h1>
          </div>
        </div>
        <div className="w-full">
          <h1 className="my-2  w-full  text-center text-2xl font-bold md:my-8 lg:text-left lg:text-4xl">
            Job Assigned to
          </h1>
        </div>

        <div className="flex w-full items-center justify-between pb-6"></div>
      </Container>
    </>
  );
}
