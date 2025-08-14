"use client";

import ImageUploader from "@/components/form/ImageUploader";
import VideoUploader from "@/components/form/VideoUploader";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
MediaInfoSection.defaultProps = {
  setMediaErrors: () => {},
  mediaErrors: { images: false }
};
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
  const handleImageChange = (newImages) => {
    setImages(newImages);
    if (typeof setMediaErrors === 'function') {
      setMediaErrors(prev => ({...prev, images: false}));
    }
  };
  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className="mx-auto w-full max-w-7xl px-5 py-2 ">List a Shipment</p>
      </div>

      <Container>
        <div className="space-y-6">
          <div>
            <p className="mb-4 text-xl font-semibold">
              Description of the items
            </p>
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
              jobType="delivery"
              
            /> */}
              {/* <ImageUploader
              files={images}
              setFiles={(newImages) => {
                setImages(newImages);
                setMediaErrors(prev => ({...prev, images: false}));
              }}
              maxFiles={5}
              jobUid={jobUid}
              jobType="delivery"
            /> */}
              <ImageUploader
      files={images}
      setFiles={handleImageChange}
      maxFiles={5}
      jobUid={jobUid}
      jobType="delivery"
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
              jobType="delivery"
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
            onClick={() => setCurrentStep(5)}
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
              console.log("Preview Job button clicked");
              console.log("Formik errors:", formik.errors);
              console.log("Formik values:", formik.values);
              console.log("Loading state:", loading);
              
              if (loading) {
                console.log("Already loading, preventing submission");
                e.preventDefault();
                return;
              }
              
              console.log("Calling formik.handleSubmit()");
              // Don't prevent default - let the form submit naturally
              formik.handleSubmit();
            }}
            className="w-full sm:w-fit  sm:px-20"
          >
            Preview Job{" "}
          </Button>
        </div>
      </Container>
    </div>
  );
}
