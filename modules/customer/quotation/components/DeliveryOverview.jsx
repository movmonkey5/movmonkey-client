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

// Field mappings for better display names
const fieldTitleMappings = {
  furniture: "Furniture Type",
  quantity: "Quantity",
  length: "Length",
  width: "Width",
  height: "Height",
  weight: "Weight",
  measurement_unit: "Measurement Unit",
  weight_unit: "Weight Unit",
  vehicle_year: "Vehicle Year",
  vehicle_brand: "Vehicle Brand",
  vehicle_model: "Vehicle Model",
  vehicle_type: "Vehicle Type",
  service_type: "Service Type",
  animal_type: "Animal Type",
  animal_name: "Animal Name",
  animal_breed: "Animal Breed",
  identification_mark: "Identification Mark",
  is_vaccinated: "Is Vaccinated",
  in_kennel_carrier: "In Kennel/Carrier",
  specific_need: "Has Specific Needs",
  specific_need_detail: "Specific Need Details",
  is_stackable: "Is Stackable",
  is_hazardous: "Is Hazardous",
  handling_unit: "Handling Unit",
  depth: "Depth",
};

export default function DeliveryOverview({ job }) {
  // Get category title from the category array
  const categoryTitle = job?.category?.[0]?.title || "Items";

  // Get delivery items data
  const deliveryItem = job?.delivery_items?.[0] || {};

  // Filter out null/undefined values and system fields
  const getValidFields = (item) => {
    const excludeFields = ["slug"]; // Fields to exclude from display

    return Object.entries(item)
      .filter(([key, value]) => {
        return (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          !excludeFields.includes(key)
        );
      })
      .map(([key, value]) => ({
        accessKey: key,
        title:
          fieldTitleMappings[key] ||
          key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value: value,
      }));
  };

  const validFields = getValidFields(deliveryItem);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2">
      <div className="max-w-7xl mx-auto">
        {/* Ultra Compact Header */}
        <div className="flex items-center justify-center mb-3">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-full mr-2"
            style={{
              backgroundColor: "#49B74B",
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-4h-2M6 9h2"
              />
            </svg>
          </div>
          <h1
            className="text-lg font-bold"
            style={{
              color: "#49B74B",
            }}
          >
            {categoryTitle} - Delivery Overview
          </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          {/* Basic Details Card */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
            <div
              className="px-3 py-2 text-white flex items-center"
              style={{
                backgroundColor: "#49B74B",
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
                {commonFields.map((field, index) => {
                  const value = job?.[field.accessKey];
                  if (value === null || value === undefined || value === "")
                    return null;

                  return (
                    <div key={field.title}>
                      <OverviewItem title={field.title} value={value} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Category Specific Details Card */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
            <div
              className="px-3 py-2 text-white flex items-center"
              style={{
                backgroundColor: "#49B74B",
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h2 className="text-sm font-semibold">{categoryTitle} Details</h2>
            </div>
            <div className="px-3 py-2">
              <div className="space-y-1">
                {validFields.length > 0 ? (
                  validFields.map((field, index) => (
                    <div key={field.accessKey}>
                      <OverviewItem
                        title={field.title}
                        value={field.value}
                        extraValue={
                          field.accessKey === "weight"
                            ? deliveryItem.weight_unit
                            : field.accessKey === "length" ||
                              field.accessKey === "width" ||
                              field.accessKey === "height"
                            ? deliveryItem.measurement_unit
                            : null
                        }
                      />
                    </div>
                  ))
                ) : (
                  <div className="py-2 text-gray-500 text-center text-sm">
                    No specific details available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
