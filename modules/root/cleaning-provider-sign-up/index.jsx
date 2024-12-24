"use client";

import * as Yup from "yup";
import Container from "@/components/shared/Container";
import { useEffect, useState } from "react";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import StepFour from "./components/StepFour";
import { useFormik } from "formik";
import ApiKit from "@/common/ApiKit";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const countryOptions = [
  { label: "United Kingdom", value: "uk" },
  { label: "Australia", value: "au" },
  { label: "Canada", value: "ca" },
  { label: "United States", value: "us" },
];

const initialValues = {
  first_name: "",
  last_name: "",
  username: "",
  country: "",
  address: "",
  city: "",
  vehicle_registration_number: "",
  email: "",
  password: "",
  driver_count: null,
  is_individual: null,
  is_company: null,
  have_insurance: null,
  have_criminal_conviction: null,
  is_background_check_passed: null,
  role: "CLEANING_PROVIDER",
  document_type: null,
  payment_method: "STRIPE",
  card_holder_name: "",
  card_number: "",
  expiry_date: "",
  cvv: "",
  phone: "",
};

const stepOneValidationSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  username: Yup.string().required("Username is required"),
  address: Yup.string().required("Address is required"),
  vehicle_registration_number: Yup.string().required(
    "Vehicle registration number is required",
  ),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
    phone: Yup.string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .test("is-phone", "Please enter a valid phone number", (value) => {
      if (!value) return false;
      return value.length >= 10;
    }),
  country: Yup.string()
    .required("Country is required")
    .oneOf(['uk', 'au', 'ca', 'us'], "Please select a valid country"),
  city: Yup.string()
    .required("City is required")
    .min(2, "City name must be at least 2 characters"),
  driver_count: Yup.number().nullable().required("Driver count is required"),
});

const stepTwoValidationSchema = Yup.object().shape({
  is_individual: Yup.boolean().required("Is individual is required"),
  is_company: Yup.boolean().required("Is company is required"),
  have_insurance: Yup.boolean().required("Have insurance is required"),
  have_criminal_conviction: Yup.boolean().required(
    "Have criminal conviction is required",
  ),
  is_background_check_passed: Yup.boolean().required(
    "Is background check passed is required",
  ),
});

const stepThreeValidationSchema = Yup.object().shape({
  document_type: Yup.object()
    .shape({
      label: Yup.string(),
      value: Yup.string(),
    })
    .required("Document type is required"),
});

const stepFourValidationSchema = Yup.object().shape({
  payment_method: Yup.string()
    .oneOf(["STRIPE", "OTHER_METHOD"], "Invalid payment method")
    .required("Payment method is required"),
  card_holder_name: Yup.string().required("Card holder name is required"),
  card_number: Yup.string()
    .matches(/^[0-9]{16}$/, "Card number must be 16 digits")
    .required("Card number is required"),
  expiry_date: Yup.string()
    .matches(
      /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/,
      "Expiry date must be in MM/YY or MM/YYYY format",
    )
    .required("Expiry date is required"),
  cvv: Yup.string()
    .matches(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits")
    .required("CVV is required"),
});

const validationSchemas = [
  stepOneValidationSchema,
  stepTwoValidationSchema,
  stepThreeValidationSchema,
  stepFourValidationSchema,
];

export default function CleaningProviderSignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [insuranceFiles, setInsuranceFiles] = useState([]); // Add insurance files state
  const [loading, setLoading] = useState(false);
  const [currentValidationSchema, setCurrentValidationSchema] = useState(
    validationSchemas[0],
  );

  useEffect(() => {
    setCurrentValidationSchema(validationSchemas[currentStep - 1]);
  }, [currentStep]);

  const formik = useFormik({
    initialValues,
    validationSchema: currentValidationSchema,
    onSubmit: (values) => {
      setLoading(true);
      const payload = {
        ...values,
        front_image: files[0],
        back_image: files[1],
        insurance_document_image: insuranceFiles[0], // Add insurance document
      };

      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        if (
          key === "front_image" ||
          key === "back_image" ||
          key === "insurance_document_image"
        ) {
          formData.append(key, payload[key]);
        } else if (key === "document_type") {
          formData.append(key, payload[key].value);
        } else {
          formData.append(key, payload[key]);
        }
      });

      const promise = ApiKit.auth
        .register(formData)
        .then(() => {
          router.push("/cleaning-provider-sign-in");
          formik.resetForm();
          setFiles([]);
          setInsuranceFiles([]); // Reset insurance files
        })
        .catch((error) => {
          console.log(error);
          throw error;
        })
        .finally(() => setLoading(false));

      toast.promise(promise, {
        loading: "Creating your account...",
        success: "Account created successfully",
        error: (error) => {
          const errorKeys = Object.keys(error?.response?.data);
          return (
            error.response?.data[errorKeys[0]][0] ||
            error.response.data?.detail ||
            "Failed to create account"
          );
        },
      });
    },
  });

  return (
    <Container>
      <h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
        Cleaning Provider Registration Form
      </h2>

      <div className="mt-5 h-4 rounded-lg bg-[#D9D9D9]">
        <div
          className="h-full rounded-lg bg-secondary"
          style={{
            width: `${(currentStep / 4) * 100}%`,
          }}
        ></div>
      </div>

      <form className="my-10">
        {currentStep === 1 && (
          <StepOne
            setCurrentStep={setCurrentStep}
            formik={formik}
            currentValidationSchema={currentValidationSchema}
            countryOptions={countryOptions}
          />
        )}
        {currentStep === 2 && (
          <StepTwo
            setCurrentStep={setCurrentStep}
            formik={formik}
            currentValidationSchema={currentValidationSchema}
          />
        )}
        {currentStep === 3 && (
          <StepThree
            setCurrentStep={setCurrentStep}
            formik={formik}
            files={files}
            setFiles={setFiles}
            insuranceFiles={insuranceFiles}
            setInsuranceFiles={setInsuranceFiles}
            currentValidationSchema={currentValidationSchema}
          />
        )}
        {currentStep === 4 && (
          <StepFour
            setCurrentStep={setCurrentStep}
            currentValidationSchema={currentValidationSchema}
            formik={formik}
            loading={loading}
          />
        )}
      </form>
    </Container>
  );
}