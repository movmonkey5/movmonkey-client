import Image from "next/image";
import { Button } from "@/components/ui/button";
import card from "@/public/logo/card.png";
import paypal from "@/public/logo/paypal.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

const desiredFields = [
  "payment_method",
  "card_holder_name",
  "card_number",
  "expiry_date",
  "cvv",
];

export default function StepFour({
  setCurrentStep,
  formik,
  loading,
  currentValidationSchema,
}) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const filteredObject = {};

  for (const key in formik.values) {
    if (desiredFields.includes(key)) {
      filteredObject[key] = formik.values[key];
    }
  }

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length === 1 && value > 1) {
      value = `0${value}`;
    } else if (value.length === 2) {
      value = value > 12 ? `0${value[0]}/${value[1]}` : value;
    } else if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    formik.setFieldValue("expiry_date", value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Object.keys(filteredObject).forEach((field) => {
      formik.setFieldTouched(field, true);
    });

    try {
      await currentValidationSchema.validate(formik.values, {
        abortEarly: false,
      });
      formik.handleSubmit();
    } catch (validationErrors) {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      formik.setErrors(errors);
    }
  };

  return (
    <div>
      <div>
        <div className="mb-14 space-y-1 lg:w-1/2">
          <h3 className="mb-6 text-2xl font-semibold">Payment Method</h3>
          <div className="flex items-center gap-16">
            <div
              onClick={() => formik.setFieldValue("payment_method", "STRIPE")}
              className="flex cursor-pointer items-center gap-2"
            >
              <div
                className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.payment_method === "STRIPE" ? "bg-secondary" : "bg-transparent"}`}
              ></div>
              <div className="h-10">
                <Image
                  src={card}
                  alt="card"
                  height={40}
                  className="aspect-auto object-cover"
                />
              </div>
            </div>

            {/* <div
              onClick={() => formik.setFieldValue("payment_method", "PAYPAL")}
              className="flex cursor-pointer items-center gap-2"
            >
              <div
                className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.payment_method === "PAYPAL" ? "bg-secondary" : "bg-transparent"}`}
              ></div>
              <div className="h-10">
                <Image
                  src={paypal}
                  alt="paypal"
                  height={40}
                  className="aspect-auto object-cover"
                />
              </div>
            </div> */}
          </div>

          {formik.touched.payment_method && formik.errors.payment_method ? (
            <>
              <div>
                <div className="mt-2 rounded-full border border-danger/30 bg-danger/5 px-2 py-1 text-xs text-danger">
                  {formik.errors.payment_method}
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="mb-14">
          <h3 className="mb-6 text-2xl font-semibold">Payment Details</h3>

          <div className="space-y-6">
            <div className="w-full">
              <Label
                className="ml-0 sm:text-base lg:text-lg"
                htmlFor="card_holder_name"
              >
                Name on Card
              </Label>
              <Input
                id="card_holder_name"
                type="text"
                placeholder="Enter name on the card"
                className="rounded-none border-b-2 border-l-0 border-r-0 border-t-0 px-0 ring-offset-0 focus:border-secondary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.card_holder_name}
              />
              {formik.touched.card_holder_name &&
              formik.errors.card_holder_name ? (
                <>
                  <div>
                    <div className="mt-2 rounded-full border border-danger/30 bg-danger/5 px-2 py-1 text-xs text-danger">
                      {formik.errors.card_holder_name}
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <div className="w-full">
              <Label
                className="ml-0 sm:text-base lg:text-lg"
                htmlFor="card_number"
              >
                Card Number
              </Label>
              <Input
                id="card_number"
                type="text"
                placeholder="Enter card number"
                className="rounded-none border-b-2 border-l-0 border-r-0 border-t-0 px-0 ring-offset-0 focus:border-secondary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.card_number}
              />
              {formik.touched.card_number && formik.errors.card_number ? (
                <>
                  <div>
                    <div className="mt-2 rounded-full border border-danger/30 bg-danger/5 px-2 py-1 text-xs text-danger">
                      {formik.errors.card_number}
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-6">
              <div className="w-full">
                <Label
                  className="ml-0 sm:text-base lg:text-lg"
                  htmlFor="expiry_date"
                >
                  Expiration
                </Label>
                <Input
                  id="expiry_date"
                  type="text"
                  placeholder="MM/YY"
                  className="rounded-none border-b-2 border-l-0 border-r-0 border-t-0 px-0 ring-offset-0 focus:border-secondary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  onChange={handleExpiryDateChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.expiry_date}
                />
                {formik.touched.expiry_date && formik.errors.expiry_date ? (
                  <>
                    <div>
                      <div className="mt-2 rounded-full border border-danger/30 bg-danger/5 px-2 py-1 text-xs text-danger">
                        {formik.errors.expiry_date}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              <div className="w-full">
                <Label className="ml-0 sm:text-base lg:text-lg" htmlFor="cvv">
                  CVV
                </Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="Enter CVV"
                  className="rounded-none border-b-2 border-l-0 border-r-0 border-t-0 px-0 ring-offset-0 focus:border-secondary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.cvv}
                />
                {formik.touched.cvv && formik.errors.cvv ? (
                  <>
                    <div>
                      <div className="mt-2 rounded-full border border-danger/30 bg-danger/5 px-2 py-1 text-xs text-danger">
                        {formik.errors.cvv}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-5">
        <Button
          onClick={() => setCurrentStep(3)}
          type="button"
          variant="accent"
          className="w-full sm:w-fit  sm:px-20"
        >
          Back
        </Button>
        <Button
          disabled={loading}
          onClick={handleSubmit}
          className="w-full sm:w-fit  sm:px-20"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
