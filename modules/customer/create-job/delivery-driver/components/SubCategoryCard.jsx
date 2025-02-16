import { cn, rgbDataURL } from "@/lib/utils";
import Image from "next/image";

export default function SubCategoryCard({ formik, category, setCurrentStep }) {
  const clearFormValues = () => {
    // Clear all form fields related to shipment details
    formik.setValues({
      ...formik.values,
      furniture: "",
      length: "",
      width: "",
      height: "",
      weight: "",
      quantity: "",
      measurement_unit: "",
      weight_unit: "",
      moving_date: "",
      dropoff: "",
      // Keep the following fields
      origin: formik.values.origin,
      destination: formik.values.destination,
      origin_coords: formik.values.origin_coords,
      destination_coords: formik.values.destination_coords,
      category_slug: formik.values.category_slug,
    });

    // Touch all fields and update validation schema
    const fieldsToValidate = [
      "furniture", "length", "width", "height", "weight", 
      "quantity", "measurement_unit", "weight_unit", 
      "moving_date", "dropoff"
    ];

    // Update validation schema if in edit mode
    if (window.getValidationSchema) {
      formik.setValidationSchema(window.getValidationSchema(category?.slug));
    }

    // Touch all fields immediately
    fieldsToValidate.forEach(field => {
      formik.setFieldTouched(field, true, true);
    });
    
    // Trigger validation
    setTimeout(() => formik.validateForm(), 0);

    // Clear media states
    if (window.setImagesState) window.setImagesState([]);
    if (window.setVideosState) window.setVideosState([]);
    if (window.setMediaErrorsState) window.setMediaErrorsState({ images: false });
  };

  const handleSubCategorySelect = () => {
    // If selecting a different subcategory, clear the form values
    if (formik.values.sub_category_slug !== category?.slug) {
      clearFormValues();
    }

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