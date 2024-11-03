import { cn } from "@/lib/utils";

export default function FormikErrorBox({ formik, field, className }) {
  const showError = formik.errors[field] && formik.touched[field];
  const defaultClassNames =
    "rounded-full bg-danger/5 px-2 py-1 mt-2 text-xs text-danger border border-danger/30";
  const errorMessage = formik.errors[field];
  return showError ? (
    <div>
      <div className={cn(defaultClassNames, className)}>{errorMessage}</div>
    </div>
  ) : null;
}
