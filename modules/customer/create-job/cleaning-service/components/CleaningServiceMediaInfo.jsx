"use client";

import useScrollToTop from "@/lib/hooks/useScrollToTop";

import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import ImageUploader from "@/components/form/ImageUploader";
import { Textarea } from "@/components/ui/textarea";
import VideoUploader from "@/components/form/VideoUploader";

export default function CleaningServiceMediaInfo({
  formik,
  setSubStep,
  setCurrentStep,
  images,
  setImages,
  videos,
  setVideos,
  loading,
  jobUid = "",
  mediaErrors,
  setMediaErrors
}) {
  useScrollToTop();

  return (
    <div>
      <Container>
        <div className="mt-10 space-y-6">
          <div>
            <p className="mb-4 text-xl font-semibold">
              Description of the items
            </p>
            <Textarea
              id="item_description"
              name="item_description"
              placeholder="Describe your items in 500 words"
              value={formik.values.item_description}
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
              Maximum Upload: 3 Videos
            </p>
            <VideoUploader
              files={videos}
              setFiles={setVideos}
              maxFiles={3}
              jobUid={jobUid}
              jobType="cleaning"
            />
          </div>

          <div>
            <p className="mb-4 text-xl font-semibold">
              Is there any more you can tell us about your cleaning?
            </p>
            <Textarea
              id="additional_cleaning_information"
              name="additional_cleaning_information"
              placeholder="Write here..."
              value={formik.values.additional_cleaning_information}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-5">
          <Button
            onClick={() => {
              if (
                formik.values.category_slug === "cleaning_job-office-cleaning"
              ) {
                setSubStep(0);
              } else {
                setSubStep(1);
              }
              setCurrentStep(4);
            }}
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
            Preview Job{" "}
          </Button>
        </div>
      </Container>
    </div>
  );
}
