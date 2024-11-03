import { cn, rgbDataURL } from "@/lib/utils";
import Image from "next/image";

export default function CategoryCard({
  formik,
  categories,
  category,
  setSubCategory,
  setCurrentStep,
}) {
  return (
    <div
      onClick={() => {
        formik.setFieldValue("category_slug", category?.slug);
        setSubCategory(
          categories.find((c) => c.slug === category?.slug)?.options || [],
        );
        setCurrentStep(4);
      }}
      className={cn(
        "h-fit cursor-pointer overflow-hidden rounded shadow-lg lg:m-4",
        formik.values.category_slug === category?.slug
          ? "border-2 border-primary"
          : "border-2 border-transparent",
      )}
    >
      <div>
        <Image
          src={category?.image || "/images/placeholder.png"}
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
  );
}
