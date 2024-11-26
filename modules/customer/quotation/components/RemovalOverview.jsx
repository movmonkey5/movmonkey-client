import React from "react";
import OverviewItem from "./OverviewItem";

const commonFields = [
  { accessKey: "have_parking_space", title: "Have Parking space?" },
  {
    accessKey: "is_parking_ulez_congestion_charges",
    title: "Is Parking Ulez Congestion Charges?",
  },
  { accessKey: "is_included_all_charges", title: "Is all charges included?" },
  { accessKey: "is_individual", title: "Is Individual?" },
  { accessKey: "is_company", title: "Is company?" },
  { accessKey: "man_count", title: "Number of man" },
  { accessKey: "bed_room_count", title: "How many bedrooms are there" },
  {
    accessKey: "floor_level",
    title: "What is the floor level of the property/flat",
  },
  {
    accessKey: "have_lift",
    title: "Is there a lift in the property/flat block",
  },
  { accessKey: "team_configuration", title: "Number of Man/Delivery truck" },
  { accessKey: "is_moving_date_flexible", title: "My moving date is flexible" },
  {
    accessKey: "extra_moving_service",
    title: "Do you require any extra moving services",
  },
  {
    accessKey: "is_moving_everything_at_once",
    title: "Do you want to move everything at once",
  },
  {
    accessKey: "is_driver_flexible_to_move_item_at_different_time",
    title:
      "Are you flexible for driver to move your items twice or three times",
  },
  { accessKey: "have_animal", title: "Do you have animals" },
];

export default function RemovalJobOverview({ job }) {
  return (
    <div className="overflow-hidden">
      <div className="w-full bg-primary/10 rounded-lg shadow-md hover:scale-95 transition-all duration-300 ease-in-out">
        <h1 className="text-lg font-semibold rounded-t-lg bg-primary/60 p-4">Common Fields</h1>
        <div className="p-4 rounded-b-lg grid grid-cols-2 gap-x-12">
          {commonFields.map((field) => (
            <OverviewItem
              key={field.title}
              title={field.title}
              value={job[field.accessKey]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
