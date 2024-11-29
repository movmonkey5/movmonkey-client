import React from "react";
import OverviewItem from "./OverviewItem";

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

export default function DeliveryOverview({ job }) {
  const category = job.category[0].slug.replaceAll("_", "-").split("-")[0];

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8">
        <div className="w-full md:w-[50%] bg-primary/10 rounded-lg shadow-md hover:scale-95 transition-all duration-300 ease-in-out">
          <h1 className="text-lg font-semibold rounded-t-lg bg-primary/60 p-4">Basic Details</h1>
          <div className="p-4 rounded-b-lg">
            {commonFields.map((field) => (
              <OverviewItem
                key={field.title}
                title={field.title}
                value={job[field.accessKey]}
              />
            ))}
          </div>
        </div>

        <div className="w-full md:w-[50%] bg-primary/10 rounded-lg shadow-md hover:scale-95 transition-all duration-300 ease-in-out">
          <h1 className="text-lg font-semibold rounded-t-lg bg-primary/60 p-4">Vehicle Details</h1>
          <div className="p-4 rounded-b-lg">
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
      </div>
    </div>
  );
}
