import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useStore from "@/store";
import { useVATConfig, calculateVAT, formatCurrency } from "@/hooks/useVATConfig";

export default function DetailPricing({ formik, job }) {
  const [showOverlay, setShowOverlay] = useState(false);

  // Get user from store using the hook directly
  const user = useStore((state) => state.user);
  
  // Get user's country code (fallback to GB if not available)
  const countryCode = user?.address?.country_code || user?.country_code || "GB";
  
  // Fetch VAT configuration from backend
  const { data: vatConfig, isLoading: vatLoading } = useVATConfig(countryCode);
  
  // Update formik VAT percentage when VAT config is loaded
  useEffect(() => {
    if (vatConfig?.vat_percentage && !formik.values.total_vat) {
      formik.setFieldValue('total_vat', vatConfig.vat_percentage);
    }
  }, [vatConfig, formik]);

  const handleConfirmSubmit = () => {
    setShowOverlay(false);
    formik.handleSubmit();
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
          <Label htmlFor="quotation_validity">Quotation Validity in Days</Label>
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
          <Label htmlFor="total_vat">
            VAT ({vatLoading ? "Loading..." : `${vatConfig?.vat_percentage || 20}%`})
          </Label>
          <Input
            id="total_vat"
            name="total_vat"
            type="number"
            value={formik.values.total_vat}
            className="w-60 bg-primary-bg focus-visible:ring-primary"
            placeholder={`Default: ${vatConfig?.vat_percentage || 20}%`}
            onChange={formik.handleChange}
            disabled={vatLoading}
          />
        </div>
        <div className="flex items-center justify-between bg-primary px-4 py-2 text-lg font-medium">
          <p className="bg-primary text-xl font-bold text-black">TOTAL (inc. VAT)</p>
          <div className="text-right">
            {(() => {
              const calculations = calculateVAT(
                formik.values.subtotal,
                formik.values.extra_services_charge,
                formik.values.total_vat
              );
              return (
                <div>
                  <p className="text-xl font-bold">
                    {formatCurrency(calculations.totalWithVAT, countryCode)}
                  </p>
                  <p className="text-sm text-gray-600">
                    (VAT: {formatCurrency(calculations.vatAmount, countryCode)})
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      <div className="mt-10">
        <Button
          className="w-full rounded-sm text-xl font-semibold text-white shadow disabled:cursor-not-allowed"
          disabled={job?.is_applied}
          size="lg"
          onClick={() => setShowOverlay(true)}
        >
          {job?.is_applied ? "Already submitted" : "Submit Your Quote Now"}
        </Button>
      </div>

      {/* Confirmation Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <p className="mb-4 text-lg">
              After Submit You wont able to edit anu information. <br />
              Are you sure you want to submit?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                className="rounded bg-red-500 px-4 py-2 text-white"
                onClick={() => setShowOverlay(false)}
              >
                Cancel
              </Button>
              <Button
                className="rounded bg-green-500 px-4 py-2 text-white"
                onClick={handleConfirmSubmit}
              >
                Yes, Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
