import { formatText } from "@/lib/utils";
import Image from "next/image";
import service_1 from "@/public/image/packing_services.png";
import service_2 from "@/public/image/packing_materials.png";
import service_3 from "@/public/image/dismantling_assembling.png";
import parking_icon from "@/public/image/parking_icon.png";
import lift_icon from "@/public/image/lift_icon.png";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormik } from "formik";
import ApiKit from "@/common/ApiKit";
import { toast } from "sonner";
import { 
  Truck, 
  User, 
  Package, 
  Calendar, 
  MapPin, 
  DollarSign,
  Info,
  ClipboardList
} from 'lucide-react';

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

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b">
    <div className="bg-primary/10 p-2 rounded-lg">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <h2 className="text-lg font-bold">{title}</h2>
  </div>
);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getJobType = (slug) => {
  if (!slug) return 'N/A';
  return slug.split('-')
            .slice(0, 2)
            .join(' ')
            .replace(/_/g, ' ')
            .toUpperCase();
};

const OverviewItem = ({ title, value, extraValue, isDate = false, isDateTime = false }) => {
  let content;

  if (isDateTime) {
    content = formatDateTime(value);
  } else if (isDate) {
    content = formatDate(value);
  } else if (typeof value === "boolean") {
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
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="text-gray-600 min-w-[140px]">{title}:</div>
      <div className="font-medium text-right flex-1">{content}</div>
    </div>
  );
};

const formatDeliveryItem = (item) => {
  // Exclude slug and organize fields in preferred order
  const fieldOrder = [
    'vehicle_brand',
    'vehicle_model',
    'vehicle_type',
    'vehicle_year',
    'service_type',
    'furniture',
    'length',
    'width',
    'height',
    'weight',
    'quantity',
    'measurement_unit',
    'weight_unit'
  ];

  const relevantFields = fieldOrder.reduce((acc, key) => {
    if (item[key] !== null && item[key] !== undefined && item[key] !== "") {
      // Format the key to be more readable
      const formattedKey = key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      acc[formattedKey] = item[key];
    }
    return acc;
  }, {});

  return relevantFields;
};

export default function RemovalOverview({ job, isCustomer = false }) {
  const isDeliveryJob = job.kind === "DELIVERY_JOB";
  const isRemovalJob = job.kind === "REMOVAL_JOB";

  // Add helper function to safely get category title
  const getCategoryTitle = (category) => {
    if (!category) return 'N/A';
    // Handle if category is an array
    if (Array.isArray(category)) {
      return category[0]?.title || 'N/A';
    }
    // Handle if category is an object
    return category.title || 'N/A';
  };

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
console.log(job,"job")
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Job Basic Information */}
        <Card className="lg:col-span-3">
          <SectionHeader title="Job Information" icon={ClipboardList} />
          <div className="space-y-1">
            <OverviewItem title="Job Title" value={job.title} />
            <OverviewItem title="Job Type" value={getJobType(job.category.slug)} />
            <OverviewItem title="Job Status" value={job.status} />
            <OverviewItem title="Category" value={getCategoryTitle(job.category)} />
            <OverviewItem title="Description" value={job.description} />
          </div>
        </Card>

        {/* Customer Details */}
        <Card className="lg:col-span-3">
          <SectionHeader title="Customer Details" icon={User} />
          <div className="space-y-1">
            <OverviewItem title="Full Name" value={job.customer_details.full_name} />
            <OverviewItem title="Email" value={job.customer_details.email} />
            <OverviewItem title="Phone" value={job.customer_details.phone} />
          </div>
        </Card>

        {/* Delivery/Removal Information */}
        <Card className="lg:col-span-6">
          <SectionHeader title={isDeliveryJob ? "Delivery Information" : "Removal Information"} icon={Truck} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-1">
              {isRemovalJob && (
                <div className="mb-4">
                  <OverviewItem 
                    title="Property Type" 
                    value={job.category.title} 
                  />
                  {job.category.image && (
                    <div className="mt-2 rounded-lg overflow-hidden w-full max-w-[200px]">
                      <Image 
                        src={job.category.image}
                        alt={job.category.title}
                        width={200}
                        height={150}
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
              <OverviewItem title="Moving From" value={job.distance.moving_from} />
              <OverviewItem title="Moving To" value={job.distance.moving_to} />
              <OverviewItem 
                title="Total Distance" 
                value={job.distance.total_distance} 
                extraValue={job.distance.unit} 
              />
              <OverviewItem title="Moving Date" value={job.moving_date} isDate={true} />
            </div>
            <div className="space-y-1">
              {isDeliveryJob ? (
                <>
                  <OverviewItem title="Drop-off Date" value={job.dropoff} isDate={true} />
                  <OverviewItem title="Number of Men" value={job.man_count} />
                </>
              ) : (
                <>
                  <OverviewItem title="Bedrooms" value={job.bed_room_count} />
                  <OverviewItem title="Floor Level" value={job.floor_level} />
                  <OverviewItem title="Has Lift" value={job.have_lift} />
                  <OverviewItem title="Team Configuration" value={job.team_configuration} />
                  <OverviewItem title="Truck Count" value={job.truck_count} />
                  <OverviewItem title="Extra Moving Service" value={job.extra_moving_service} />
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Quotation Details */}
        {job.quotation && (
          <Card className="lg:col-span-3">
            <SectionHeader title="Quotation Details" icon={DollarSign} />
            <div className="space-y-1">
              <OverviewItem 
                title="Total Amount" 
                value={`${job.quotation.currency} ${job.quotation.total_amount}`} 
              />
              <OverviewItem title="Status" value={job.quotation.status} />
              <OverviewItem 
                title="Created At" 
                value={job.quotation.created_at} 
                isDateTime={true}
              />
            </div>
          </Card>
        )}

        {/* Additional Details */}
        <Card className="lg:col-span-3">
          <SectionHeader title="Additional Information" icon={Info} />
          <div className="space-y-1">
            <OverviewItem title="Parking Space" value={job.have_parking_space} />
            <OverviewItem title="ULEZ Charges" value={job.is_parking_ulez_congestion_charges} />
            <OverviewItem title="All Charges Included" value={job.is_included_all_charges} />
            {isRemovalJob && (
              <>
                <OverviewItem title="Moving Date Flexible" value={job.is_moving_date_flexible} />
                <OverviewItem title="Move Everything at Once" value={job.is_moving_everything_at_once} />
                <OverviewItem title="Flexible Moving Times" value={job.is_driver_flexible_to_move_item_at_different_time} />
                <OverviewItem title="Has Animals" value={job.have_animal} />
              </>
            )}
          </div>
        </Card>

        {/* Delivery Items */}
        {isDeliveryJob && job.delivery_items && job.delivery_items.length > 0 && (
          <Card className="lg:col-span-6">
            <SectionHeader title="Delivery Items" icon={Package} />
            <div className="space-y-6">
              {job.delivery_items.map((item, index) => {
                const formattedItem = formatDeliveryItem(item);
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
                      <Package className="w-5 h-5" />
                      Item Details {index + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(formattedItem).map(([key, value]) => {
                        // Skip measurement and weight units as they'll be combined with their values
                        if (key === 'Measurement Unit' || key === 'Weight Unit') return null;

                        let displayValue = value;
                        // Combine measurements with their units
                        if (['Length', 'Width', 'Height'].includes(key)) {
                          displayValue = `${value} ${formattedItem['Measurement Unit']?.toLowerCase() || ''}`;
                        }
                        if (key === 'Weight') {
                          displayValue = `${value} ${formattedItem['Weight Unit']?.toLowerCase() || ''}`;
                        }

                        return (
                          <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                            <span className="text-gray-600">{key}:</span>
                            <span className="font-medium">{displayValue}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
