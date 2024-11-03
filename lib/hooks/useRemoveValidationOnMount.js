import { useEffect } from "react";

export default function useRemoveValidationOnMount(labels = [], formik) {
  useEffect(() => {
    labels.forEach((label) => {
      formik.setFieldError(label, "");
      formik.setFieldTouched(label, false);
    });
  }, []);
}
