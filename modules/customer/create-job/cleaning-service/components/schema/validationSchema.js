import * as Yup from "yup";

const generalValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  full_address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  postal_area: Yup.string().required("State is required"),
  postal_code: Yup.string().required("Postal code is required"),
  country: Yup.object()
    .shape({
      label: Yup.string(),
      value: Yup.string(),
    })
    .required("Country is required"),

  cleaning_duration: Yup.number().required("Cleaning duration is required"),
  preferred_day: Yup.array().min(1, "Preferred day is required"),
  preferred_meridiem: Yup.string().required("Preferred time is required"),
  moving_date: Yup.string().required("Cleaning date is required"),
   // New parking and charges validation
   have_parking_space: Yup.boolean()
   .required("Please select if you have parking space"),
 is_parking_ulez_congestion_charges: Yup.boolean()
   .required("Please select if you are paying for charges"),
 is_included_all_charges: Yup.boolean()
   .required("Please select if charges are included"),
 

});

const homeCleaningValidationSchema = Yup.object().shape({
  cleaning_plan: Yup.string().required("Cleaning plan is required"),

  have_parking_space: Yup.boolean().required(
    "Is parking space available is required",
  ),
  is_parking_ulez_congestion_charges: Yup.boolean().required(
    "Pay congestion charges is required",
  ),
  is_included_all_charges: Yup.boolean().required(
    "All charges included is required",
  ),

  cleaning_type: Yup.string().required("Cleaning type is required"),
  room_count: Yup.number().required("Number of room is required"),
  bathroom_count: Yup.number().required("Number of bathroom is required"),
  kitchen_count: Yup.number().required("Number of kitchen is required"),
  kitchen_cleaning_preference: Yup.string().required(
    "Kitchen cleaning preference is required",
  ),
  have_animal: Yup.string().required("Pets information is required"),
});

const officeCleaningValidationSchema = Yup.object().shape({
  cleaning_plan: Yup.string().required("Cleaning plan is required"),
  cleaning_type: Yup.string().required("Cleaning type is required"),
  room_count: Yup.number().required("Number of room is required"),
  bathroom_count: Yup.number().required("Number of bathroom is required"),
  kitchen_count: Yup.number().required("Number of kitchen is required"),
  have_lift: Yup.boolean().required("Lift information is required"),
});

const tenancyCleaningValidationSchema = Yup.object().shape({
  category_slug: Yup.string().required("Place information is required"),
  room_count: Yup.number().required("Number of room is required"),
  bathroom_count: Yup.number().required("Number of bathroom is required"),
  level_count: Yup.number().required("Number of levels is required"),

  feature: Yup.array()
    .min(1, "Select at least one property")
    .max(2, "Select at most two property"),
  carpet_cleaning_preference: Yup.string().required(
    "Carpet preference is required",
  ),
  // kitchen_cupboards_cleaning: Yup.string().required(
  //   "Kitchen cupboards info is required",
  // ),
  is_require_dusting: Yup.string().required("Dusting information is required"),
  carpet_fiber: Yup.string().required("Carpet fiber information is required"),
});

export {
  generalValidationSchema,
  homeCleaningValidationSchema,
  officeCleaningValidationSchema,
  tenancyCleaningValidationSchema,
};
