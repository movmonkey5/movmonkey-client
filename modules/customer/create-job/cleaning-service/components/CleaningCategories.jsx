import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import ApiKit from "@/common/ApiKit";
import { cn, rgbDataURL } from "@/lib/utils";
import useScrollToTop from "@/lib/hooks/useScrollToTop";

import Container from "@/components/shared/Container";
import Loading from "@/components/shared/Loading";

export default function CleaningCategories({
  formik,
  setCurrentStep,
  moveBack,
}) {
  useScrollToTop();

  const { data: cleaningCategories, isLoading } = useQuery({
    queryKey: ["cleaning"],
    queryFn: () =>
      ApiKit.public.category.getCleaningServices().then(({ data }) => data),
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <div
          className={`mx-auto flex w-full max-w-7xl items-center gap-2 px-5`}
        >
          {moveBack ? moveBack : null}
          What type of cleaning are you looking for?
        </div>
      </div>

      <Container extraClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cleaningCategories?.results.map((category) => (
          <div
            key={category.slug}
            onClick={() => {
              setCurrentStep(2);
              formik.setFieldValue("category_slug", category.slug);
              formik.setFieldValue("category", category.slug);
            }}
            title={`Select ${category.title}`}
            className={cn(
              "h-fit cursor-pointer overflow-hidden rounded shadow-lg lg:m-4",
              formik.values.category_slug === category?.slug
                ? "border-2 border-primary"
                : "border-2 border-transparent",
            )}
          >
            <Image
              src={category?.image || "/images/placeholder.png"}
              alt={category?.title}
              quality={100}
              width={800}
              height={800}
              priority
              loading="eager"
              placeholder="blur"
              blurDataURL={rgbDataURL(255, 255, 255)}
            />
            <div
              className={cn(
                "px-2 py-4 text-center text-black lg:px-6",
                formik.values.category_slug === category?.slug
                  ? "bg-primary"
                  : "bg-gray-100",
              )}
            >
              <div className="text-sm font-bold sm:text-sm lg:text-xl">
                {category?.title}
              </div>
              <p className="text-xs lg:text-base">{category?.description}</p>
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
