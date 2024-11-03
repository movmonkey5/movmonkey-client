"use client";

import * as Yup from "yup";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isEmptyArray, useFormik } from "formik";
import { toast } from "sonner";

import ApiKit from "@/common/ApiKit";
import { initialValues } from "./components/schema/initialValues";
import { dateFormatter } from "@/lib/utils";
import {
  generalValidationSchema,
  homeCleaningValidationSchema,
  officeCleaningValidationSchema,
  tenancyCleaningValidationSchema,
} from "./components/schema/validationSchema";

import CleaningAddress from "./components/CleaningAddress";
import CleaningCategories from "./components/CleaningCategories";
import CleaningSchedule from "./components/CleaningSchedule";
import CleaningServiceMediaInfo from "./components/CleaningServiceMediaInfo";
import HomeCleaningOne from "./components/HomeCleaningOne";
import HomeCleaningTwo from "./components/HomeCleaningTwo";
import OfficeCleaningInfoOne from "./components/OfficeCleaningInfoOne";
import TenancyInfoOne from "./components/TenancyInfoOne";
import TenancyInfoTwo from "./components/TenancyInfoTwo";

const getValidationSchema = (category) => {
  let specificSchema;

  switch (category) {
    case "cleaning_job-house-cleaning":
      specificSchema = homeCleaningValidationSchema;
      break;
    case "cleaning_job-office-cleaning":
      specificSchema = officeCleaningValidationSchema;
      break;
    case "cleaning_job-end-of-tenancy":
      specificSchema = tenancyCleaningValidationSchema;
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

export default function CleaningServicePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [subStep, setSubStep] = useState(0);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      setLoading(true);

      const payload = {
        ...values,
        moving_date: values.moving_date
          ? dateFormatter(values.moving_date)
          : "",
        images,
        videos,
      };

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        // Append images and videos
        if (key === "images" || key === "videos") {
          value.forEach((file) => formData.append(key, file));
        } else if (typeof value === "object" && value !== null) {
          // Append array elements if the array has any data
          if (Array.isArray(value)) {
            if (!isEmptyArray(value)) {
              value.forEach((item) => {
                formData.append(key, item);
              });
            }
          } else {
            // Append Object valus
            formData.append(
              key,
              typeof value === "object" && value !== null ? value.value : value,
            );
          }
        } else if (payload[key] !== null) {
          // Append key value pairs
          formData.append(key, payload[key]);
        }
      });

      const promise = ApiKit.me.job.cleaning
        .postJob(formData)
        .then((response) => {
          // Assuming the API returns the job UID
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
          const errorKeys = Object.keys(error?.response?.data);
          return (
            error.response.data?.detail ||
            error.response?.data[errorKeys[0]][0] ||
            "Failed to submit job"
          );
        },
      });
    },
  });

  validationSchema = getValidationSchema(formik.values.category);

  const stepComponents = {
    1: <CleaningCategories formik={formik} setCurrentStep={setCurrentStep} />,
    2: <CleaningAddress formik={formik} setCurrentStep={setCurrentStep} />,
    3: <CleaningSchedule formik={formik} setCurrentStep={setCurrentStep} />,
    4: {
      "cleaning_job-house-cleaning": [
        <HomeCleaningOne
          key="home-cleaning-one"
          formik={formik}
          setCurrentStep={setCurrentStep}
          setSubStep={setSubStep}
        />,
        <HomeCleaningTwo
          key="home-cleaning-two"
          formik={formik}
          setCurrentStep={setCurrentStep}
          setSubStep={setSubStep}
        />,
      ][subStep],
      "cleaning_job-office-cleaning": [
        <OfficeCleaningInfoOne
          key="office-cleaning-one"
          formik={formik}
          setCurrentStep={setCurrentStep}
        />,
      ][subStep],
      "cleaning_job-end-of-tenancy": [
        <TenancyInfoOne
          key="tenancy-info-one"
          formik={formik}
          setCurrentStep={setCurrentStep}
          setSubStep={setSubStep}
        />,
        <TenancyInfoTwo
          key="tenancy-info-two"
          formik={formik}
          setCurrentStep={setCurrentStep}
          setSubStep={setSubStep}
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
      />
    ),
  };

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <form onSubmit={formik.handleSubmit}>{stepComponents[currentStep]}</form>
    </div>
  );
}
