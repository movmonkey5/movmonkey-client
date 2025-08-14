export const getEmptyDeliveryItem = () => ({
  // Vehicle fields
  vehicle_year: "",
  vehicle_brand: "",
  vehicle_model: "",
  vehicle_type: null,
  service_type: null,
  // Furniture/Household fields
  furniture: "",
  length: "",
  width: "",
  height: "",
  measurement_unit: null,
  weight: 0,
  weight_unit: null,
  quantity: "",
  // Freight fields
  handling_unit: null,
  is_hazardous: null,
  is_stackable: null,
  // Animal fields
  animal_type: null,
  identification_mark: "",
  animal_name: "",
  animal_breed: "",
  is_vaccinated: null,
  in_kennel_carrier: null,
  specific_need: null,
  specific_need_detail: "",
});

export const validateDeliveryItem = (item, categoryEntity) => {
  console.log("Validating item:", item, "for category:", categoryEntity);
  const errors = {};

  switch (categoryEntity) {
    case "vehicles":
    case "heavy_equipment":
      if (!item.vehicle_year || item.vehicle_year.trim() === "") errors.vehicle_year = "Vehicle year is required";
      if (!item.vehicle_brand || item.vehicle_brand.trim() === "") errors.vehicle_brand = "Vehicle brand is required";
      if (!item.vehicle_model || item.vehicle_model.trim() === "") errors.vehicle_model = "Vehicle model is required";
      if (!item.vehicle_type) errors.vehicle_type = "Vehicle type is required";
      if (!item.service_type) errors.service_type = "Service type is required";
      break;
    
    case "household_items":
      if (!item.furniture || item.furniture.trim() === "") errors.furniture = "Item type is required";
      if (!item.length || item.length === "" || item.length === "0") errors.length = "Length is required";
      if (!item.width || item.width === "" || item.width === "0") errors.width = "Width is required";
      if (!item.height || item.height === "" || item.height === "0") errors.height = "Height is required";
      if (!item.measurement_unit) errors.measurement_unit = "Measurement unit is required";
      if (!item.weight || item.weight === "" || item.weight === "0" || item.weight === 0) errors.weight = "Weight is required";
      if (!item.weight_unit) errors.weight_unit = "Weight unit is required";
      if (!item.quantity || item.quantity === "" || item.quantity === "0") errors.quantity = "Quantity is required";
      break;
    
    case "freight":
      if (!item.handling_unit) errors.handling_unit = "Handling unit is required";
      if (!item.length || item.length === "" || item.length === "0") errors.length = "Length is required";
      if (!item.width || item.width === "" || item.width === "0") errors.width = "Width is required";
      if (!item.height || item.height === "" || item.height === "0") errors.height = "Height is required";
      if (!item.measurement_unit) errors.measurement_unit = "Measurement unit is required";
      if (!item.weight || item.weight === "" || item.weight === "0" || item.weight === 0) errors.weight = "Weight is required";
      if (!item.weight_unit) errors.weight_unit = "Weight unit is required";
      if (!item.quantity || item.quantity === "" || item.quantity === "0") errors.quantity = "Quantity is required";
      break;
    
    case "animals":
      if (!item.animal_type) errors.animal_type = "Animal type is required";
      if (!item.animal_name || item.animal_name.trim() === "") errors.animal_name = "Animal name is required";
      if (!item.animal_breed || item.animal_breed.trim() === "") errors.animal_breed = "Animal breed is required";
      if (!item.weight || item.weight === "" || item.weight === "0" || item.weight === 0) errors.weight = "Weight is required";
      if (!item.weight_unit) errors.weight_unit = "Weight unit is required";
      if (!item.quantity || item.quantity === "" || item.quantity === "0") errors.quantity = "Quantity is required";
      if (item.is_vaccinated === null || item.is_vaccinated === undefined) errors.is_vaccinated = "Vaccination status is required";
      if (item.in_kennel_carrier === null || item.in_kennel_carrier === undefined) errors.in_kennel_carrier = "Kennel/Carrier status is required";
      break;
    
    default:
      break;
  }

  console.log("Validation errors for item:", errors);
  return errors;
};
