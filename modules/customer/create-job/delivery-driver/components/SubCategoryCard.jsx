import { cn, rgbDataURL } from "@/lib/utils";
import Image from "next/image";

export default function SubCategoryCard({ formik, category, setCurrentStep }) {
  return (
    <div
      onClick={() => {
        formik.setFieldValue("sub_category_slug", category?.slug);
        setCurrentStep(5);
      }}
      className={cn(
        "h-fit max-w-sm cursor-pointer overflow-hidden rounded shadow-lg lg:m-4",
        formik.values.sub_category_slug === category?.slug
          ? "border-2 border-primary"
          : "border-2 border-transparent",
      )}
    >
      <div>
        <Image
          src={category?.image}
          alt={category?.title}
          quality={100}
          width={500}
          height={500}
          priority
          loading="eager"
          placeholder="blur"
          blurDataURL={rgbDataURL(255, 255, 255)}
        />
      </div>
      <div
        className={cn(
          "px-6 py-4 text-center text-black",
          formik.values.sub_category_slug === category?.slug
            ? "bg-primary"
            : "bg-gray-100",
        )}
      >
        <div className="text-sm font-bold sm:text-sm lg:text-xl">
          {category?.title}
        </div>
      </div>
    </div>
  );
}
