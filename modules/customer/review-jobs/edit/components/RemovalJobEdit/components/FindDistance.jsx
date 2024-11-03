"use client";

import FormikErrorBox from "@/components/form/FormikErrorBox";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useScrollToTop from "@/lib/hooks/useScrollToTop";
import { handleGoToNextStep } from "@/lib/utils";

const labels = ["title"];

export default function FindDistance({ formik, setCurrentStep }) {
  useScrollToTop();
  return (
    <Container>
      <div className="mb-5 w-full space-y-1">
        <Label htmlFor="title">Job Title</Label>
        <Input
          type="text"
          id="title"
          placeholder="ex: Moving a couch"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <FormikErrorBox formik={formik} field="title" />
      </div>
      <div className="space-y-28">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-10">
          <div className="w-full space-y-1">
            <Label htmlFor="moving_from">Where are you moving item from?</Label>
            <Input
              type="text"
              id="moving_from"
              placeholder="ex: full address"
              value={formik.values.moving_from}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="w-full space-y-1">
            <Label htmlFor="moving_to">Where are you moving item to?</Label>
            <Input
              type="text"
              id="moving_to"
              placeholder="ex: full address"
              value={formik.values.moving_to}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>

        {formik.values.moving_from &&
          formik.values.moving_to &&
          formik.values.total_distance === 0 && (
            <div className="flex justify-center">
              <Button
                variant="secondary"
                className="px-20"
                onClick={() => formik.setFieldValue("total_distance", 7.8)}
              >
                Calculate
              </Button>
            </div>
          )}
        {formik.values.moving_from &&
          formik.values.moving_to &&
          formik.values.total_distance > 0 && (
            <div className="flex justify-center">
              <div className="flex size-40 items-center justify-center rounded-full bg-secondary p-3">
                <h5 className="text-center text-3xl font-semibold text-white">
                  {formik.values.total_distance} Miles
                </h5>
              </div>
            </div>
          )}

        {formik.values.moving_from &&
          formik.values.moving_to &&
          formik.values.total_distance > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  handleGoToNextStep(labels, formik, () => {
                    setCurrentStep(2);
                  });
                }}
                variant="secondary"
                className="px-20"
              >
                Next
              </Button>
            </div>
          )}
      </div>
    </Container>
  );
}
