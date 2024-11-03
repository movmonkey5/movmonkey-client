import * as Yup from "yup";

const generalValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  have_parking_space: Yup.boolean().required("Parking space is required"),
  is_parking_ulez_congestion_charges: Yup.boolean().required(
    "Parking ULEZ congestion charges is required",
  ),
  is_included_all_charges: Yup.boolean().required(
    "Included all charges is required",
  ),
  man_count: Yup.string().required("Man count is required"),
});

const validationSchemaForVehicleAndHeavyEquipment = Yup.object().shape({
  vehicle_year: Yup.string().required("Vehicle year is required"),
  vehicle_brand: Yup.string().required("Vehicle brand is required"),
  vehicle_model: Yup.string().required("Vehicle model is required"),
  vehicle_type: Yup.string().required("Vehicle type is required"),
  moving_date: Yup.string().required("Moving date is required"),
  dropoff: Yup.string().required("Dropoff date is required"),
  service_type: Yup.string().required("Service type is required"),
});

const validationSchemaForHouseholdItems = Yup.object().shape({
  furniture: Yup.string().required("Furniture is required"),
  length: Yup.string().required("Length is required"),
  width: Yup.string().required("Width is required"),
  height: Yup.string().required("Height is required"),
  measurement_unit: Yup.string().required("Measurement unit is required"),
  weight: Yup.string().required("Weight is required"),
  weight_unit: Yup.string().required("Weight unit is required"),
  quantity: Yup.string().required("Quantity is required"),
  moving_date: Yup.string().required("Moving date is required"),
  dropoff: Yup.string().required("Dropoff date is required"),
});

const validationSchemaForAnimals = Yup.object().shape({
  animal_type: Yup.string().required("Animal type is required"),
  quantity: Yup.string().required("Number of animal is required"),
  identification_mark: Yup.string().required("Identification mark is required"),
  animal_name: Yup.string().required("Animal name is required"),
  animal_breed: Yup.string().required("Animal breed is required"),
  weight: Yup.string().required("Weight is required"),
  weight_unit: Yup.string().required("Weight unit is required"),
  is_vaccinated: Yup.boolean().required("Is vaccinated is required"),
  in_kennel_carrier: Yup.boolean().required("In kennel carrier is required"),
  specific_need: Yup.string().required("Specific need is required"),
  specific_need_detail: Yup.string().required("Specific need reason is required"),

  moving_date: Yup.string().required("Moving date is required"),
  dropoff: Yup.string().required("Dropoff date is required"),
  agree_terms: Yup.boolean().required(
    "You need to agree to the terms and conditions",
  ),
});

const validationSchemaForFreight = Yup.object().shape({
  handling_unit: Yup.string().required("Furniture type is required"),
  length: Yup.string().required("Length is required"),
  width: Yup.string().required("Width is required"),
  height: Yup.string().required("Height is required"),
  measurement_unit: Yup.string().required("Measurement unit is required"),
  weight: Yup.string().required("Weight is required"),
  weight_unit: Yup.string().required("Weight unit is required"),
  quantity: Yup.string().required("Quantity is required"),
  is_stackable: Yup.boolean().required("Is stackable is required"),
  is_hazardous: Yup.boolean().required("Is hazardous is required"),
  moving_date: Yup.string().required("Moving date is required"),
  dropoff: Yup.string().required("Dropoff date is required"),
});

export {
  generalValidationSchema,
  validationSchemaForVehicleAndHeavyEquipment,
  validationSchemaForHouseholdItems,
  validationSchemaForAnimals,
  validationSchemaForFreight,
};
