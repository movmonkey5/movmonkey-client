"use client";

import SelectField from "@/components/form/SelectField";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PickDuration from "./PickDuration";
import { MeasurementUnit, WeightUnit, HandlingUnit } from "@/lib/keyChain";
import { Button } from "@/components/ui/button";
import PalletIcon from "@/components/icon/PalletIcon";
import CrateIcon from "@/components/icon/CrateIcon";
import BoxIcon from "@/components/icon/BoxIcon";
import useScrollToTop from "@/lib/hooks/useScrollToTop";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import { getEmptyDeliveryItem, validateDeliveryItem } from "./utils/deliveryItemUtils";
import { PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const labels = [
  "delivery_items",
  "moving_date",
  "dropoff",
];

export default function FreightShipment({ formik, setCurrentStep }) {
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
    const newItems = [...formik.values.delivery_items];
    newItems[index] = { ...newItems[index], [field]: value };
    formik.setFieldValue("delivery_items", newItems);
  };

  const validateAllItems = () => {
    const categoryEntity = formik.values.category_slug.split("-")[0];
    let hasErrors = false;
    
    formik.values.delivery_items.forEach((item, index) => {
      const itemErrors = validateDeliveryItem(item, categoryEntity);
      if (Object.keys(itemErrors).length > 0) {
        hasErrors = true;
        // Set errors for each field
        Object.keys(itemErrors).forEach(field => {
          formik.setFieldError(`delivery_items[${index}].${field}`, itemErrors[field]);
        });
      }
    });

    return !hasErrors;
  };

  const handleNext = () => {
    if (validateAllItems()) {
      setCurrentStep(6);
    }
  };

  // Function to find the matching option object for a value
  const getOptionObject = (options, currentValue) => {
    if (!currentValue) return null;
    
    // If it's already an object with value and label, return it
    if (typeof currentValue === 'object' && currentValue.value) {
      return currentValue;
    }
    
    // Find the option with matching value
    const option = options.find(opt => {
      const optionValue = typeof opt.value === 'string' ? 
        opt.value.replace(/^["']|["']$/g, '') : opt.value;
      const valueToMatch = typeof currentValue === 'string' ? 
        currentValue.replace(/^["']|["']$/g, '') : currentValue;
        
      return optionValue === valueToMatch;
    });
    
    return option || null;
  };

  // Get the properly formatted option objects for current values
  const getMeasurementOption = (value) => getOptionObject(MeasurementUnit, value);
  const getWeightOption = (value) => getOptionObject(WeightUnit, value);
  
  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className="mx-auto w-full max-w-7xl px-5 py-2 ">List Multiple Freight Items for Shipment</p>
      </div>

      <Container>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xl font-semibold">Freight Details ({formik.values.delivery_items.length} items)</p>
          <Button
            type="button"
            onClick={addDeliveryItem}
            variant="outline"
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Another Item
          </Button>
        </div>

        <div className="space-y-8">
          {formik.values.delivery_items.map((item, index) => (
            <div key={index} className="border rounded-lg p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Freight Item #{index + 1}</h3>
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
                {/* Handling Unit */}
                <div>
                  <Label htmlFor={`handling_unit-${index}`}>Handling Unit</Label>
                  <div className="mt-1 flex flex-wrap items-center gap-4">
                    <div
                      onClick={() => updateDeliveryItem(index, "handling_unit", "PALLET")}
                      className={cn(
                        "flex cursor-pointer items-center gap-1 rounded-full border px-3.5 py-1 lg:px-5 lg:py-2",
                        {
                          "border-secondary bg-secondary text-white":
                            item.handling_unit === "PALLET",
                          "border-slate-300 bg-white text-black":
                            item.handling_unit !== "PALLET",
                        },
                      )}
                    >
                      <PalletIcon className="h-5 w-5" />
                      <p className="text-center text-base font-medium">Pallet</p>
                    </div>

                    <div
                      onClick={() => updateDeliveryItem(index, "handling_unit", "CRATE")}
                      className={cn(
                        "flex cursor-pointer items-center gap-1 rounded-full border px-3.5 py-1 lg:px-5 lg:py-2",
                        {
                          "border-secondary bg-secondary text-white":
                            item.handling_unit === "CRATE",
                          "border-slate-300 bg-white text-black":
                            item.handling_unit !== "CRATE",
                        },
                      )}
                    >
                      <CrateIcon className="h-5 w-5" />
                      <p className="text-center text-base font-medium">Crate</p>
                    </div>

                    <div
                      onClick={() => updateDeliveryItem(index, "handling_unit", "BOX")}
                      className={cn(
                        "flex cursor-pointer items-center gap-1 rounded-full border px-3.5 py-1 lg:px-5 lg:py-2",
                        {
                          "border-secondary bg-secondary text-white":
                            item.handling_unit === "BOX",
                          "border-slate-300 bg-white text-black":
                            item.handling_unit !== "BOX",
                        },
                      )}
                    >
                      <BoxIcon className="h-5 w-5" />
                      <p className="text-center text-base font-medium">Box</p>
                    </div>
                  </div>
                  <FormikErrorBox
                    formik={formik}
                    field={`delivery_items[${index}].handling_unit`}
                    className="w-full md:w-2/5"
                  />
                </div>

                {/* Dimensions */}
                <div className="space-y-4">
                  <p className="text-lg font-semibold">Dimensions</p>

                  <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 lg:grid-cols-4">
                    <div className="w-full space-y-1">
                      <Label htmlFor={`length-${index}`}>Length</Label>
                      <Input
                        type="number"
                        id={`length-${index}`}
                        placeholder="ex: 10"
                        value={item.length}
                        onChange={(e) => updateDeliveryItem(index, "length", e.target.value)}
                      />
                      <FormikErrorBox formik={formik} field={`delivery_items[${index}].length`} />
                    </div>
                    <div className="w-full space-y-1">
                      <Label htmlFor={`width-${index}`}>Width</Label>
                      <Input
                        type="number"
                        id={`width-${index}`}
                        placeholder="ex: 10"
                        value={item.width}
                        onChange={(e) => updateDeliveryItem(index, "width", e.target.value)}
                      />
                      <FormikErrorBox formik={formik} field={`delivery_items[${index}].width`} />
                    </div>
                    <div className="w-full space-y-1">
                      <Label htmlFor={`height-${index}`}>Height</Label>
                      <Input
                        type="number"
                        id={`height-${index}`}
                        placeholder="ex: 10"
                        value={item.height}
                        onChange={(e) => updateDeliveryItem(index, "height", e.target.value)}
                      />
                      <FormikErrorBox formik={formik} field={`delivery_items[${index}].height`} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`measurement_unit-${index}`}>Measurement Unit</Label>
                      <SelectField
                        name={`measurement_unit-${index}`}
                        placeholder="E.g. Inches"
                        options={MeasurementUnit}
                        onChange={(selectedOption) => {
                          updateDeliveryItem(index, "measurement_unit", selectedOption?.value || '');
                        }}
                        value={getMeasurementOption(item.measurement_unit)}
                      />
                      <FormikErrorBox formik={formik} field={`delivery_items[${index}].measurement_unit`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 lg:w-1/2">
                    <div className="space-y-1">
                      <Label htmlFor={`weight-${index}`}>Weight</Label>
                      <Input
                        type="number"
                        id={`weight-${index}`}
                        placeholder="ex: 10"
                        value={item.weight}
                        onChange={(e) => updateDeliveryItem(index, "weight", e.target.value)}
                      />
                      <FormikErrorBox formik={formik} field={`delivery_items[${index}].weight`} />
                    </div>
                    <div className="w-full space-y-1">
                      <Label htmlFor={`weight_unit-${index}`}>Weight Unit</Label>
                      <SelectField
                        name={`weight_unit-${index}`}
                        placeholder="E.g. Kilograms"
                        options={WeightUnit}
                        onChange={(selectedOption) => {
                          updateDeliveryItem(index, "weight_unit", selectedOption?.value || '');
                        }}
                        value={getWeightOption(item.weight_unit)}
                      />
                      <FormikErrorBox formik={formik} field={`delivery_items[${index}].weight_unit`} />
                    </div>
                  </div>

                  <div>
                    <div className="w-fit space-y-1">
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <Input
                        type="number"
                        id={`quantity-${index}`}
                        placeholder="ex: 10"
                        value={item.quantity}
                        onChange={(e) => updateDeliveryItem(index, "quantity", e.target.value)}
                      />
                      <FormikErrorBox formik={formik} field={`delivery_items[${index}].quantity`} />
                    </div>
                  </div>
                </div>

                {/* Properties */}
                <div className="space-y-4">
                  <p className="text-lg font-semibold">Properties</p>
                  <div className="flex flex-col gap-4">
                    {/* Stackable */}
                    <div className="flex items-center gap-4">
                      <Label>Is Stackable?</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`stackable-${index}`}
                            checked={item.is_stackable === true}
                            onChange={() => updateDeliveryItem(index, "is_stackable", true)}
                            className="text-secondary"
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`stackable-${index}`}
                            checked={item.is_stackable === false}
                            onChange={() => updateDeliveryItem(index, "is_stackable", false)}
                            className="text-secondary"
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>

                    {/* Hazardous */}
                    <div className="flex items-center gap-4">
                      <Label>Is Hazardous?</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`hazardous-${index}`}
                            checked={item.is_hazardous === true}
                            onChange={() => updateDeliveryItem(index, "is_hazardous", true)}
                            className="text-secondary"
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`hazardous-${index}`}
                            checked={item.is_hazardous === false}
                            onChange={() => updateDeliveryItem(index, "is_hazardous", false)}
                            className="text-secondary"
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
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
