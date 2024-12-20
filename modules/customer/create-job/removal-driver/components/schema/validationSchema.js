import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  category_slug: Yup.string().required("Property type is required"),
  bed_room_count: Yup.number().required("Bed room count is required"),
  floor_level: Yup.number().required("Floor level is required"),
  have_lift: Yup.boolean().required("Have lift is required"),
  team_configuration: Yup.string().required("Team configuration is required"),
  have_parking_space: Yup.boolean().required("Have parking space is required"),
  is_parking_ulez_congestion_charges: Yup.boolean().required(
    "Parking ulez congestion charges is required",
  ),
  is_included_all_charges: Yup.boolean().required(
    "Included all charges is required",
  ),
  moving_date: Yup.string().required("Moving date is required"),
  extra_moving_service: Yup.string().optional(),
    

    is_moving_everything_at_once: Yup.boolean().required(
    "Moving everything at once is required",
  ),
  is_driver_flexible_to_move_item_at_different_time: Yup.boolean().required(
    "Driver flexible to move item at different time is required",
  ),
  have_animal: Yup.boolean().required("Have animal is required"),
});

export default validationSchema;
