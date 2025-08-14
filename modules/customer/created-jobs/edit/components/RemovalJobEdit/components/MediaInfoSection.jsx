"use client";

import ImageUploader from "@/components/form/ImageUploader";
import VideoUploader from "@/components/form/VideoUploader";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

export default function MediaInfoSection({
  formik,
  setCurrentStep,
  images,
  setImages,
  videos,
  setVideos,
  loading,
  jobUid,
  mediaErrors,
  setMediaErrors
}) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (images.length === 0 || videos.length === 0) {
      setMediaErrors({
        images: images.length === 0,
        videos: videos.length === 0
      });
      return;
    }
    formik.handleSubmit();
  };
  return (
    <Container>
      <div className="h-4 rounded-lg bg-[#D9D9D9]">
        {
          <div
            className="h-full rounded-lg bg-secondary"
            style={{
              width: `${(4 / 4) * 100}%`,
            }}
          ></div>
        }
      </div>

      <div className="mt-10 space-y-6">
        <div>
          <p className="mb-4 text-xl font-semibold">Description of the items</p>
          <Textarea
            id="description"
            placeholder="Describe your items in 500 words"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div>
          <p className="mb-1 text-xl font-semibold">
            Upload the Photo or Image
          </p>
          <p className="mb-4 text-[#8C8C8C] max-sm:text-sm">
            Maximum Upload: 5 Pictures
          </p>
          {/* <ImageUploader
            files={images}
            setFiles={setImages}
            maxFiles={5}
            jobUid={jobUid}
            jobType="removal"
          /> */}
          <ImageUploader 
            files={images} 
            setFiles={(newImages) => {
              setImages(newImages);
              setMediaErrors(prev => ({...prev, images: false}));
            }} 
            maxFiles={5}
            jobUid={jobUid}
          />
          {mediaErrors?.images && (
            <p className="mt-2 text-red-500 text-sm">At least one image is required</p>
          )}
        </div>

        <div>
          <p className="mb-1 text-xl font-semibold">Upload the Short Video</p>
          <p className="mb-4 text-[#8C8C8C] max-sm:text-sm">
            Maximum Upload: 5 Videos
          </p>
          <VideoUploader
            files={videos}
            setFiles={setVideos}
            maxFiles={5}
            jobUid={jobUid}
            jobType="removal"
          />
             
        </div>

        <div>
          <p className="mb-4 text-xl font-semibold">
            In there any more you can tell us about your delivery?
          </p>
          <Textarea
            id="any_more_move"
            placeholder="Write here..."
            value={formik.values.any_more_move}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-5">
        <Button
          onClick={() => setCurrentStep(4)}
          type="button"
          variant="accent"
          className="w-full sm:w-fit  sm:px-20"
        >
          Back
        </Button>
        <Button
          loading={loading}
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
          className="w-full sm:w-fit  sm:px-20"
        >
          Submit
        </Button>
      </div>
    </Container>
  );
}
