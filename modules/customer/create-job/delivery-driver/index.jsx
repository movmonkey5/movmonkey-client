"use client";

import * as Yup from "yup";
import { useState } from "react";

import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import ApiKit from "@/common/ApiKit";
import { dateFormatter } from "@/lib/utils";
import { initialValues } from "./components/schema/initialValues";
import { keysToRemove } from "@/lib/keyChain";
import { useRouter } from "next/navigation";

import DeliveryCategory from "./components/DeliveryCategory";
import DeliverySubCategory from "./components/DeliverySubCategory";
import FindDistance from "./components/FindDistance";
import FreightShipment from "./components/FreightShipment";
import FurnitureShipment from "./components/FurnitureShipment";
import ItemDeliveryInfo from "./components/ItemDeliveryInfo";
import Loading from "@/components/shared/Loading";
import MediaInfoSection from "./components/MediaInfoSection";
import VehicleShipment from "./components/VehicleShipment";
import AnimalShipment from "./components/AnimalShipment";
import {
  generalValidationSchema,
  validationSchemaForAnimals,
  validationSchemaForFreight,
  validationSchemaForHouseholdItems,
  validationSchemaForVehicleAndHeavyEquipment,
} from "./components/schema/validation";

const getValidationSchema = (category) => {
  let specificSchema;

  switch (category) {
    case "vehicles-vehicles":
      specificSchema = validationSchemaForVehicleAndHeavyEquipment;
      break;
    case "heavy_equipment-heavy-equipment":
      specificSchema = validationSchemaForVehicleAndHeavyEquipment;
      break;
    case "household_items-household-items":
      specificSchema = validationSchemaForHouseholdItems;
      break;
    case "freight-freight":
      specificSchema = validationSchemaForFreight;
      break;
    case "animals-animals":
      specificSchema = validationSchemaForAnimals;
      break;
    default:
      specificSchema = Yup.object();
  }

  if (!specificSchema) {
    specificSchema = Yup.object();
  }

  return generalValidationSchema.concat(specificSchema);
};

let validationSchema;

const DeliveryDeriverPage = () => {
  const [mediaErrors, setMediaErrors] = useState({
    images: false,

  });
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Make setState functions globally available
  window.setImagesState = setImages;
  window.setVideosState = setVideos;
  window.setMediaErrorsState = setMediaErrors;

  const { data, isLoading } = useQuery({
    queryKey: ["categories", "delivery"],
    queryFn: () =>
      ApiKit.public.category.getDelivery().then(({ data }) => {
        setCategories(data?.results);
        return data?.results;
      }),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("=== FORM SUBMISSION STARTED ===");
      console.log("Form values on submit:", values);
      console.log("Delivery items:", values.delivery_items);
      console.log("Images:", images);
      console.log("Videos:", videos);

      if (images.length === 0) {
        console.log("No images uploaded, showing error");
        setMediaErrors({
          images: images.length === 0
        });
        toast.error("Please upload at least one image");
        return;
      }

      console.log("Images validation passed, processing submission...");
      setLoading(true);

      console.log("🚨 BEFORE CLEANING - Raw form values:", values);
      console.log("🚨 BEFORE CLEANING - delivery_items:", values.delivery_items);

      const cleanValues = ({ category_slug, sub_category_slug, delivery_items, ...rest }) => {
        console.log("🔧 === CLEANING VALUES START ===");
        console.log("🔧 Original delivery_items:", delivery_items);
        
        // Clean up delivery items - only include fields with actual values and relevant to the category
        const categoryEntity = category_slug.split("-")[0];
        console.log("🔧 Category entity:", categoryEntity);
        
        const cleanedDeliveryItems = delivery_items?.map((item, index) => {
          console.log(`🔧 Cleaning item ${index}:`, item);
          
          const cleanedItem = {};
          
          // Define which fields are relevant for each category
          const relevantFields = {
            vehicles: ['vehicle_year', 'vehicle_brand', 'vehicle_model', 'vehicle_type', 'service_type'],
            household_items: ['furniture', 'length', 'width', 'height', 'measurement_unit', 'weight', 'weight_unit', 'quantity'],
            freight: ['handling_unit', 'length', 'width', 'height', 'measurement_unit', 'weight', 'weight_unit', 'quantity', 'is_stackable', 'is_hazardous'],
            animals: ['animal_type', 'identification_mark', 'animal_name', 'animal_breed', 'weight', 'weight_unit', 'is_vaccinated', 'in_kennel_carrier', 'specific_need', 'specific_need_detail'],
            heavy_equipment: ['vehicle_year', 'vehicle_brand', 'vehicle_model', 'vehicle_type', 'service_type']
          };
          
          const fieldsToInclude = relevantFields[categoryEntity] || [];
          console.log(`🔧 Relevant fields for ${categoryEntity}:`, fieldsToInclude);
          
          // Only include relevant fields that have actual values
          fieldsToInclude.forEach(field => {
            const value = item[field];
            console.log(`🔧 Checking field ${field}: value = "${value}", type = ${typeof value}`);
            if (value !== null && value !== undefined && value !== '' && value !== 'null' && value !== 0) {
              cleanedItem[field] = value;
              console.log(`🔧 ✅ Included ${field}: ${value}`);
            } else {
              console.log(`🔧 ❌ Excluded ${field}: ${value} (was null/empty)`);
            }
          });
          
          // Special case: include weight if it's a number (even if 0)
          if (typeof item.weight === 'number' || (typeof item.weight === 'string' && !isNaN(item.weight) && item.weight !== '')) {
            if (fieldsToInclude.includes('weight')) {
              cleanedItem.weight = item.weight;
              console.log(`🔧 ✅ Special case - included weight: ${item.weight}`);
            }
          }
          
          console.log(`🔧 Cleaned item ${index} result:`, cleanedItem);
          return cleanedItem;
        }) || [];

        const filteredValues = { 
          ...rest, 
          category_slug: sub_category_slug,
          delivery_items_data: cleanedDeliveryItems
        };
        
        console.log("🔧 Final cleaned delivery_items_data:", cleanedDeliveryItems);
        
        // 🚨 CRITICAL: Remove ALL root-level category-specific fields to prevent null values from being sent
        const allCategoryFields = [
          // Vehicle fields
          'vehicle_year', 'vehicle_brand', 'vehicle_model', 'vehicle_type', 'service_type',
          // Household items fields  
          'furniture', 'length', 'width', 'height', 'measurement_unit', 'weight', 'weight_unit', 'quantity',
          // Freight fields
          'handling_unit', 'is_stackable', 'is_hazardous',
          // Animal fields
          'animal_type', 'identification_mark', 'animal_name', 'animal_breed', 'is_vaccinated', 'in_kennel_carrier', 'specific_need', 'specific_need_detail'
        ];
        
        console.log("🔧 Removing root-level category fields to prevent null values...");
        allCategoryFields.forEach(field => {
          if (field in filteredValues) {
            console.log(`🔧 ❌ Removing root-level field: ${field} = ${filteredValues[field]}`);
            delete filteredValues[field];
          }
        });
        
        console.log("🔧 === CLEANING VALUES END ===");
        
        // Also apply the existing keysToRemove logic
        (keysToRemove[category_slug.split("-")[0]] || []).forEach((key) => {
          console.log(`🔧 ❌ Removing via keysToRemove: ${key}`);
          delete filteredValues[key];
        });
        
        return filteredValues;
      };

      console.log("🚨 CALLING CLEAN VALUES NOW...");
      const cleanedValues = cleanValues(values);
      console.log("🚨 CLEANED VALUES RESULT:", cleanedValues);
      console.log("🚨 CLEANED delivery_items_data:", cleanedValues.delivery_items_data);

      const payload = {
        ...cleanedValues,
        moving_date: values.moving_date
          ? dateFormatter(values.moving_date)
          : "",
        dropoff: values.dropoff ? dateFormatter(values.dropoff) : "",
        images,
        videos,
        origin_coords: values.origin_coords
          ? values.origin_coords.join(",")
          : "", // Convert to comma-separated string
        destination_coords: values.destination_coords
          ? values.destination_coords.join(",")
          : "", // Convert to comma-separated string
      };

      console.log("Final payload:", payload);
      console.log("Payload delivery_items_data:", payload.delivery_items_data);

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "images" || key === "videos") {
          value.forEach((file) => formData.append(key, file));
          console.log(`Added ${value.length} ${key} files to FormData`);
        } else if (key === "delivery_items_data") {
          // Convert delivery items array to JSON string for FormData
          const jsonString = JSON.stringify(value);
          console.log("=== DELIVERY ITEMS DATA FOR BACKEND ===");
          console.log("Raw value:", value);
          console.log("JSON string being sent:", jsonString);
          console.log("=== END DELIVERY ITEMS DATA ===");
          formData.append(key, jsonString);
        } else {
          const finalValue = typeof value === "object" && value !== null ? value.value : value;
          console.log(`Adding to FormData - ${key}:`, finalValue);
          formData.append(key, finalValue);
        }
      });

      // Log all FormData entries for debugging
      console.log("=== COMPLETE FORMDATA BEING SENT ===");
      for (let [key, value] of formData.entries()) {
        if (key === "delivery_items_data") {
          console.log(`FormData ${key}:`, value);
          console.log(`Parsed back:`, JSON.parse(value));
        } else if (key !== "images" && key !== "videos") {
          console.log(`FormData ${key}:`, value);
        }
      }
      console.log("=== END FORMDATA ===");

      console.log("FormData prepared, making API request...");

      const promise = ApiKit.me.job.delivery
        .postJob(formData)
        .then((response) => {
          console.log("API response received:", response);
          const jobUid = response.data.uid;
          router.push(
            `/review-jobs/${response.data.kind.toLowerCase()}/${jobUid}`,
          );
        })
        .catch((error) => {
          console.error("=== API ERROR OCCURRED ===");
          console.error("Error object:", error);
          console.error("Error response:", error?.response);
          console.error("Error response data:", error?.response?.data);
          console.error("Error status:", error?.response?.status);
          throw error;
        })
        .finally(() => {
          console.log("API request completed, setting loading to false");
          setLoading(false);
        });

      toast.promise(promise, {
        loading: "Job is being submitted for preview, please wait...",
        success: "Your job has been submitted successfully!",
        error: (error) => {
          console.error("Toast error handler - Error submitting job:", error);

          if (error?.response?.data) {
            console.error("Error response data found:", error.response.data);
            if (typeof error.response.data === "string") {
              return error.response.data;
            }
            if (typeof error.response.data === "object") {
              const errorMessage =
                error.response.data.detail ||
                Object.values(error.response.data)[0]?.[0] ||
                "An unexpected error occurred";
              console.error("Extracted error message:", errorMessage);
              return errorMessage;
            }
          }

          console.error("Using fallback error message");
          return error.message || "Failed to submit job";
        },
      });
    },
  });
  console.log("formik values:", formik.values);
  console.log("delivery_items detailed:", formik.values.delivery_items);
  console.log("delivery_items[0]:", formik.values.delivery_items?.[0]);

  validationSchema = getValidationSchema(formik.values.category_slug);

  if (isLoading) return <Loading className="h-screen" />;

  const stepComponents = {
    1: <FindDistance formik={formik} setCurrentStep={setCurrentStep} />,
    2: <ItemDeliveryInfo formik={formik} setCurrentStep={setCurrentStep} />,
    3: (
      <DeliveryCategory
        formik={formik}
        setCurrentStep={setCurrentStep}
        categories={categories}
        setSubCategory={setSubCategory}
      />
    ),
    4: (
      <DeliverySubCategory
        formik={formik}
        subCategory={subCategory}
        setCurrentStep={setCurrentStep}
      />
    ),
    5: {
      vehicles: (
        <VehicleShipment formik={formik} setCurrentStep={setCurrentStep} />
      ),
      household_items: (
        <FurnitureShipment formik={formik} setCurrentStep={setCurrentStep} />
      ),
      freight: (
        <FreightShipment formik={formik} setCurrentStep={setCurrentStep} />
      ),
      heavy_equipment: (
        <VehicleShipment formik={formik} setCurrentStep={setCurrentStep} />
      ),
    }[formik.values.category_slug.split("-")[0]],
    6: (
      <MediaInfoSection
        formik={formik}
        setCurrentStep={setCurrentStep}
        images={images}
        setImages={setImages}
        videos={videos}
        setVideos={setVideos}
        loading={loading}
        mediaErrors={mediaErrors}
        setMediaErrors={setMediaErrors}
      />
    ),
  };

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <form onSubmit={formik.handleSubmit}>{stepComponents[currentStep]}</form>
    </div>
  );
};

export default DeliveryDeriverPage;
