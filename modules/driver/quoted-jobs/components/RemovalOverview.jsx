import React from "react";

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

const OverviewItem = ({ title, value, extraValue }) => {
  let content = value;

  if (typeof value === "boolean") {
    content = value ? "Yes" : "No";
  } else if (typeof value === "string") {
    content = value.split("_").join(" ").toUpperCase();
  } else if (value === undefined || value === null) {
    content = "";
  }

  if (extraValue) {
    content += ` ${extraValue.toUpperCase()}`;
  }

  return (
    <div className="flex justify-between border-b border-gray-200 py-2">
      <div className="text-lg">{title}</div>
      <div className="text-lg font-semibold">{content}</div>
    </div>
  );
};

export default function RemovalJobOverview({ job }) {
  return (
    <div className="overflow-hidden  bg-primary-bg  shadow-md">
      <div className="space-y-2 p-4">
        <OverviewItem
          title="What type of property are you moving"
          value={job.category.title}
        />
        {commonFields.map((field) => (
          <OverviewItem
            key={field.title}
            title={field.title}
            value={job[field.accessKey]}
          />
        ))}
      </div>
    </div>
  );
}
