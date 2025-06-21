import React from "react";
import Image from "next/image";
import parking_icon from "@/public/image/parking_icon.png";
import lift_icon from "@/public/image/lift_icon.png";

const addressFields = [
  { accessKey: "full_address", title: "Address" },
  { accessKey: "city", title: "City" },
  { accessKey: "postal_area", title: "State/Province/Region" },
];

const commonFields = [
  {
    accessKey: "cleaning_duration",
    title: "How Long do you need a cleaner(Hours)",
  },
  { accessKey: "preferred_day", title: "Preferred Day" },
  { accessKey: "preferred_meridian", title: "Preferred Time" },
  { accessKey: "room_count", title: "Number of Bedroom" },
  { accessKey: "bathroom_count", title: "Number of Bathroom" },
  { accessKey: "have_parking_space", title: "Have Parking space?" },
  {
    accessKey: "is_parking_ulez_congestion_charges",
    title: "Is Parking Ulez Congestion Charges?",
  },
  { accessKey: "is_included_all_charges", title: "Is all charges included?" },
  { accessKey: "is_individual", title: "Is Individual?" },
  { accessKey: "is_company", title: "Is company?" },
  { accessKey: "cleaning_type", title: "What type of cleaning you want" },
];

const dynamicFields = {
  cleaning_job_house: [
    { accessKey: "cleaning_plan", title: "How often would you like cleaner" },
    { accessKey: "kitchen_count", title: "Number of Kitchens" },
    {
      accessKey: "kitchen_cleaning_preference",
      title:
        "How would you like your kitchen cupboards and appliances to be cleaned",
    },
    {
      accessKey: "have_lift",
      title: "Is there a lift in in the property/flat block",
    },
    { accessKey: "have_animal", title: "Do you have a Pet" },
    { accessKey: "animal_type", title: "Please state what pets you have" },
  ],
  cleaning_job_office: [
    { accessKey: "cleaning_plan", title: "How often would you like cleaner" },
    { accessKey: "kitchen_count", title: "Number of Kitchens" },
    {
      accessKey: "kitchen_cleaning_preference",
      title:
        "How would you like your kitchen cupboards and appliances to be cleaned",
    },
    {
      accessKey: "have_lift",
      title: "Is there a lift in in the property/flat block",
    },
  ],
  cleaning_job_end: [
    {
      accessKey: "internal_windows_and_glass_cleaning",
      title: "Cleaning all internal windows and glass",
    },
    {
      accessKey: "dusting_and_cobweb_removal",
      title: "Dusting & removing cobwebs",
    },
    {
      accessKey: "shades_switches_sockets_cleaning",
      title: "Dusting & cleaning all shades, switches, and sockets",
    },
    {
      accessKey: "paintwork_washing",
      title:
        "Washing down all the paint work (doors, windows sills, skirting boards",
    },
    {
      accessKey: "kitchen_deep_cleaning",
      title:
        "Deep cleaning of the kitchen. including the oven, hob, and cooker hood",
    },
    {
      accessKey: "white_goods_cleaning",
      title:
        "Any white goods. If possible, pull out the white goods and clean behind",
    },
    {
      accessKey: "bathroom_deep_cleaning",
      title: "Deep cleaning and removing the line scale from the bathrooms",
    },
    {
      accessKey: "hard_floor_cleaning",
      title: "All hard floors are vacuumed and then washed",
    },
    {
      accessKey: "carpeted_floor_cleaning",
      title: "All carpeted floors are vacuumed",
    },
    { accessKey: "level_count", title: "How many floor levels" },
    {
      accessKey: "feature",
      title: "Which of the following apply to your property",
    },
    {
      accessKey: "carpet_cleaning_preference",
      title: "How would like your carpets/rugs to be cleaned",
    },
    {
      accessKey: "carpet_fiber",
      title: "What fibers are your carpets/rugs made of",
    },
  ],
};

const formatPreferredDay = (value) => {
  if (!value) return "N/A";
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  return days.filter((day) => value.toLowerCase().includes(day)).join(", ");
};

const OverviewItem = ({ title, value, extraValue }) => {
  let content = value;

  if (title === "Preferred Day") {
    content = formatPreferredDay(value);
  } else if (typeof value === "boolean") {
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

export default function CleanerJobOverview({ job }) {
  const category = job?.category?.[0]?.slug
    .replaceAll("_", "-")
    .split("-")
    .slice(0, 3)
    .join("_");

  return (
    <div className="overflow-hidden  bg-primary-bg  shadow-md">
      <div className="space-y-2 p-4">
        {addressFields.map((field) => (
          <OverviewItem
            key={field.title}
            title={field.title}
            value={job.address[0][field.accessKey]}
          />
        ))}
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
            value={job[field.accessKey]}
          />
        ))}
      </div>
    </div>
  );
}
