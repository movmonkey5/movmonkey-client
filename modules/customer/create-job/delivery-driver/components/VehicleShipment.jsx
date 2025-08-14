"use client";

import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import PickDuration from "./PickDuration";
import OpenTransport from "@/components/icon/OpenTransport";
import CloseTransport from "@/components/icon/CloseTransport";
import useScrollToTop from "@/lib/hooks/useScrollToTop";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import { getEmptyDeliveryItem, validateDeliveryItem } from "./utils/deliveryItemUtils";
import { PlusCircle, Trash2 } from "lucide-react";

const labels = [
  "delivery_items",
  "moving_date",
  "dropoff",
];

export default function VehicleShipment({ formik, setCurrentStep }) {
  useScrollToTop();

  const addDeliveryItem = () => {
    const newItems = [...formik.values.delivery_items, getEmptyDeliveryItem()];
    formik.setFieldValue("delivery_items", newItems);
  };

  const removeDeliveryItem = (index) => {
    if (formik.values.delivery_items.length > 1) {
      const newItems = formik.values.delivery_items.filter((_, i) => i !== index);
      formik.setFieldValue("delivery_items", newItems);
    }
  };

  const updateDeliveryItem = (index, field, value) => {
    console.log(`=== UPDATE DELIVERY ITEM ===`);
    console.log(`Updating item ${index}, field ${field} with value:`, value);
    console.log("Current delivery_items before update:", formik.values.delivery_items);
    
    const newItems = [...formik.values.delivery_items];
    newItems[index] = { ...newItems[index], [field]: value };
    console.log(`Updated item ${index}:`, newItems[index]);
    console.log("New items array:", newItems);
    
    formik.setFieldValue("delivery_items", newItems);
    
    // Wait a bit and check if the update worked
    setTimeout(() => {
      console.log("After update - delivery_items:", formik.values.delivery_items);
      console.log("After update - delivery_items[" + index + "]:", formik.values.delivery_items?.[index]);
    }, 100);
  };

  const validateAllItems = () => {
    console.log("=== Starting validation ===");
    console.log("Category slug:", formik.values.category_slug);
    console.log("Delivery items:", formik.values.delivery_items);
    
    const categoryEntity = formik.values.category_slug.split("-")[0];
    console.log("Category entity:", categoryEntity);
    
    let hasErrors = false;
    const allErrors = {};
    
    formik.values.delivery_items.forEach((item, index) => {
      console.log(`Validating item ${index}:`, item);
      const itemErrors = validateDeliveryItem(item, categoryEntity);
      console.log(`Item ${index} errors:`, itemErrors);
      
      if (Object.keys(itemErrors).length > 0) {
        hasErrors = true;
        // Set errors for each field
        Object.keys(itemErrors).forEach(field => {
          const errorKey = `delivery_items[${index}].${field}`;
          allErrors[errorKey] = itemErrors[field];
          formik.setFieldError(errorKey, itemErrors[field]);
        });
      }
    });

    console.log("Has errors:", hasErrors);
    console.log("All errors:", allErrors);
    console.log("=== Validation complete ===");
    return !hasErrors;
  };

  const handleNext = async () => {
    console.log("🚀 Next button clicked");
    console.log("🚀 Current formik values:", formik.values);
    console.log("🚀 Current delivery_items:", formik.values.delivery_items);
    console.log("🚀 Items count:", formik.values.delivery_items?.length);
    
    // Clear any existing errors first
    formik.setErrors({});
    
    // Validate using Formik's built-in validation
    console.log("🚀 Starting Formik validation...");
    try {
      await formik.validateForm();
      console.log("🚀 Formik validation completed");
      console.log("🚀 Current formik errors:", formik.errors);
      
      // Check if there are any validation errors
      const hasErrors = Object.keys(formik.errors).length > 0;
      console.log("🚀 Has validation errors:", hasErrors);
      console.log("🚀 Validation errors:", formik.errors);
      
      if (!hasErrors) {
        console.log("🚀 ✅ All validations passed, moving to next step");
        setCurrentStep(6);
      } else {
        console.log("🚀 ❌ Validation failed, staying on current step");
        console.log("🚀 Error details:", formik.errors);
        
        // Try to trigger validation on all fields to show errors
        formik.setTouched({
          moving_date: true,
          dropoff: true,
          delivery_items: formik.values.delivery_items?.map(() => ({
            vehicle_year: true,
            vehicle_brand: true,
            vehicle_model: true,
            vehicle_type: true,
            service_type: true
          })) || []
        });
      }
    } catch (error) {
      console.error("🚀 ❌ Validation error:", error);
    }
  };

  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className="mx-auto w-full max-w-7xl px-5 py-2 ">List Multiple Vehicles for Shipment</p>
      </div>

      <Container>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xl font-semibold">Vehicle Details ({formik.values.delivery_items.length} vehicles)</p>
          <Button
            type="button"
            onClick={addDeliveryItem}
            variant="outline"
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Another Vehicle
          </Button>
        </div>

        <div className="space-y-8">
          {formik.values.delivery_items.map((item, index) => (
            <div key={index} className="border rounded-lg p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Vehicle #{index + 1}</h3>
                {formik.values.delivery_items.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeDeliveryItem(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
                  <div className="w-full space-y-1">
                    <Label htmlFor={`vehicle_year-${index}`}>YEAR</Label>
                    <Input
                      type="text"
                      id={`vehicle_year-${index}`}
                      placeholder="ex: 2014"
                      value={item.vehicle_year}
                      onChange={(e) => updateDeliveryItem(index, "vehicle_year", e.target.value)}
                    />
                    <FormikErrorBox formik={formik} field={`delivery_items[${index}].vehicle_year`} />
                  </div>
                  <div className="w-full space-y-1">
                    <Label htmlFor={`vehicle_brand-${index}`}>MAKE</Label>
                    <Input
                      type="text"
                      id={`vehicle_brand-${index}`}
                      placeholder="ex: Ford"
                      value={item.vehicle_brand}
                      onChange={(e) => updateDeliveryItem(index, "vehicle_brand", e.target.value)}
                    />
                    <FormikErrorBox formik={formik} field={`delivery_items[${index}].vehicle_brand`} />
                  </div>
                  <div className="w-full space-y-1">
                    <Label htmlFor={`vehicle_model-${index}`}>MODEL</Label>
                    <Input
                      type="text"
                      id={`vehicle_model-${index}`}
                      placeholder="ex: E-Series"
                      value={item.vehicle_model}
                      onChange={(e) => updateDeliveryItem(index, "vehicle_model", e.target.value)}
                    />
                    <FormikErrorBox formik={formik} field={`delivery_items[${index}].vehicle_model`} />
                  </div>
                </div>

                <div className="mb-8">
                  <Label htmlFor={`vehicle_type-${index}`}>Vehicle Type</Label>
                  <div className="mt-1 flex flex-wrap items-center gap-4">
                    <div
                      onClick={() => {
                        console.log(`Setting vehicle_type for item ${index} to OPERABLE`);
                        updateDeliveryItem(index, "vehicle_type", "OPERABLE");
                      }}
                      className={cn(
                        "flex cursor-pointer items-center gap-1 rounded-full border px-3.5 py-1 lg:px-5 lg:py-2",
                        {
                          "border-secondary bg-secondary text-white":
                            item.vehicle_type === "OPERABLE",
                          "border-slate-300 bg-white text-black":
                            item.vehicle_type !== "OPERABLE",
                        },
                      )}
                    >
                      <p className="text-center text-base font-medium">Operable</p>
                    </div>

                    <div
                      onClick={() => {
                        console.log(`Setting vehicle_type for item ${index} to CONVERTIBLE`);
                        updateDeliveryItem(index, "vehicle_type", "CONVERTIBLE");
                      }}
                      className={cn(
                        "flex cursor-pointer items-center gap-1 rounded-full border px-3.5 py-1 lg:px-5 lg:py-2",
                        {
                          "border-secondary bg-secondary text-white":
                            item.vehicle_type === "CONVERTIBLE",
                          "border-slate-300 bg-white text-black":
                            item.vehicle_type !== "CONVERTIBLE",
                        },
                      )}
                    >
                      <p className="text-center text-base font-medium">Convertible</p>
                    </div>

                    <div
                      onClick={() => {
                        console.log(`Setting vehicle_type for item ${index} to MODIFIED`);
                        updateDeliveryItem(index, "vehicle_type", "MODIFIED");
                      }}
                      className={cn(
                        "flex cursor-pointer items-center gap-1 rounded-full border px-3.5 py-1 lg:px-5 lg:py-2",
                        {
                          "border-secondary bg-secondary text-white":
                            item.vehicle_type === "MODIFIED",
                          "border-slate-300 bg-white text-black":
                            item.vehicle_type !== "MODIFIED",
                        },
                      )}
                    >
                      <p className="text-center text-base font-medium">Modified</p>
                    </div>
                  </div>
                  <FormikErrorBox
                    formik={formik}
                    field={`delivery_items[${index}].vehicle_type`}
                    className="w-full md:w-2/5"
                  />
                </div>

                <p className="text-lg font-semibold">Service Type</p>
                <div className="space-y-2">
                  <div
                    onClick={() => {
                      console.log(`Setting service_type for item ${index} to OPEN_TRANSPORT`);
                      updateDeliveryItem(index, "service_type", "OPEN_TRANSPORT");
                    }}
                    className="flex w-fit cursor-pointer items-center gap-3"
                  >
                    <div
                      className={`h-6 w-6 rounded-full border-2 border-secondary ${item.service_type === "OPEN_TRANSPORT" ? "bg-secondary" : "bg-transparent"}`}
                    ></div>
                    <div className="flex items-center gap-2">
                      <OpenTransport className="h-8 w-8" />
                      <p className="font-semibold">Open Transport(£)</p>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      console.log(`Setting service_type for item ${index} to CLOSE_TRANSPORT`);
                      updateDeliveryItem(index, "service_type", "CLOSE_TRANSPORT");
                    }}
                    className="flex w-fit cursor-pointer items-center gap-3"
                  >
                    <div
                      className={`h-6 w-6 rounded-full border-2 border-secondary ${item.service_type === "CLOSE_TRANSPORT" ? "bg-secondary" : "bg-transparent"}`}
                    ></div>
                    <div className="flex items-center gap-2">
                      <CloseTransport className="h-8 w-8" />
                      <p className="font-semibold">Close Transport(£)</p>
                    </div>
                  </div>
                </div>
                <FormikErrorBox
                  formik={formik}
                  field={`delivery_items[${index}].service_type`}
                  className="w-full md:w-2/5"
                />
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <p className="mb-4 text-xl font-semibold">
              Add Pickup and Drop Off dates
            </p>
            <PickDuration formik={formik} />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-5">
          <Button
            onClick={() => setCurrentStep(4)}
            type="button"
            variant="accent"
            className="w-full sm:w-fit  sm:px-20"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            type="button"
            className="w-full sm:w-fit  sm:px-20"
          >
            Next
          </Button>
        </div>
      </Container>
    </div>
  );
}
