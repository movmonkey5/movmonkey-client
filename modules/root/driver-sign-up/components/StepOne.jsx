import FormikErrorBox from "@/components/form/FormikErrorBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Password } from "@/components/ui/password";
import { useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const desiredFields = [
  "first_name",
  "last_name",
  "username",
  "address",
  "vehicle_registration_number",
  "email",
  "password",
  "driver_count", 
  "country",
  "city",
  "phone",
];

export default function StepOne({
  setCurrentStep,
  formik,
  currentValidationSchema,
  countryOptions,
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

  const handleNext = async () => {
    // Safely format phone number if it exists
    if (formik.values.phone) {
      const formattedPhone = String(formik.values.phone).startsWith("+")
        ? formik.values.phone
        : `+${formik.values.phone}`;
      formik.setFieldValue("phone", formattedPhone);
    }

    console.log("Filtered Object:", filteredObject);
    
    Object.keys(filteredObject).forEach((field) => {
      formik.setFieldTouched(field, true);
    });

    try {
      await currentValidationSchema.validate(formik.values, {
        abortEarly: false,
      });
      setCurrentStep((prevStep) => prevStep + 1);
    } catch (validationErrors) {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      formik.setErrors(errors);
    }
  };

  // Reusable Input Field Component
  const renderInputField = (name, label, placeholder) => (
    <div className="mb-6 space-y-1 lg:w-1/2">
      <Label className="sm:text-base lg:text-lg" htmlFor={name}>
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
      />
      <FormikErrorBox formik={formik} field={name} />
    </div>
  );

  return (
    <div>
      {renderInputField("first_name", "First Name", "E.g. John")}
      {renderInputField("last_name", "Last Name", "E.g. Doe")}
      {renderInputField("username", "Username", "E.g. johndoe123")}
      {renderInputField(
        "address",
        "Address",
        "E.g. 1234 Main St, City, Country",
      )}
      {renderInputField(
        "vehicle_registration_number",
        "Vehicle Registration Number",
        "Enter your vehicle registration number",
      )}
      {renderInputField("email", "Email", "E.g. johndoe@gmail.com")}
      
      {/* Phone Input Field */}
      <div className="mb-6 space-y-1 lg:w-1/2">
        <Label className="sm:text-base lg:text-lg" htmlFor="phone">
          Phone Number
        </Label>
        <PhoneInput
          country={"gb"}
          type="tel"
          id="phone"
          placeholder="Enter your phone number"
          onChange={(formattedValue) => {
            formik.setFieldValue("phone", formattedValue);
          }}
          onBlur={formik.handleBlur}
          value={formik.values.phone || ""}
          inputClass="!w-full !h-10 !text-base"
          containerClass="!w-full"
        />
        <FormikErrorBox formik={formik} field="phone" />
      </div>

      <div className="mb-6 space-y-1 lg:w-1/2">
        <Label className="sm:text-base lg:text-lg" htmlFor="country">
          Country
        </Label>
        <select
          id="country"
          name="country"
          value={formik.values.country}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="block w-full rounded-3xl border border-gray-300 p-2"
        >
          <option value="">Select Country</option>
          {countryOptions.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
        <FormikErrorBox formik={formik} field="country" />
      </div>

      <div className="mb-6 space-y-1 lg:w-1/2">
        <Label className="sm:text-base lg:text-lg" htmlFor="city">
          City
        </Label>
        <Input
          id="city"
          name="city"
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter your city"
        />
        <FormikErrorBox formik={formik} field="city" />
      </div>

      <div className="mb-6 space-y-1 lg:w-1/2">
        <Label className="sm:text-base lg:text-lg" htmlFor="password">
          Password
        </Label>
        <Password
          id="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter your password"
        />
        <FormikErrorBox formik={formik} field="password" />
      </div>

      <div className="mb-6 space-y-5 lg:w-1/2">
        <Label className="sm:text-base lg:text-lg" htmlFor="driver_count">
          How many people will drive this Van/Truck?
        </Label>
        <div className="mt-6 flex flex-wrap items-center gap-2 lg:gap-8">
          {[1, 2, 3, 4, "5+"].map((count) => (
            <div
              key={count}
              onClick={() =>
                formik.setFieldValue("driver_count", count === "5+" ? 5 : count)
              }
              className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 text-lg font-bold ${
                formik.values.driver_count === count
                  ? "border-secondary bg-secondary/10"
                  : "hover:bg-slate-50"
              }`}
            >
              {count}
            </div>
          ))}
        </div>
        <FormikErrorBox formik={formik} field="driver_count" />
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <Button
          onClick={handleNext}
          type="button"
          className="w-full sm:w-fit sm:px-20"
        >
          Next
        </Button>
      </div>
    </div>
  );
}