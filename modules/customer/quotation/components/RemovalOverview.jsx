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
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21l-1 6H4l-1-6h7.5z" />
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
            Removal Service Overview
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
          <div
            className="px-3 py-2 text-white flex items-center"
            style={{
              background: "linear-gradient(135deg, #49B74B 0%, #3a9c3d 100%)",
            }}
          >
            <div className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center mr-2">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold">Basic Details</h2>
          </div>
          <div className="px-3 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
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
  );
}
