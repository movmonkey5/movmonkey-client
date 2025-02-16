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
      if (images.length === 0) {
        setMediaErrors({
          images: images.length === 0
        });
        toast.error("Please upload at least one image");
        return;
      }

      setLoading(true);

      const cleanValues = ({ category_slug, sub_category_slug, ...rest }) => {
        const filteredValues = { ...rest, category_slug: sub_category_slug };
        (keysToRemove[category_slug.split("-")[0]] || []).forEach((key) => {
          delete filteredValues[key];
        });
        return filteredValues;
      };

      const payload = {
        ...cleanValues(values),
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

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "images" || key === "videos") {
          value.forEach((file) => formData.append(key, file));
        } else {
          formData.append(
            key,
            typeof value === "object" && value !== null ? value.value : value,
          );
        }
      });

      const promise = ApiKit.me.job.delivery
        .postJob(formData)
        .then((response) => {
          const jobUid = response.data.uid;
          router.push(
            `/review-jobs/${response.data.kind.toLowerCase()}/${jobUid}`,
          );
        })
        .catch((error) => {
          console.log(error);
          throw error;
        })
        .finally(() => setLoading(false));

      toast.promise(promise, {
        loading: "Job is being submitted for preview, please wait...",
        success: "Your job has been submitted successfully!",
        error: (error) => {
          console.error("Error submitting job:", error);

          if (error?.response?.data) {
            if (typeof error.response.data === "string") {
              return error.response.data;
            }
            if (typeof error.response.data === "object") {
              const errorMessage =
                error.response.data.detail ||
                Object.values(error.response.data)[0]?.[0] ||
                "An unexpected error occurred";
              return errorMessage;
            }
          }

          return error.message || "Failed to submit job";
        },
      });
    },
  });
  console.log(formik.values);

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
