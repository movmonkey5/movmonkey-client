"use client";

import Image from "next/image";
import Delivery from "@/public/image/delivery.jpeg";
import Cleaning from "@/public/image/cleaning.jpeg";
import Removal from "@/public/image/removal.jpeg";
import QuoteButton from "./QuoteButton";
import Container from "@/components/shared/Container";

export default function Banner() {
  return (
    <Container>
      <div className="flex flex-col items-center bg-white lg:flex-row lg:justify-between lg:py-8">
        {/* Left Section: Text and Button */}
        <div className="flex flex-col items-center px-4 text-center lg:w-[40%] lg:items-start lg:px-0 lg:text-left">
          <h1 className="text-2xl font-bold leading-8 text-gray-800 md:w-[400px] md:!leading-[54px] lg:text-4xl">
            Connect with Removal, Delivery, and Cleaning Service Provider
          </h1>
          <div className=" mt-2 hidden md:block lg:mt-8">
            <QuoteButton className=" rounded-md bg-green-500  py-2 text-white " />
          </div>
        </div>

        {/* Right Section: Image Grid */}
        <div className="mt-8 grid w-[90%] grid-cols-2 gap-4 lg:mt-0 lg:w-[60%]">
          <div className="relative row-span-2 h-[250px] w-full md:h-full">
            <Image
              src={Delivery}
              alt="Delivery Service"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col items-center justify-center  gap-2 md:gap-4">
            <div className="relative h-[120px] w-full md:h-56">
              <Image
                src={Cleaning}
                alt="Cleaning Service"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>

            <div className="relative h-[120px] w-full md:h-56">
              <Image
                src={Removal}
                alt="Removal Service"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className=" my-8 block md:hidden">
          <QuoteButton className="mt-4 rounded-md bg-green-500  py-2 text-white lg:mt-8" />
        </div>
      </div>
    </Container>
  );
}
