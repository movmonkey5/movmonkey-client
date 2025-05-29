import React from "react";
import Image from "next/image";
import parking_icon from "@/public/image/parking_icon.png";
import lift_icon from "@/public/image/lift_icon.png";
import OverviewItem from "./OverviewItem";

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

export default function CleanerJobOverview({ job }) {
  const category = job.category[0].slug
    .replaceAll("_", "-")
    .split("-")
    .slice(0, 3)
    .join("_");

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2">
      <div className="max-w-7xl mx-auto">
        {/* Ultra Compact Header */}
        <div className="flex items-center justify-center mb-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full mr-2"
            style={{
              background: "linear-gradient(135deg, #49B74B 0%, #3a9c3d 100%)",
            }}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h1
            className="text-lg font-bold"
            style={{
              background: "linear-gradient(135deg, #49B74B 0%, #3a9c3d 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Cleaning Service Overview
          </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 mb-2">
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
            <div
              className="px-3 py-2 text-white flex items-center"
              style={{
                background: "linear-gradient(135deg, #49B74B 0%, #3a9c3d 100%)",
              }}
            >
              <div className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center mr-2">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-sm font-semibold">Address Details</h2>
            </div>
            <div className="px-3 py-2">
              <div className="space-y-1">
                {addressFields.map((field, index) => (
                  <div
                    key={field.title}
                    className={`${
                      index !== addressFields.length - 1
                        ? "border-b border-gray-100 pb-1"
                        : ""
                    } py-1`}
                  >
                    <OverviewItem
                      title={field.title}
                      value={job.address[0][field.accessKey]}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
            <div
              className="px-3 py-2 text-white flex items-center"
              style={{
                background: "linear-gradient(135deg, #49B74B 0%, #3a9c3d 100%)",
              }}
            >
              <div className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center mr-2">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-sm font-semibold">Basic Details</h2>
            </div>
            <div className="px-3 py-2">
              <div className="space-y-1">
                {dynamicFields[category]?.map((field, index) => (
                  <div
                    key={field.title}
                    className={`${
                      index !== dynamicFields[category].length - 1
                        ? "border-b border-gray-100 pb-1"
                        : ""
                    } py-1`}
                  >
                    <OverviewItem
                      title={field.title}
                      value={job[field.accessKey]}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
            <div
              className="px-3 py-2 text-white flex items-center"
              style={{
                background: "linear-gradient(135deg, #49B74B 0%, #3a9c3d 100%)",
              }}
            >
              <div className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center mr-2">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </div>
              <h2 className="text-sm font-semibold">Additional Details</h2>
            </div>
            <div className="px-3 py-2">
              <div className="space-y-1">
                {commonFields.map((field, index) => (
                  <div
                    key={field.title}
                    className={`${
                      index !== commonFields.length - 1
                        ? "border-b border-gray-100 pb-1"
                        : ""
                    } py-1`}
                  >
                    <OverviewItem
                      title={field.title}
                      value={job[field.accessKey]}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
