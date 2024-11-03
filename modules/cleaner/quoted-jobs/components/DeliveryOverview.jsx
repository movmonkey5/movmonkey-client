import React from "react";

const commonFields = [
  { accessKey: "have_parking_space", title: "Have Parking space" },
  {
    accessKey: "is_parking_ulez_congestion_charges",
    title: "Is Parking Ulez Congestion Charges",
  },
  { accessKey: "is_included_all_charges", title: "Is all charges included" },
  { accessKey: "is_individual", title: "Is Individual" },
  { accessKey: "is_company", title: "Is company" },
  { accessKey: "man_count", title: "Number of man" },
];

const dynamicFields = {
  vehicles: [
    { accessKey: "vehicle_year", title: "Year" },
    { accessKey: "vehicle_brand", title: "Make" },
    { accessKey: "vehicle_model", title: "Model" },
    { accessKey: "vehicle_type", title: "Vehicle Type" },
    { accessKey: "service_type", title: "Service type" },
  ],
  // ... other categories remain the same
};

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

export default function DeliveryOverview({ job }) {
  const category = job.category[0].slug.replaceAll("_", "-").split("-")[0];

  return (
    <div className="overflow-hidden  bg-primary-bg  shadow-md">
      <div className="space-y-2 p-4">
        {commonFields.map((field) => (
          <OverviewItem
            key={field.title}
            title={field.title}
            value={job[field.accessKey]}
          />
        ))}
        {dynamicFields[category]?.map((field) => (
          <OverviewItem
            key={field.title}
            title={field.title}
            value={job.delivery_items[0][field.accessKey]}
            extraValue={job.delivery_items[0][field.extraAccessKey]}
          />
        ))}
      </div>
    </div>
  );
}
