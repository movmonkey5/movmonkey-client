// import { cn, rgbDataURL } from "@/lib/utils";
// import Image from "next/image";

// export default function SubCategoryCard({ formik, category, setCurrentStep }) {
//   console.log(formik.values.sub_category_slug , "formik datta check");
//   return (
//     <div
//       onClick={() => {
//         formik.setFieldValue("sub_category_slug", category?.slug);
//         setCurrentStep(5);
//       }}
//       className={cn(
//         "h-fit max-w-sm cursor-pointer overflow-hidden rounded shadow-lg lg:m-4",
//         formik.values.sub_category_slug === category?.slug
//           ? "border-2 border-primary"
//           : "border-2 border-transparent",
//       )}
//     >
//       <div>
//         <Image
//           src={category?.image}
//           alt={category?.title}
//           quality={100}
//           width={500}
//           height={500}
//           priority
//           loading="eager"
//           placeholder="blur"
//           blurDataURL={rgbDataURL(255, 255, 255)}
//         />
//       </div>
//       <div
//         className={cn(
//           "px-6 py-4 text-center text-black",
//           formik.values.sub_category_slug === category?.slug
//             ? "bg-primary"
//             : "bg-gray-100",
//         )}
//       >
//         <div className="text-sm font-bold sm:text-sm lg:text-xl">
//           {category?.title}
//         </div>
//       </div>
//     </div>
//   );
// }
import { cn, rgbDataURL } from "@/lib/utils";
import Image from "next/image";

export default function SubCategoryCard({ formik, category, setCurrentStep }) {
  const handleSubCategorySelect = () => {
    // Set the sub_category_slug
    const newSlug = category?.slug || `household_items-household-items-${category?.title?.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`;
    formik.setFieldValue("sub_category_slug", newSlug);

    // Update the category array with the correct structure
    const categoryData = [{
      slug: newSlug,
      title: category?.title,
      description: category?.description || "",
      image: category?.image
    }];
    
    formik.setFieldValue("category", categoryData);
    setCurrentStep(5);
  };

  return (
    <div
      onClick={handleSubCategorySelect}
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