/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ApiKit from "@/common/ApiKit";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { initialValues } from "./components/schema/inititalValues";
import FindDistance from "./components/FindDistance";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import MediaInfoSection from "./components/MediaInfoSection";
import Loading from "@/components/shared/Loading";
import { CircleChevronLeft } from "lucide-react";
import { dateFormatter } from "@/lib/utils";
import { toast } from "sonner";

export default function RemovalJobEdit() {
  const pathName = usePathname();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mediaErrors, setMediaErrors] = useState({
    images: false,
  });

  const category = pathName.split("/")[3];
  const uid = pathName.split("/")[4];

  const { data: job, isLoading } = useQuery({
    queryKey: [category, uid],
    queryFn: () => ApiKit.me.job.removal.getJob(uid).then(({ data }) => data),
    enabled: !!category && !!uid,
  });

  const { data, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["removal-category"],
    queryFn: () =>
      ApiKit.public.category.getRemoval().then(({ data }) => data.results),
  });

  const { data: files } = useQuery({
    queryKey: [`job`, `files`, uid, `removal`],
    queryFn: () =>
      ApiKit.me.job.removal.getFiles(uid).then(({ data }) => data?.results),
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

      const promise = ApiKit.me.job.removal
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

  useEffect(() => {
    formik.setFieldValue("title", job?.title);
    formik.setFieldValue("moving_from", job?.distance?.moving_from);
    formik.setFieldValue("moving_to", job?.distance?.moving_to);
    formik.setFieldValue("total_distance", job?.distance?.total_distance);
    formik.setFieldValue("unit", job?.distance?.unit);
    formik.setFieldValue("category_slug", job?.category?.slug);
    formik.setFieldValue("bed_room_count", job?.bed_room_count);
    formik.setFieldValue("floor_level", job?.floor_level);
    formik.setFieldValue("have_lift", job?.have_lift);
    formik.setFieldValue("team_configuration", job?.team_configuration);
    formik.setFieldValue("have_parking_space", job?.have_parking_space);
    formik.setFieldValue(
      "is_parking_ulez_congestion_charges",
      job?.is_parking_ulez_congestion_charges,
    );
    formik.setFieldValue(
      "is_included_all_charges",
      job?.is_included_all_charges,
    );
    formik.setFieldValue("is_individual", job?.is_individual);
    formik.setFieldValue("is_company", job?.is_company);
    formik.setFieldValue("moving_date", job?.moving_date);
    formik.setFieldValue(
      "is_moving_date_flexible",
      job?.is_moving_date_flexible,
    );
    formik.setFieldValue("extra_moving_service", job?.extra_moving_service);
    formik.setFieldValue(
      "is_moving_everything_at_once",
      job?.is_moving_everything_at_once,
    );
    formik.setFieldValue(
      "is_driver_flexible_to_move_item_at_different_time",
      job?.is_driver_flexible_to_move_item_at_different_time,
    );
    formik.setFieldValue("have_animal", job?.have_animal);
    formik.setFieldValue("description", job?.description);

    formik.setFieldValue("any_more_move", job?.any_more_move);
  }, [job]);

  useEffect(() => {
    if (files?.length) {
      const videos = files.filter((file) => file?.kind === "VIDEO");
      const images = files.filter((file) => file?.kind === "IMAGE");

      setImages(images);
      setVideos(videos);
    }
  }, [files]);

  if (isLoading || isCategoryLoading) {
    return <Loading className="h-screen" />;
  }

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
        jobUid={uid}
        mediaErrors={mediaErrors}
        setMediaErrors={setMediaErrors}
      />
    ),
  };

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="bg-primary text-lg font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-2 px-4 md:h-20">
          <div
            onClick={() => {
              router.push(pathName.replace("/edit", ""));
            }}
          >
            <Button size="icon" variant="ghost">
              <CircleChevronLeft size={24} />
            </Button>
          </div>
          <h3>Edit Job</h3>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>{stepComponents[currentStep]}</form>
    </div>
  );
}
