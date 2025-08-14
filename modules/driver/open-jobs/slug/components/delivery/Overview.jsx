import { useFormik } from "formik";
import { toast } from "sonner";

import ApiKit from "@/common/ApiKit";

import DetailPricing from "./DetailPricing";

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
];

const dynamicFields = {
  animals: [
    { accessKey: "animal_type", title: "Item type" },
    { accessKey: "quantity", title: "Number of animals" },
    { accessKey: "identification_mark", title: "Shipment title" },
    { accessKey: "animal_name", title: "Animal's name" },
    { accessKey: "animal_breed", title: "Animal's breed" },
    {
      accessKey: "weight",
      title: "Weight",
      extraAccessKey: "measurement_unit",
    },
    {
      accessKey: "is_vaccinated",
      title: "Is your animal current on all vaccinations:",
    },
    {
      accessKey: "in_kennel_carrier",
      title: "Will your animal be in a kennel/carrier",
    },
    {
      accessKey: "specific_need",
      title: "Does your animal have specific needs",
    },
    {
      accessKey: "specific_need_detail",
      title: "What is your animal need",
    },
  ],
  household: [
    { accessKey: "quantity", title: "Number of items" },
    { accessKey: "furniture", title: "Item type" },
    {
      accessKey: "length",
      title: "Length",
      extraAccessKey: "measurement_unit",
    },
    {
      accessKey: "width",
      title: "Width",
      extraAccessKey: "measurement_unit",
    },
    {
      accessKey: "height",
      title: "Height",
      extraAccessKey: "measurement_unit",
    },
    {
      accessKey: "weight",
      title: "Weight",
      extraAccessKey: "weight_unit",
    },
  ],
  freight: [
    { accessKey: "quantity", title: "Number of items" },
    {
      accessKey: "length",
      title: "Length",
      extraAccessKey: "measurement_unit",
    },
    {
      accessKey: "width",
      title: "Width",
      extraAccessKey: "measurement_unit",
    },
    {
      accessKey: "height",
      title: "Height",
      extraAccessKey: "measurement_unit",
    },
    {
      accessKey: "weight",
      title: "Weight",
      extraAccessKey: "weight_unit",
    },
    { accessKey: "is_stackable", title: "Stackable" },
    { accessKey: "is_hazardous", title: "Hazardous" },
  ],
  heavy: [
    { accessKey: "vehicle_year", title: "Year" },
    { accessKey: "vehicle_brand", title: "Make" },
    { accessKey: "vehicle_model", title: "Model" },
    { accessKey: "vehicle_type", title: "Vehicle Type" },
    { accessKey: "service_type", title: "Service type" },
  ],
  vehicles: [
    { accessKey: "vehicle_year", title: "Year" },
    { accessKey: "vehicle_brand", title: "Make" },
    { accessKey: "vehicle_model", title: "Model" },
    { accessKey: "vehicle_type", title: "Vehicle Type" },
    { accessKey: "service_type", title: "Service type" },
  ],
};

const OverviewItem = ({ title, value, extraValue }) => {
  let content;

  if (typeof value === "boolean") {
    content = value ? "Yes" : "No";
  } else if (typeof value === "string") {
    content = value.split("_").join(" ").toLocaleLowerCase();
  } else if (typeof value === "number") {
    content = value;

    content = extraValue
      ? `${content} ${extraValue.toLocaleLowerCase()}`
      : content;
  } else {
    content = "N/A";
  }

  content = extraValue
    ? `${content} ${extraValue.split("_").join(" ").toLocaleLowerCase()}`
    : content;

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 rounded-lg group border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
        <span className="text-gray-700 font-medium text-sm md:text-base group-hover:text-green-800 transition-colors duration-300">
          {title}
        </span>
      </div>
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-3 py-1.5 rounded-lg border border-gray-200 group-hover:border-green-300 transition-all duration-300 min-w-fit">
        <span className="text-gray-900 font-semibold text-sm md:text-base capitalize">
          {content}
        </span>
      </div>
    </div>
  );
};

export default function DeliveryOverview({ job, isCustomer = false }) {
  const isCompleted = job?.status === "COMPLETED";
  const formik = useFormik({
    initialValues: {
      quotation_validity: 0,
      subtotal: 0,
      extra_services_charge: 0,
      total_vat: 0,
    },
    // validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = {
        ...values,
        title: job.title,
        delivery_job: job.slug,
      };

      const promise = ApiKit.me.quotations.delivery.postQuotation(payload);

      return toast.promise(promise, {
        loading: "Loading...",
        success: "Quotation created successfully!",
        error: "Something went wrong!",
      });
    },
  });
console.log(job,"jobsssssssssssssssssssssssss")
  
  // Add safe category access with fallback
  const category = job?.category && job.category[0]?.slug 
    ? job?.category?.[0]?.slug?.replaceAll("_", "-")?.split("-")?.[0] 
    : "freight"; // Default to freight if category is undefined

  // Only render fields if the category exists in dynamicFields
  const fieldsToRender = dynamicFields[category] || [];
  
  // Get delivery items array (could be multiple items)
  const deliveryItems = job?.delivery_items || [];
  const totalItems = deliveryItems.length;

  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="w-full p-4">
        {/* Full Width Enhanced Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6 overflow-hidden w-full">
          <div className="px-6 py-4" style={{
            backgroundColor: "#49B74B"
          }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Service Overview</h1>
                <p className="text-green-100 text-sm">Detailed job information</p>
              </div>
            </div>
          </div>

          {/* Compact Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-base font-bold text-gray-800">Service Details</div>
              <div className="text-base font-bold text-gray-800">Information</div>
            </div>
          </div>

          {/* Full Width Content Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information Section */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 text-base">Basic Information</h3>
                </div>
                <div className="space-y-2">
                  {commonFields.map((field, index) => (
                    <OverviewItem
                      key={field.title}
                      title={field.title}
                      value={job?.[field.accessKey]}
                    />
                  ))}
                </div>
              </div>

              {/* Specific Details Section */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 text-base">
                    Items Details ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </h3>
                </div>
                
                {/* Show total items count as first item */}
                <div className="space-y-2 mb-4">
                  <OverviewItem
                    title="Total Number of Items"
                    value={totalItems}
                  />
                </div>

                {/* Render each delivery item */}
                <div className="space-y-6">
                  {deliveryItems.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-l-4 border-purple-400 pl-4 pb-4">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {itemIndex + 1}
                        </span>
                        Item #{itemIndex + 1}
                        {/* Show item type if available */}
                        {item?.furniture && (
                          <span className="text-sm text-gray-500 font-normal">- {item.furniture}</span>
                        )}
                        {item?.vehicle_brand && item?.vehicle_model && (
                          <span className="text-sm text-gray-500 font-normal">- {item.vehicle_brand} {item.vehicle_model}</span>
                        )}
                        {item?.handling_unit && (
                          <span className="text-sm text-gray-500 font-normal">- {item.handling_unit}</span>
                        )}
                        {item?.animal_name && (
                          <span className="text-sm text-gray-500 font-normal">- {item.animal_name}</span>
                        )}
                      </h4>
                      <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                        {fieldsToRender.map((field, fieldIndex) => {
                          const value = item?.[field.accessKey];
                          const extraValue = item?.[field.extraAccessKey];
                          
                          // Only show fields that have values
                          if (value !== null && value !== undefined && value !== '' && value !== 0) {
                            return (
                              <OverviewItem
                                key={`${itemIndex}-${field.accessKey}`}
                                title={field.title}
                                value={value}
                                extraValue={extraValue}
                              />
                            );
                          }
                          return null;
                        })}
                        
                        {/* If no fields have values, show a message */}
                        {fieldsToRender.every(field => {
                          const value = item?.[field.accessKey];
                          return value === null || value === undefined || value === '' || value === 0;
                        }) && (
                          <div className="text-gray-500 text-sm italic">
                            No additional details available for this item
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* If no items exist */}
                  {deliveryItems.length === 0 && (
                    <div className="text-gray-500 text-center py-4">
                      No delivery items found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isCustomer && !isCompleted && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                backgroundColor: "#49B74B"
              }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Pricing Details</h2>
                <p className="text-gray-500 text-sm">Set your quotation for this job</p>
              </div>
            </div>
            <DetailPricing formik={formik} job={job} />
          </div>
        )}
      </div>
    </div>
  );
}
