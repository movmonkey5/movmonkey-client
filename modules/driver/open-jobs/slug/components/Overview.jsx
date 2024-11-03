import { formatText } from "@/lib/utils";
import Image from "next/image";
import service_1 from "@/public/image/packing_services.png";
import service_2 from "@/public/image/packing_materials.png";
import service_3 from "@/public/image/dismantling_assembling.png";
import parking_icon from "@/public/image/parking_icon.png";
import lift_icon from "@/public/image/lift_icon.png";
import { Checkbox } from "@/components/ui/checkbox";
import DetailPricing from "./DetailPricing";
import { useFormik } from "formik";
import ApiKit from "@/common/ApiKit";
import { toast } from "sonner";

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
  {
    accessKey: "team_configuration",
    title: "Number of Man/Delivery truck",
  },
  {
    accessKey: "is_moving_date_flexible",
    title: "My moving date is flexible",
  },
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
  {
    accessKey: "have_animal",
    title: "Do you have animals",
  },
];

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

export default function Overview({ job, isCustomer = false }) {
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
        removal_job: job.slug,
      };

      const promise = ApiKit.me.quotations.removal.postQuotation(payload);

      return toast.promise(promise, {
        loading: "Loading...",
        success: "Quotation created successfully!",
        error: "Something went wrong!",
      });
    },
  });

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

        <div className="flex flex-col gap-1 px-5 md:flex-row md:items-center md:justify-between">
          <div className="text-base capitalize md:w-2/4 md:text-xl md:font-semibold">
            &#9733; What type of property are you moving
          </div>
          <div className="text-base font-semibold capitalize md:w-2/4 md:text-xl">
            {job.category.title}
          </div>
        </div>

        {commonFields.map((field) => (
          <OverviewItem
            key={field.title}
            title={field.title}
            value={job[field.accessKey]}
          />
        ))}
      </div>

      {!isCustomer && <DetailPricing formik={formik} job={job} />}
    </div>
  );
}
