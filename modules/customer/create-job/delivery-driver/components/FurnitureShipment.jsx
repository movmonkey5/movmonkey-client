"use client";

import { useEffect } from "react";
import SelectField from "@/components/form/SelectField";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MeasurementUnit, WeightUnit } from "@/lib/keyChain";
import PickDuration from "./PickDuration";
import { Button } from "@/components/ui/button";
import useScrollToTop from "@/lib/hooks/useScrollToTop";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import { getEmptyDeliveryItem, validateDeliveryItem } from "./utils/deliveryItemUtils";
import { PlusCircle, Trash2 } from "lucide-react";

const labels = [
  "delivery_items",
  "moving_date",
  "dropoff",
];

export default function FurnitureShipment({ formik, setCurrentStep }) {
  useScrollToTop();
  
  // Initialize delivery_items if it's not properly set
  useEffect(() => {
    console.log("=== Component Mount Check ===");
    console.log("Current delivery_items:", formik.values.delivery_items);
    console.log("Is array?", Array.isArray(formik.values.delivery_items));
    
    if (!Array.isArray(formik.values.delivery_items) || formik.values.delivery_items.length === 0) {
      console.log("Initializing delivery_items array...");
      
      // Check if we have old format data in root level
      const hasRootLevelData = formik.values.furniture || formik.values.length || formik.values.width || 
                              formik.values.height || formik.values.weight || formik.values.quantity;
      
      if (hasRootLevelData) {
        console.log("Found root level data, migrating to array format");
        const migratedItem = {
          furniture: formik.values.furniture || '',
          length: formik.values.length || '',
          width: formik.values.width || '',
          height: formik.values.height || '',
          measurement_unit: formik.values.measurement_unit || '',
          weight: formik.values.weight || '',
          weight_unit: formik.values.weight_unit || '',
          quantity: formik.values.quantity || ''
        };
        formik.setFieldValue("delivery_items", [migratedItem]);
      } else {
        console.log("No existing data, creating empty item");
        formik.setFieldValue("delivery_items", [getEmptyDeliveryItem()]);
      }
    }
  }, []);
  
  const addDeliveryItem = () => {
    console.log("Adding new delivery item");
    const newItem = getEmptyDeliveryItem();
    console.log("New empty item:", newItem);
    const newItems = [...formik.values.delivery_items, newItem];
    console.log("Updated items array:", newItems);
    formik.setFieldValue("delivery_items", newItems);
  };

  const removeDeliveryItem = (index) => {
    console.log("Removing delivery item at index:", index);
    if (formik.values.delivery_items.length > 1) {
      const newItems = formik.values.delivery_items.filter((_, i) => i !== index);
      console.log("Updated items after removal:", newItems);
      formik.setFieldValue("delivery_items", newItems);
    }
  };

  const updateDeliveryItem = (index, field, value) => {
    console.log(`Updating item ${index}, field ${field} with value:`, value);
    const newItems = [...formik.values.delivery_items];
    newItems[index] = { ...newItems[index], [field]: value };
    console.log(`Updated item ${index}:`, newItems[index]);
    formik.setFieldValue("delivery_items", newItems);
  };

  const validateAllItems = () => {
    console.log("=== Starting validation ===");
    console.log("Category slug:", formik.values.category_slug);
    console.log("Delivery items:", formik.values.delivery_items);
    console.log("Delivery items type:", Array.isArray(formik.values.delivery_items));
    console.log("Delivery items length:", formik.values.delivery_items?.length);
    
    // Check if delivery_items is properly structured
    if (!Array.isArray(formik.values.delivery_items) || formik.values.delivery_items.length === 0) {
      console.log("ERROR: delivery_items is not a proper array or is empty");
      console.log("Creating default item array...");
      
      // Create a default item from current form values
      const defaultItem = {
        furniture: formik.values.furniture || '',
        length: formik.values.length || '',
        width: formik.values.width || '',
        height: formik.values.height || '',
        measurement_unit: formik.values.measurement_unit || '',
        weight: formik.values.weight || '',
        weight_unit: formik.values.weight_unit || '',
        quantity: formik.values.quantity || ''
      };
      
      console.log("Default item created:", defaultItem);
      formik.setFieldValue("delivery_items", [defaultItem]);
      
      // Re-validate with the new structure
      setTimeout(() => {
        validateAllItems();
      }, 50);
      return false;
    }
    
    const categoryEntity = formik.values.category_slug.split("-")[0];
    console.log("Category entity:", categoryEntity);
    
    let hasErrors = false;
    const allErrors = {};
    
    formik.values.delivery_items.forEach((item, index) => {
      console.log(`Validating item ${index}:`, item);
      console.log(`Item ${index} keys:`, Object.keys(item));
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
            furniture: true,
            length: true,
            width: true,
            height: true,
            measurement_unit: true,
            weight: true,
            weight_unit: true,
            quantity: true
          })) || []
        });
      }
    } catch (error) {
      console.error("🚀 ❌ Validation error:", error);
    }
  };

  console.log("formik hiiiiiiiiiiiiiiiiiiiiiiiii", formik.values);
  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className="mx-auto w-full max-w-7xl px-5 py-2 ">List Multiple Items for Shipment</p>
      </div>

      <Container>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xl font-semibold">Item Details ({formik.values.delivery_items.length} items)</p>
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
                <h3 className="text-lg font-semibold">Item #{index + 1}</h3>
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
                <div className="w-full space-y-1">
                  <Label htmlFor={`furniture-${index}`}>Item Type</Label>
                  <Input
                    type="text"
                    id={`furniture-${index}`}
                    placeholder="ex: Multiple seated sofa and couch"
                    value={item.furniture}
                    onChange={(e) => updateDeliveryItem(index, "furniture", e.target.value)}
                  />
                  <FormikErrorBox
                    formik={formik}
                    field={`delivery_items[${index}].furniture`}
                    className="w-full md:w-2/5"
                  />
                </div>

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
                        value={MeasurementUnit.find(option => option.value === item.measurement_unit) || ''}
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
                        value={WeightUnit.find(option => option.value === item.weight_unit) || ''}
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
