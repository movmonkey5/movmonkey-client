"use client";

import SelectField from "@/components/form/SelectField";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimalType, WeightUnit } from "@/lib/keyChain";
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
  "agree_terms",
];

export default function AnimalShipment({ formik, setCurrentStep }) {
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
    console.log("=== Starting validation ===");
    console.log("Category slug:", formik.values.category_slug);
    console.log("Delivery items:", formik.values.delivery_items);
    
    const categoryEntity = formik.values.category_slug.split("-")[0];
    console.log("Category entity:", categoryEntity);
    
    let hasErrors = false;
    
    formik.values.delivery_items.forEach((item, index) => {
      console.log(`Validating item ${index}:`, item);
      const itemErrors = validateDeliveryItem(item, categoryEntity);
      console.log(`Item ${index} errors:`, itemErrors);
      
      if (Object.keys(itemErrors).length > 0) {
        hasErrors = true;
        // Set errors for each field
        Object.keys(itemErrors).forEach(field => {
          formik.setFieldError(`delivery_items[${index}].${field}`, itemErrors[field]);
        });
      }
    });

    console.log("Has errors:", hasErrors);
    console.log("=== Validation complete ===");
    return !hasErrors;
  };

  const handleNext = () => {
    console.log("Next button clicked");
    
    // Clear any existing errors
    formik.setErrors({});
    
    // Validate duration fields first
    const durationErrors = {};
    if (!formik.values.moving_date) {
      durationErrors.moving_date = "Moving date is required";
    }
    if (!formik.values.dropoff) {
      durationErrors.dropoff = "Drop-off date is required";
    }
    if (!formik.values.agree_terms) {
      durationErrors.agree_terms = "You must agree to terms and conditions";
    }
    
    if (Object.keys(durationErrors).length > 0) {
      Object.keys(durationErrors).forEach(field => {
        formik.setFieldError(field, durationErrors[field]);
      });
      console.log("Duration validation failed:", durationErrors);
      return;
    }
    
    if (validateAllItems()) {
      console.log("All validations passed, moving to next step");
      setCurrentStep(6);
    } else {
      console.log("Validation failed, staying on current step");
    }
  };

  console.log(formik.values);
  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className="mx-auto w-full max-w-7xl px-5 py-2 ">List Multiple Animals for Shipment</p>
      </div>
      
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xl font-semibold">Animal Details ({formik.values.delivery_items.length} animals)</p>
          <Button
            type="button"
            onClick={addDeliveryItem}
            variant="outline"
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Another Animal
          </Button>
        </div>

        <div className="space-y-8">
          {formik.values.delivery_items.map((item, index) => (
            <div key={index} className="border rounded-lg p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Animal #{index + 1}</h3>
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
                <div className="space-y-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-full space-y-1">
                      <Label htmlFor={`quantity-${index}`}>Number Of Animals</Label>
                      <Input
                        type="number"
                        id={`quantity-${index}`}
                        placeholder="ex: 1"
                        value={item.quantity}
                        onChange={(e) => updateDeliveryItem(index, "quantity", e.target.value)}
                      />
                      <FormikErrorBox formik={formik} field={`delivery_items[${index}].quantity`} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`identification_mark-${index}`}>Identification Mark</Label>
                    <Input
                      type="text"
                      id={`identification_mark-${index}`}
                      placeholder="(e.g., Identification Mark on Animal or Animal Tag Number)"
                      value={item.identification_mark}
                      onChange={(e) => updateDeliveryItem(index, "identification_mark", e.target.value)}
                    />
                    <FormikErrorBox
                      formik={formik}
                      field={`delivery_items[${index}].identification_mark`}
                      className="w-full md:w-2/5"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Animal Details:</h4>
                  
                  {/* Animal Type Selection */}
                  <div className="space-y-1">
                    <Label htmlFor={`animal_type-${index}`}>Animal Type</Label>
                    <SelectField
                      name={`animal_type-${index}`}
                      placeholder="Select animal type"
                      options={AnimalType}
                      onChange={(selectedOption) => {
                        updateDeliveryItem(index, "animal_type", selectedOption?.value || '');
                      }}
                      value={AnimalType.find(option => option.value === item.animal_type) || ''}
                    />
                    <FormikErrorBox formik={formik} field={`delivery_items[${index}].animal_type`} />
                  </div>

                  <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor={`animal_name-${index}`}>Animal's Name</Label>
                      <Input
                        type="text"
                        id={`animal_name-${index}`}
                        placeholder="Enter your animal's name"
                        value={item.animal_name}
                        onChange={(e) => updateDeliveryItem(index, "animal_name", e.target.value)}
                      />
                      <FormikErrorBox formik={formik} field={`delivery_items[${index}].animal_name`} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`animal_breed-${index}`}>Animal's Breed</Label>
                      <Input
                        type="text"
                        id={`animal_breed-${index}`}
                        placeholder="Enter your animal's breed"
                        value={item.animal_breed}
                        onChange={(e) => updateDeliveryItem(index, "animal_breed", e.target.value)}
                      />
                      <FormikErrorBox formik={formik} field={`delivery_items[${index}].animal_breed`} />
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

                  <div className="space-y-1">
                    <Label>Is your animal current on all vaccinations?</Label>
                    <p className="ml-2 text-xs">
                      (Please note, animals not current on vaccinations should not be
                      transported)
                    </p>
                    <div className="ml-2 flex items-center gap-16 pt-3">
                      <div
                        onClick={() => updateDeliveryItem(index, "is_vaccinated", true)}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <div
                          className={`h-6 w-6 rounded-full border-2 border-secondary ${item.is_vaccinated === true ? "bg-secondary" : "bg-transparent"}`}
                        ></div>
                        <p className="text-sm font-semibold">Yes</p>
                      </div>

                      <div
                        onClick={() => updateDeliveryItem(index, "is_vaccinated", false)}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <div
                          className={`h-6 w-6 rounded-full border-2 border-secondary ${item.is_vaccinated === false ? "bg-secondary" : "bg-transparent"}`}
                        ></div>
                        <p className="text-sm font-semibold">No</p>
                      </div>
                    </div>
                    <FormikErrorBox
                      formik={formik}
                      field={`delivery_items[${index}].is_vaccinated`}
                      className="w-full md:w-2/5"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Will your animal be in a kennel/carrier?</Label>
                    <div className="ml-2 flex items-center gap-16 pt-3">
                      <div
                        onClick={() => updateDeliveryItem(index, "in_kennel_carrier", true)}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <div
                          className={`h-6 w-6 rounded-full border-2 border-secondary ${item.in_kennel_carrier === true ? "bg-secondary" : "bg-transparent"}`}
                        ></div>
                        <p className="text-sm font-semibold">Yes</p>
                      </div>

                      <div
                        onClick={() => updateDeliveryItem(index, "in_kennel_carrier", false)}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <div
                          className={`h-6 w-6 rounded-full border-2 border-secondary ${item.in_kennel_carrier === false ? "bg-secondary" : "bg-transparent"}`}
                        ></div>
                        <p className="text-sm font-semibold">No</p>
                      </div>
                    </div>
                    <FormikErrorBox
                      formik={formik}
                      field={`delivery_items[${index}].in_kennel_carrier`}
                      className="w-full md:w-2/5"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Does your animal have specific needs?</Label>
                    <div className="ml-2 flex items-center gap-16 pt-3">
                      <div
                        onClick={() => updateDeliveryItem(index, "specific_need", true)}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <div
                          className={`h-6 w-6 rounded-full border-2 border-secondary ${item.specific_need === true ? "bg-secondary" : "bg-transparent"}`}
                        ></div>
                        <p className="text-sm font-semibold">Yes</p>
                      </div>

                      <div
                        onClick={() => updateDeliveryItem(index, "specific_need", false)}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <div
                          className={`h-6 w-6 rounded-full border-2 border-secondary ${item.specific_need === false ? "bg-secondary" : "bg-transparent"}`}
                        ></div>
                        <p className="text-sm font-semibold">No</p>
                      </div>
                    </div>
                    <FormikErrorBox
                      formik={formik}
                      field={`delivery_items[${index}].specific_need`}
                      className="w-full md:w-2/5"
                    />
                    {item.specific_need && (
                      <div className="mt-4 space-y-1">
                        <Label htmlFor={`specific_need_detail-${index}`}>Please specify the specific needs:</Label>
                        <Input
                          type="text"
                          id={`specific_need_detail-${index}`}
                          placeholder="Enter specific needs"
                          value={item.specific_need_detail}
                          onChange={(e) => updateDeliveryItem(index, "specific_need_detail", e.target.value)}
                        />
                        <FormikErrorBox formik={formik} field={`delivery_items[${index}].specific_need_detail`} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">
              Add Pickup and Drop Off dates
            </h4>
            <PickDuration formik={formik} />
          </div>

          <div className="xl rounded-2xl border-2 border-secondary bg-gray-100 px-6 py-4">
            <Label className="ml-0">Terms & Conditions</Label>

            <div
              onClick={() => {
                formik.setFieldValue("agree_terms", !formik.values.agree_terms);
              }}
              className="mt-2 flex cursor-pointer items-start gap-2"
            >
              <div
                className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.agree_terms === true ? "bg-secondary" : "bg-transparent"}`}
              ></div>
              <p className="text-sm lg:max-w-4xl">
                {`Pets are precious cargo. They get easily stressed out during
                transport. Please consider your pet's age, breed, and
                temperament before potentially putting them at risk.`}
              </p>
            </div>

            <FormikErrorBox
              formik={formik}
              field="agree_terms"
              className="w-full md:w-2/5"
            />
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
