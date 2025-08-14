/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname, useRouter } from "next/navigation";

import ApiKit from "@/common/ApiKit";

import Loading from "@/components/shared/Loading";
import { initialValues } from "@/modules/customer/create-job/cleaning-service/components/schema/initialValues";
import CleaningCategories from "@/modules/customer/create-job/cleaning-service/components/CleaningCategories";
import CleaningAddress from "@/modules/customer/create-job/cleaning-service/components/CleaningAddress";
import MoveBackToDetails from "./components/MoveBackToDetails";
import CleaningSchedule from "@/modules/customer/create-job/cleaning-service/components/CleaningSchedule";
import HomeCleaningOne from "@/modules/customer/create-job/cleaning-service/components/HomeCleaningOne";
import HomeCleaningTwo from "@/modules/customer/create-job/cleaning-service/components/HomeCleaningTwo";
import OfficeCleaningInfoOne from "@/modules/customer/create-job/cleaning-service/components/OfficeCleaningInfoOne";
import TenancyInfoOne from "@/modules/customer/create-job/cleaning-service/components/TenancyInfoOne";
import TenancyInfoTwo from "@/modules/customer/create-job/cleaning-service/components/TenancyInfoTwo";
import CleaningServiceMediaInfo from "@/modules/customer/create-job/cleaning-service/components/CleaningServiceMediaInfo";
import { toast } from "sonner";
import { dateFormatter } from "@/lib/utils";
import { countries } from "@/lib/keyChain";

const setInitialValue = (formik, fieldName, value) => {
  formik.setFieldValue(fieldName, value);
};

export default function CleaningJobEdit() {
  const [currentStep, setCurrentStep] = useState(1);
  const [mediaErrors, setMediaErrors] = useState({
    images: false,
  });
  const [subStep, setSubStep] = useState(0);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const pathName = usePathname();
  const router = useRouter();
  const [_, uid] = useParams().slugs;

  const { data, isLoading } = useQuery({
    queryKey: [`cleaning_job/${uid}`],
    queryFn: () => ApiKit.me.job.cleaning.getJob(uid).then(({ data }) => data),
  });

  const { data: files } = useQuery({
    queryKey: [`job`, `files`, uid, `cleaning`],
    queryFn: () =>
      ApiKit.me.job.cleaning.getFiles(uid).then(({ data }) => data?.results),
    enabled: !!uid,
  });

  const formik = useFormik({
    initialValues: initialValues,

    onSubmit: (values) => {
      if (images.length === 0) {
        setMediaErrors({
          images: images.length === 0
        });
        toast.error("Please upload at least one image");
        return;
      }
      setLoading(true);

      const payload = {
        ...values,
        moving_date: values.moving_date
          ? dateFormatter(values.moving_date)
          : "",
        country: values.country ? values.country.value : "",
        images,
        videos,
      };

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "images" || key === "videos") {
          value.forEach((file) => {
            if (file instanceof File) {
              console.log(file);
              formData.append(key, file);
            }
          });
        } else if (payload[key] !== null) {
          formData.append(key, payload[key]);
        } else if (typeof value === "object" && value !== null) {
          formData.append(
            key,
            typeof value === "object" && value !== null ? value.value : value,
          );
        }
      });

      const promise = ApiKit.me.job.cleaning
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

  // Set initial values
  useEffect(() => {
    if (data) {
      setInitialValue(formik, "category", data.category[0].slug);
      setInitialValue(formik, "category_slug", data.category[0].slug);
      setInitialValue(formik, "title", data.title);
      setInitialValue(formik, "full_address", data.address[0].full_address);
      setInitialValue(formik, "city", data.address[0].city);
      setInitialValue(formik, "postal_area", data.address[0].postal_area);
      setInitialValue(formik, "postal_code", data.address[0].postal_code);
      setInitialValue(
        formik,
        "country",
        countries.filter((c) => c.value === data.address[0].country)[0],
      );
      setInitialValue(formik, "have_parking_space", !!data.have_parking_space);
      setInitialValue(
        formik,
        "is_parking_ulez_congestion_charges",
        !!data.is_parking_ulez_congestion_charges,
      );
      setInitialValue(
        formik,
        "is_included_all_charges",
        !!data.is_included_all_charges,
      );
      setInitialValue(formik, "is_individual", !!data.is_individual);
      setInitialValue(formik, "is_company", !!data.is_company);
      setInitialValue(formik, "cleaning_plan", data.cleaning_plan);
      setInitialValue(formik, "cleaning_duration", data.cleaning_duration);
      setInitialValue(formik, "preferred_day", data.preferred_day);
      setInitialValue(formik, "preferred_meridiem", data.preferred_meridiem);
      setInitialValue(formik, "cleaning_type", data.cleaning_type);
      setInitialValue(formik, "room_count", data.room_count);
      setInitialValue(formik, "bathroom_count", data.bathroom_count);
      setInitialValue(formik, "kitchen_count", data.kitchen_count);
      setInitialValue(formik, "level_count", data.level_count);
      setInitialValue(
        formik,
        "kitchen_cleaning_preference",
        data.kitchen_cleaning_preference,
      );
      setInitialValue(formik, "have_animal", data.have_animal);
      setInitialValue(formik, "animal_type", data.animal_type);
      setInitialValue(formik, "item_description", data.item_description);
      setInitialValue(
        formik,
        "additional_cleaning_information",
        data.additional_cleaning_information,
      );
      setInitialValue(formik, "moving_date", data.moving_date);
      setInitialValue(formik, "have_lift", !!data.have_lift);
      // setInitialValue(formik, "feature", !!data.feature);
      setInitialValue(formik, "is_require_dusting", !!data.is_require_dusting);
      setInitialValue(
        formik,
        "carpet_cleaning_preference",
        data.carpet_cleaning_preference,
      );
      setInitialValue(formik, "carpet_fiber", data.carpet_fiber);
      setInitialValue(
        formik,
        "additional_cleaning_information",
        data.additional_cleaning_information,
      );
      setInitialValue(
        formik,
        "internal_windows_and_glass_cleaning",
        data.internal_windows_and_glass_cleaning,
      );
      setInitialValue(
        formik,
        "dusting_and_cobweb_removal",
        data.dusting_and_cobweb_removal,
      );
      setInitialValue(
        formik,
        "shades_switches_sockets_cleaning",
        data.shades_switches_sockets_cleaning,
      );
      setInitialValue(formik, "paintwork_washing", data.paintwork_washing);
      setInitialValue(
        formik,
        "kitchen_deep_cleaning",
        data.kitchen_deep_cleaning,
      );
      setInitialValue(
        formik,
        "white_goods_cleaning",
        data.white_goods_cleaning,
      );
      setInitialValue(
        formik,
        "kitchen_cupboards_cleaning",
        data.kitchen_cupboards_cleaning,
      );
      setInitialValue(
        formik,
        "bathroom_deep_cleaning",
        data.bathroom_deep_cleaning,
      );
      setInitialValue(formik, "hard_floor_cleaning", data.hard_floor_cleaning);
      setInitialValue(
        formik,
        "carpeted_floor_cleaning",
        data.carpeted_floor_cleaning,
      );
    }
  }, [data]);

  useEffect(() => {
    if (files?.length) {
      const videos = files.filter((file) => file?.kind === "VIDEO");
      const images = files.filter((file) => file?.kind === "IMAGE");

      setImages(images);
      setVideos(videos);
    }
  }, [files]);

  if (isLoading) {
    return <Loading className="min-h-[calc(100vh-80px)]" />;
  }

  const stepComponents = {
    1: (
      <CleaningCategories
        formik={formik}
        setCurrentStep={setCurrentStep}
        moveBack={<MoveBackToDetails />}
      />
    ),
    2: (
      <CleaningAddress
        formik={formik}
        setCurrentStep={setCurrentStep}
        moveBack={<MoveBackToDetails />}
      />
    ),
    3: (
      <CleaningSchedule
        formik={formik}
        setCurrentStep={setCurrentStep}
        moveBack={<MoveBackToDetails />}
      />
    ),
    4: {
      "cleaning_job-house-cleaning": [
        <HomeCleaningOne
          key="home-cleaning-one"
          formik={formik}
          setCurrentStep={setCurrentStep}
          setSubStep={setSubStep}
          moveBack={<MoveBackToDetails />}
        />,
        <HomeCleaningTwo
          key="home-cleaning-two"
          formik={formik}
          setCurrentStep={setCurrentStep}
          setSubStep={setSubStep}
          moveBack={<MoveBackToDetails />}
        />,
      ][subStep],
      "cleaning_job-office-cleaning": [
        <OfficeCleaningInfoOne
          key="office-cleaning-one"
          formik={formik}
          setCurrentStep={setCurrentStep}
          moveBack={<MoveBackToDetails />}
        />,
      ][subStep],
      "cleaning_job-end-of-tenancy": [
        <TenancyInfoOne
          key="tenancy-info-one"
          formik={formik}
          setCurrentStep={setCurrentStep}
          setSubStep={setSubStep}
          moveBack={<MoveBackToDetails />}
        />,
        <TenancyInfoTwo
          key="tenancy-info-two"
          formik={formik}
          setCurrentStep={setCurrentStep}
          setSubStep={setSubStep}
          moveBack={<MoveBackToDetails />}
        />,
      ][subStep],
    }[formik.values.category],
    5: (
      <CleaningServiceMediaInfo
        formik={formik}
        setSubStep={setSubStep}
        setCurrentStep={setCurrentStep}
        images={images}
        setImages={setImages}
        videos={videos}
        setVideos={setVideos}
        loading={loading}
        jobUid={uid}
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
}
