/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname, useRouter } from "next/navigation";
import ApiKit from "@/common/ApiKit";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";
import FindDistance from "@/modules/customer/create-job/delivery-driver/components/FindDistance";
import { initialValues } from "@/modules/customer/create-job/delivery-driver/components/schema/initialValues";
import ItemDeliveryInfo from "@/modules/customer/create-job/delivery-driver/components/ItemDeliveryInfo";
import DeliveryCategory from "@/modules/customer/create-job/delivery-driver/components/DeliveryCategory";
import DeliverySubCategory from "@/modules/customer/create-job/delivery-driver/components/DeliverySubCategory";
import VehicleShipment from "@/modules/customer/create-job/delivery-driver/components/VehicleShipment";
import FurnitureShipment from "@/modules/customer/create-job/delivery-driver/components/FurnitureShipment";
import FreightShipment from "@/modules/customer/create-job/delivery-driver/components/FreightShipment";
import AnimalShipment from "@/modules/customer/create-job/delivery-driver/components/AnimalShipment";
import MediaInfoSection from "@/modules/customer/create-job/delivery-driver/components/MediaInfoSection";
import { toast } from "sonner";
import { dateFormatter } from "@/lib/utils";
import { format } from "date-fns";

export default function DeliveryJobEdit() {
  const [currentStep, setCurrentStep] = useState(1);
  const pathName = usePathname();
  const [_, uid] = useParams().slugs;
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  const { _data } = useQuery({
    queryKey: ["categories", "delivery"],
    queryFn: () =>
      ApiKit.public.category.getDelivery().then(({ data }) => {
        setCategories(data?.results);
        console.log(data?.results,"data result");
        return data?.results;
      }),
  });

  const { data: files } = useQuery({
    queryKey: [`job`, `files`, uid, `delivery`],
    queryFn: () =>
      ApiKit.me.job.delivery.getFiles(uid).then(({ data }) => data?.results),
    enabled: !!uid,
  });

  const { data: deliveryJobDetails, isLoading: isDeliveryJobLoading } = useQuery({
    queryKey: [`delivery_job/${uid}`],
    queryFn: () => ApiKit.me.job.delivery.getJob(uid).then(({ data }) => data),
  });

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      setLoading(true);
      
      // Update category_slug to match sub_category_slug
      const updatedValues = {
        ...values,
        category_slug: values.sub_category_slug
      };

      const formData = new FormData();

      // Handle regular form fields
      Object.entries(updatedValues).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'images' && key !== 'videos') {
          if (key === 'moving_date' || key === 'dropoff') {
            formData.append(key, value ? dateFormatter(value) : '');
          } else if (typeof value === 'object') {
            formData.append(key, value.value || value);
          } else {
            formData.append(key, value);
          }
        }
      });

      // Handle images
      if (images?.length) {
        images.forEach(image => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      }

      // Handle videos
      if (videos?.length) {
        videos.forEach(video => {
          if (video instanceof File) {
            formData.append('videos', video);
          }
        });
      }

      const promise = ApiKit.me.job.delivery
        .updateJob(uid, formData)
        .then(() => router.push(pathName.replace("/edit", "")))
        .catch((error) => {
          console.log(error);
          throw error;
        })
        .finally(() => setLoading(false));

      toast.promise(promise, {
        loading: "Job is being updated, please wait...",
        success: "Your job has been updated successfully!",
        error: (error) => {
          const errorKeys = Object.keys(error?.response?.data);
          return (
            error.response.data?.detail ||
            error.response?.data[errorKeys[0]][0] ||
            "Failed to update job"
          );
        },
      });
    },
  });

  const setFormikInitialValue = (field, value) => {
    formik.setFieldValue(field, value);
  };

  useEffect(() => {
    if (deliveryJobDetails) {
      setFormikInitialValue("title", deliveryJobDetails.title);
      setFormikInitialValue(
        "moving_from",
        deliveryJobDetails.distance.moving_from,
      );
      setFormikInitialValue("moving_to", deliveryJobDetails.distance.moving_to);
      setFormikInitialValue(
        "total_distance",
        deliveryJobDetails.distance.total_distance,
      );
      setFormikInitialValue("unit", deliveryJobDetails.distance.unit);
      setFormikInitialValue(
        "have_parking_space",
        !!deliveryJobDetails.have_parking_space,
      );
      setFormikInitialValue(
        "is_parking_ulez_congestion_charges",
        !!deliveryJobDetails.is_parking_ulez_congestion_charges,
      );
      setFormikInitialValue(
        "is_included_all_charges",
        !!deliveryJobDetails.is_included_all_charges,
      );
      setFormikInitialValue(
        "is_individual",
        !!deliveryJobDetails.is_individual,
      );
      setFormikInitialValue("is_company", !!deliveryJobDetails.is_company);
      setFormikInitialValue("man_count", deliveryJobDetails.man_count);
      setFormikInitialValue(
        "category_slug",
        deliveryJobDetails.category[0].slug.split("-")[0],
      );
      setFormikInitialValue(
        "sub_category_slug",
        deliveryJobDetails.category[0].slug,
      );
      setFormikInitialValue(
        "vehicle_year",
        deliveryJobDetails.delivery_items[0].vehicle_year,
      );
      setFormikInitialValue(
        "vehicle_brand",
        deliveryJobDetails.delivery_items[0].vehicle_brand,
      );
      setFormikInitialValue(
        "vehicle_model",
        deliveryJobDetails.delivery_items[0].vehicle_model,
      );
      setFormikInitialValue(
        "vehicle_type",
        deliveryJobDetails.delivery_items[0].vehicle_type,
      );
      setFormikInitialValue("moving_date", deliveryJobDetails.moving_date);
      setFormikInitialValue(
        "dropoff",
        format(new Date(deliveryJobDetails.dropoff), "P").split("/").join("-"),
      );
      setFormikInitialValue(
        "service_type",
        deliveryJobDetails.delivery_items[0].service_type,
      );
      setFormikInitialValue("item_description", deliveryJobDetails.description);
      setFormikInitialValue("any_more_move", deliveryJobDetails.any_more_move);
      setFormikInitialValue(
        "furniture",
        deliveryJobDetails.delivery_items[0].furniture,
      );
      setFormikInitialValue(
        "length",
        deliveryJobDetails.delivery_items[0].length,
      );
      setFormikInitialValue(
        "width",
        deliveryJobDetails.delivery_items[0].width,
      );
      setFormikInitialValue(
        "height",
        deliveryJobDetails.delivery_items[0].height,
      );
      setFormikInitialValue(
        "measurement_unit",
        deliveryJobDetails.delivery_items[0].measurement_unit,
      );
      setFormikInitialValue(
        "weight",
        deliveryJobDetails.delivery_items[0].weight,
      );
      setFormikInitialValue(
        "weight_unit",
        deliveryJobDetails.delivery_items[0].weight_unit,
      );
      setFormikInitialValue(
        "quantity",
        deliveryJobDetails.delivery_items[0].quantity,
      );
      setFormikInitialValue(
        "handling_unit",
        deliveryJobDetails.delivery_items[0].handling_unit,
      );
      setFormikInitialValue(
        "is_hazardous",
        !!deliveryJobDetails.delivery_items[0].is_hazardous,
      );
      setFormikInitialValue(
        "is_stackable",
        !!deliveryJobDetails.delivery_items[0].is_stackable,
      );
      setFormikInitialValue(
        "animal_type",
        deliveryJobDetails.delivery_items[0].animal_type,
      );
      setFormikInitialValue(
        "animal_name",
        deliveryJobDetails.delivery_items[0].animal_name,
      );
      setFormikInitialValue(
        "animal_breed",
        deliveryJobDetails.delivery_items[0].animal_breed,
      );
      setFormikInitialValue(
        "identification_mark",
        deliveryJobDetails.delivery_items[0].identification_mark,
      );
      setFormikInitialValue(
        "is_vaccinated",
        !!deliveryJobDetails.delivery_items[0].is_vaccinated,
      );
      setFormikInitialValue(
        "in_kennel_carrier",
        deliveryJobDetails.delivery_items[0].in_kennel_carrier,
      );
      setFormikInitialValue(
        "specific_need",
        deliveryJobDetails.delivery_items[0].specific_need,
      );
      setFormikInitialValue("status", deliveryJobDetails.status);
    }
  }, [deliveryJobDetails]);

  useEffect(() => {
    if (files?.length) {
      const videoFiles = files.filter((file) => file?.kind === "VIDEO");
      const imageFiles = files.filter((file) => file?.kind === "IMAGE");

      // Only set initial files if images/videos state is empty
      if (images.length === 0) {
        setImages(imageFiles);
      }
      if (videos.length === 0) {
        setVideos(videoFiles);
      }
    }
  }, [files]);

  if (isDeliveryJobLoading) {
    return <Loading className="min-h-[calc(100vh-80px)]" />;
  }

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
      animals: (
        <AnimalShipment formik={formik} setCurrentStep={setCurrentStep} />
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
        jobUid={uid}
      />
    ),
  };

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <form onSubmit={formik.handleSubmit}>{stepComponents[currentStep]}</form>
    </div>
  );
}