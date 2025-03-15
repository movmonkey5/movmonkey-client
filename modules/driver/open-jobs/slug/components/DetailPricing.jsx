import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const calcTotalCharge = (...charges) => {
  return charges.reduce((accu, curr) => +accu + +curr, 0);
};

export default function DetailPricing({ formik, job }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      await formik.submitForm();
      
      // Show success toast and reload the page
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

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="mt-10">
        {/* Form Content */}
        <div className="bg-primary px-5 py-2 text-base font-bold md:text-xl">
          <div>Extra Services</div>
        </div>
        <div className="flex flex-col gap-2 bg-primary-bg px-4 py-2 text-base md:flex-row md:items-center md:justify-between md:text-xl">
          <Label htmlFor="quotation_validity">Quotation Validity</Label>
          <Input
            id="quotation_validity"
            name="quotation_validity"
            type="number"
            value={formik.values.quotation_validity}
            className="w-60 bg-primary-bg focus-visible:ring-primary"
            placeholder="Enter quotation validity"
            onChange={formik.handleChange}
          />
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
          <Label htmlFor="total_vat">Vat</Label>
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
            £
            {calcTotalCharge(
              formik.values.subtotal,
              formik.values.extra_services_charge,
              formik.values.total_vat
            )}
          </p>
        </div>
      </div>
      <div className="mt-10">
        <Button
          className="w-full rounded-sm text-xl font-semibold text-white shadow disabled:cursor-not-allowed"
          disabled={job?.is_applied || isSubmitting}
          size="lg"
          onClick={() => setShowOverlay(true)}
        >
          {job?.is_applied ? "Already submitted" : isSubmitting ? "Submitting..." : "Submit Your Quote Now"}
        </Button>
      </div>

      {/* Confirmation Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-lg">After submit you wont be able to edit any Information <br /> Are you sure you want to submit?</p>
            <div className="flex justify-center gap-4">
              <Button
                className="px-4 py-2 text-white bg-red-500 rounded"
                onClick={() => setShowOverlay(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="px-4 py-2 text-white bg-green-500 rounded"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
