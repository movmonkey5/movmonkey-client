// import { cn, rgbDataURL } from "@/lib/utils";
// import Image from "next/image";

// export default function CategoryCard({
//   formik,
//   categories,
//   category,
//   setSubCategory,
//   setCurrentStep,
// }) {
//   return (
//     <div
//       onClick={() => {
//         formik.setFieldValue("category_slug", category?.slug);
//         setSubCategory(
//           categories.find((c) => c.slug === category?.slug)?.options || [],
//         );
//         setCurrentStep(4);
//       }}
//       className={cn(
//         "h-fit cursor-pointer overflow-hidden rounded shadow-lg lg:m-4",
//         formik.values.category_slug === category?.slug
//           ? "border-2 border-primary"
//           : "border-2 border-transparent",
//       )}
//     >
//       <div>
//         <Image
//           src={category?.image || "/images/placeholder.png"}
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
//           "px-2 py-4 text-center text-black lg:px-6",
//           formik.values.category_slug === category?.slug
//             ? "bg-primary"
//             : "bg-gray-100",
//         )}
//       >
//         <div className="text-sm font-bold sm:text-sm lg:text-xl">
//           {category?.title}
//         </div>
//         <p className="text-xs lg:text-base">{category?.description}</p>
//       </div>
//     </div>
//   );
// }
// import { cn, rgbDataURL } from "@/lib/utils";
// import Image from "next/image";

// export default function CategoryCard({
//   formik,
//   categories,
//   category,
//   setSubCategory,
//   setCurrentStep,
// }) {
//   // Check for both category and subcategory active states
//   const isCategoryActive = formik.values.category_slug === category?.slug;
//   const isSubCategoryActive = formik.values.sub_category_slug?.includes(category?.slug);
//   const isActive = isCategoryActive || isSubCategoryActive;

//   const handleCategorySelect = () => {
//     // Set both category and subcategory values
//     formik.setFieldValue("category_slug", category?.slug);
    
//     // If this category has a matching subcategory in the saved sub_category_slug, keep it
//     if (!formik.values.sub_category_slug?.includes(category?.slug)) {
//       formik.setFieldValue("sub_category_slug", null);
//     }
    
//     // Set subcategories for the next step
//     setSubCategory(
//       categories.find((c) => c.slug === category?.slug)?.options || [],
//     );
//     setCurrentStep(4);
//   };

//   return (
//     <div
//       onClick={handleCategorySelect}
//       className={cn(
//         "h-fit cursor-pointer overflow-hidden rounded shadow-lg lg:m-4",
//         isActive
//           ? "border-2 border-primary"
//           : "border-2 border-transparent",
//       )}
//     >
//       <div>
//         <Image
//           src={category?.image || "/images/placeholder.png"}
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
//           "px-2 py-4 text-center text-black lg:px-6",
//           isActive
//             ? "bg-primary"
//             : "bg-gray-100",
//         )}
//       >
//         <div className="text-sm font-bold sm:text-sm lg:text-xl">
//           {category?.title}
//         </div>
//         <p className="text-xs lg:text-base">{category?.description}</p>
//       </div>
//     </div>
//   );
// }


import { cn, rgbDataURL } from "@/lib/utils";
import Image from "next/image";

export default function CategoryCard({
  formik,
  categories,
  category,
  setSubCategory,
  setCurrentStep,
}) {
  const handleCategorySelect = () => {
    formik.setFieldValue("category_slug", category?.slug);
    setSubCategory(
      categories.find((c) => c.slug === category?.slug)?.options || [],
    );
    setCurrentStep(4);
  };

  // Check if this is the current category or part of the selected subcategory
  const isActive = 
    formik.values.category_slug === category?.slug || 
    formik.values.sub_category_slug?.startsWith(category?.slug);

  return (
    <div
      onClick={handleCategorySelect}
      className={cn(
        "h-fit cursor-pointer overflow-hidden rounded shadow-lg lg:m-4",
        formik.values.category_slug === category?.slug || formik.values.sub_category_slug?.startsWith(category?.slug)
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
          formik.values.category_slug === category?.slug || formik.values.sub_category_slug?.startsWith(category?.slug)
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


