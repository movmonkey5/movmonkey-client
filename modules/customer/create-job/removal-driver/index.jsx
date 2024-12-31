"use client";

import { useState } from "react";

import { useFormik } from "formik";
import { toast } from "sonner";

import { initialValues } from "./components/schema/inititalValues";
import { useRouter } from "next/navigation";
import FindDistance from "./components/FindDistance";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import MediaInfoSection from "./components/MediaInfoSection";
import { useQuery } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import Loading from "@/components/shared/Loading";
import { dateFormatter } from "@/lib/utils";
import validationSchema from "./components/schema/validationSchema";

export default function RemovalDriverPage() {
  const router = useRouter();
  const [mediaErrors, setMediaErrors] = useState({
    images: false,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

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
        if (key === "images" || key === "videos") {
          value.forEach((file) => formData.append(key, file));
        } else if (payload[key] !== null) {
          formData.append(key, payload[key]);
        } else if (typeof value === "object" && value !== null) {
          formData.append(
            key,
            typeof value === "object" && value !== null ? value.value : value,
          );
        }
      });

      const promise = ApiKit.me.job.removal
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
        success: "Your job  preview, has been  successfully created!",
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

  const { data, isLoading } = useQuery({
    queryKey: ["removal-category"],
    queryFn: () =>
      ApiKit.public.category.getRemoval().then(({ data }) => data.results),
  });

  if (isLoading) return <Loading className="h-screen" />;

  const stepComponents = {
    1: <FindDistance formik={formik} setCurrentStep={setCurrentStep} />,
    2: (
      <StepOne
        formik={formik}
        setCurrentStep={setCurrentStep}
        categories={data}
      />
    ),
    3: <StepTwo formik={formik} setCurrentStep={setCurrentStep} />,
    4: <StepThree formik={formik} setCurrentStep={setCurrentStep} />,
    5: (
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
}
