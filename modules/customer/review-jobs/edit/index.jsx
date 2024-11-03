
import React from "react";
import CleaningJobEdit from "./components/CleaningJobEdit";
import DeliveryJobEdit from "./components/DeliveryJobEdit";
import RemovalJobEdit from "./components/RemovalJobEdit";

const editJobOfKind = {
  cleaning_job: <CleaningJobEdit />,
  delivery_job: <DeliveryJobEdit />,
  removal_job: <RemovalJobEdit />,
};

export default function CustomerJobEditPage({ params }) {
  const [category, uid] = params.slugs;

  return <>{editJobOfKind[category]}</>;
}
