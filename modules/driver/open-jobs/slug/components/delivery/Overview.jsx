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
    <div className="flex flex-col gap-1 px-5 md:flex-row md:items-center md:justify-between">
      <div className="text-base capitalize md:w-2/4 md:text-xl md:font-semibold">
        &#9733; {title}
      </div>
      <div className="text-base font-semibold capitalize md:w-2/4 md:text-xl">
        {content}
      </div>
    </div>
  );
};

export default function DeliveryOverview({ job, isCustomer = false }) {
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

  const category = job.category[0].slug.replaceAll("_", "-").split("-")[0];

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-start bg-primary px-5 py-2 text-xl font-bold">
          <div className="hidden md:block md:w-2/4">Services Info</div>
          <div className="hidden md:block md:w-2/4">Quantity/About</div>
          <div className="text-base md:hidden">
            Services Info and Quantity/About
          </div>
        </div>

        {commonFields.map((field) => (
          <OverviewItem
            key={field.title}
            title={field.title}
            value={job[field.accessKey]}
          />
        ))}

        {dynamicFields[category].map((field) => (
          <OverviewItem
            key={field.title}
            title={field.title}
            value={job.delivery_items[0][field.accessKey]}
            extraValue={job.delivery_items[0][field.extraAccessKey]}
          />
        ))}
      </div>

      {!isCustomer && <DetailPricing formik={formik} job={job} />}
    </div>
  );
}
