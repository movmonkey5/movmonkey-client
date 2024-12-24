import {
  BriefcaseBusiness,
  LogOut,
  UserRound,
  Filter,
  NotebookPen,
} from "lucide-react";

export const AUTH_TOKEN_KEY = "@AUTH_TOKEN";

export const ROLE = {
  DELIVERY_DRIVER: "DELIVERY_DRIVER",
  REMOVAL_DRIVER: "REMOVAL_DRIVER",
  CLEANING_PROVIDER: "CLEANING_PROVIDER",
  CUSTOMER: "CUSTOMER",
};

export const allRoles = [
  { label: "Delivery Driver", value: "DELIVERY_DRIVER" },
  { label: "Removal Driver", value: "REMOVAL_DRIVER" },
  { label: "Cleaning Service Provider", value: "CLEANING_PROVIDER" },
  { label: "Customer", value: "CUSTOMER" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
];

export const driverRole = [
  { label: "Delivery Driver", value: "DELIVERY_DRIVER" },
  { label: "Removal Driver", value: "REMOVAL_DRIVER" },
];

export const documentType = [
  { label: "Driving License", value: "DRIVER_LICENSE" },
  { label: "Passport", value: "PASSPORT" },
  { label: "Social Security Card", value: "SOCIAL_SECURITY_CARD" },
  { label: "Biometrics", value: "BIOMETRICS" },
  { label: "Other", value: "OTHER" },
];

export const MeasurementUnit = [
  { label: "Inches", value: "INCHES" },
  { label: "Centimeters", value: "CENTIMETERS" },
  { label: "Meters", value: "METERS" },
];

export const WeightUnit = [
  { label: "Kilograms", value: "KILOGRAMS" },
  { label: "Pounds", value: "POUNDS" },
  { label: "Grams", value: "GRAMS" },
  { label: "Tons", value: "TONS" },
];

export const AnimalType = [
  { label: "Dog", value: "DOG" },
  { label: "Cat", value: "CAT" },
  { label: "Monkey", value: "MONKEY" },
  { label: "Horse", value: "HORSE" },
  { label: "Rabbit", value: "RABBIT" },
  { label: "Fish", value: "FISH" },
  { label: "Tiger", value: "TIGER" },
  { label: "Lion", value: "LION" },
];

export const ProfileMenuDropDown = [
  {
    name: "Profile",
    href: "/profile",
    icon: UserRound,
    role: [
      ROLE.CUSTOMER,
      ROLE.DELIVERY_DRIVER,
      ROLE.REMOVAL_DRIVER,
      ROLE.CLEANING_PROVIDER,
    ],
  },
  {
    name: "Create Job",
    href: "/create-job",
    icon: BriefcaseBusiness,
    role: [ROLE.CUSTOMER],
  },
  {
    name: "My Jobs",
    href: "/created-jobs",
    icon: NotebookPen,
    role: [ROLE.CUSTOMER],
  },
  {
    name: "Available Jobs",
    href: "/open-jobs",
    icon: BriefcaseBusiness,
    role: [ROLE.DELIVERY_DRIVER, ROLE.REMOVAL_DRIVER, ROLE.CLEANING_PROVIDER],
  },
  {
    name: "Logout",
    href: "/logout",
    icon: LogOut,
    role: [
      ROLE.CUSTOMER,
      ROLE.DELIVERY_DRIVER,
      ROLE.REMOVAL_DRIVER,
      ROLE.CLEANING_PROVIDER,
    ],
  },
];

export const keysToRemove = {
  vehicles: [
    "furniture",
    "length",
    "width",
    "height",
    "measurement_unit",
    "weight",
    "weight_unit",
    "quantity",
    "handling_unit",
    "is_hazardous",
    "is_stackable",
    "animal_type",
    "identification_mark",
    "animal_name",
    "animal_breed",
    "is_vaccinated",
    "in_kennel_carrier",
    "specific_need",
  ],
  household_items: [
    "vehicle_year",
    "vehicle_brand",
    "vehicle_model",
    "vehicle_type",
    "service_type",
    "animal_type",
    "identification_mark",
    "handling_unit",
    "is_hazardous",
    "animal_name",
    "animal_breed",
    "is_vaccinated",
    "in_kennel_carrier",
    "specific_need",
    "is_stackable",
  ],
  freight: [
    "vehicle_year",
    "vehicle_brand",
    "vehicle_model",
    "vehicle_type",
    "furniture",
    "animal_type",
    "handling_unit",
    "service_type",
    "identification_mark",
    "animal_name",
    "animal_breed",
    "is_vaccinated",
    "in_kennel_carrier",
    "specific_need",
  ],
  animals: [
    "vehicle_year",
    "vehicle_brand",
    "vehicle_model",
    "vehicle_type",
    "service_type",
    "description",
    "any_more_move",
    "furniture",
    "length",
    "width",
    "height",
    "measurement_unit",
    "weight",
    "weight_unit",
    "quantity",
    "handling_unit",
    "is_hazardous",
    "is_stackable",
  ],
  heavy_equipment: [
    "furniture",
    "length",
    "width",
    "height",
    "measurement_unit",
    "weight",
    "weight_unit",
    "quantity",
    "handling_unit",
    "is_hazardous",
    "is_stackable",
    "animal_type",
    "identification_mark",
    "animal_name",
    "animal_breed",
    "is_vaccinated",
    "in_kennel_carrier",
    "specific_need",
  ],
};

export const countries = [
  { label: "Australia", value: "au" },
  { label: "Canada", value: "ca" },
  { label: "United Kingdom", value: "uk" },
  { label: "United States of America", value: "us" },
];
