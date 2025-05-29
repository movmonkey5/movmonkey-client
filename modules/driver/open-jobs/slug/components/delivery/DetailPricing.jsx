import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useStore from "@/store";
import { toast } from "sonner";

// const calcTotalCharge = (...charges) => {
//   return charges.reduce((accu, curr) => +accu + +curr, 0);
// };

const calcTotalCharge = (vatPercent, ...charges) => {
  const subtotal = charges.reduce((accu, curr) => +accu + +curr, 0);
  const vatAmount = (subtotal * +vatPercent) / 100;
  console.log("subtotal", subtotal);
  return subtotal + vatAmount;
};

export default function DetailPricing({ formik, job }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currency, setCurrency] = useState("$"); // Default currency symbol

  // Get user from store using the hook directly
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (user?.currencySymbol) {
      setCurrency(user.currencySymbol);
    }
  }, [user]);

  const handleConfirmSubmit = async () => {
    try {
      // Check if quotation_validity is empty before submitting
      if (!formik.values.quotation_validity) {
        formik.setFieldError("quotation_validity", "Quotation validity is required");
        formik.setFieldTouched("quotation_validity", true, false);
        setShowOverlay(false);
        toast.error("Please fill in all required fields");
        return;
      }

      setIsSubmitting(true);
      await formik.submitForm(); // Use submitForm instead of handleSubmit for Promise support

      // Show success toast and set a timeout to reload the page
      toast.success("Quote submitted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error("Failed to submit quote. Please try again.");
      console.error("Quote submission error:", error);
    } finally {
      setShowOverlay(false);
      setIsSubmitting(false);
    }
  };

  // Now you can use currency anywhere in your component
  console.log(currency); // Thi
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="mt-10">
        {/* Form Content */}
        <div className="bg-primary px-5 py-2 text-base font-bold md:text-xl">
          <div>Extra Services</div>
        </div>
        <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
          <Label htmlFor="quotation_validity">
            Quotation Validity in Days<span className="text-red-500">*</span>
          </Label>
          <div className="w-60 flex flex-col">
            <Input
              id="quotation_validity"
              name="quotation_validity"
              type="number"
              value={formik.values.quotation_validity}
              className={`bg-primary-bg focus-visible:ring-primary ${
                formik.touched.quotation_validity && formik.errors.quotation_validity
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              placeholder="Enter quotation validity"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.quotation_validity && formik.errors.quotation_validity && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.quotation_validity}</div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
          <Label htmlFor="subtotal">Subtotal</Label>
          <Input
            id="subtotal"
            name="subtotal"
            type="number"
            value={formik.values.subtotal}
            className="w-60 bg-primary-bg focus-visible:ring-primary"
            placeholder="Enter subtotal amount"
            onChange={formik.handleChange}
          />
        </div>
        <hr />
        <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
          <Label htmlFor="extra_services_charge">
            Parking, ulez, congestion, charge fee
          </Label>
          <Input
            id="extra_services_charge"
            name="extra_services_charge"
            type="number"
            value={formik.values.extra_services_charge}
            className="w-60 bg-primary-bg focus-visible:ring-primary"
            placeholder="Enter charge amount"
            onChange={formik.handleChange}
          />
        </div>
        <hr />
        <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
          <Label htmlFor="total_vat">Vat(%)</Label>
          <Input
            id="total_vat"
            name="total_vat"
            type="number"
            value={formik.values.total_vat}
            className="w-60 bg-primary-bg focus-visible:ring-primary"
            placeholder="Enter vat amount"
            onChange={formik.handleChange}
          />
        </div>
        <div className="flex items-center justify-between bg-primary px-4 py-2 text-lg font-medium">
          <p className="bg-primary text-xl font-bold text-black">TOTAL</p>
          <p className="text-xl">
            {calcTotalCharge(
              formik.values.total_vat, // VAT percentage
              formik.values.subtotal, // Subtotal
              formik.values.extra_services_charge // Additional charges
            )}{" "}
            <small>{currency}</small>
          </p>
        </div>
      </div>
      <div className="mt-10">
        <Button
          className="w-full rounded-sm text-xl font-semibold text-white shadow disabled:cursor-not-allowed"
          disabled={job?.is_applied || isSubmitting}
          size="lg"
          onClick={() => {
            // Validate form before showing confirmation modal
            const errors = {};
            if (!formik.values.quotation_validity) {
              errors.quotation_validity = "Quotation validity is required";
              formik.setFieldError("quotation_validity", "Quotation validity is required");
              formik.setFieldTouched("quotation_validity", true, false);
              toast.error("Please fill in all required fields");
              return;
            }
            setShowOverlay(true);
          }}
        >
          {job?.is_applied
            ? "Already submitted"
            : isSubmitting
            ? "Submitting..."
            : "Submit Your Quote Now"}
        </Button>
      </div>

      {/* Confirmation Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <p className="mb-4 text-lg">
              After Submit You won't be able to edit any information. <br />
              Are you sure you want to submit?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                className="rounded bg-red-500 px-4 py-2 text-white"
                onClick={() => setShowOverlay(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="rounded bg-green-500 px-4 py-2 text-white"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Yes, Submit"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
