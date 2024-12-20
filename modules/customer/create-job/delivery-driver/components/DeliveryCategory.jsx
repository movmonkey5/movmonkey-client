"use client";

import Container from "@/components/shared/Container";
import CategoryCard from "./CategoryCard";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function DeliveryCategory({
  formik,
  setCurrentStep,
  categories,
  setSubCategory,
}) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className="mx-auto w-full max-w-7xl px-5 py-2 ">New Delivery</p>
      </div>

      <Container>
        <div className="grid gap-2 xs:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              formik={formik}
              categories={categories}
              category={category}
              setSubCategory={setSubCategory}
              setCurrentStep={setCurrentStep}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-5 lg:ml-4">
          <Button
            onClick={() => setCurrentStep(2)}
            type="button"
            variant="accent"
            className="w-full sm:w-fit  sm:px-20"
          >
            Back
          </Button>
        </div>
      </Container>
    </div>
  );
}
