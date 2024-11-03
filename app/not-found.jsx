"use client";

import { usePathname } from "next/navigation";

import Image from "next/image";
import notFound from "@/public/image/404.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Container from "@/components/shared/Container";

export default function NotFound() {
  const pathName = usePathname();

  return (
    <Container>
      <title>404 - Page Not Found</title>
      <div className="flex min-h-[calc(100vh-80px)] flex-col-reverse items-center justify-center gap-5 md:flex-row">
        <div className="w-full text-center md:w-1/2 md:text-left">
          <h1 className="mb-3 w-fit rounded-full bg-secondary/10 px-5 py-3 text-center font-medium text-secondary max-md:mx-auto">
            404 ERROR
          </h1>
          <h2 className="text-2xl font-semibold text-black md:text-4xl">
            Oops! Page not found.
          </h2>
          <p className="mb-9 text-xl text-gray-400">
            Sorry, we couldn’t find the page you were looking for.
          </p>

          <Link
            href={
              pathName.split("/").includes("cleaner")
                ? "/cleaner"
                : pathName.split("/").includes("driver")
                  ? "/driver"
                  : "/"
            }
            className="mt-5 block w-fit max-md:mx-auto"
          >
            <Button>Back to Home Page</Button>
          </Link>
        </div>
        <div className="w-full md:w-1/2">
          <Image src={notFound} alt="404" />
        </div>
      </div>
    </Container>
  );
}
