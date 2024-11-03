"use client";

import { Button } from "../ui/button";

export default function Pagination({ params, setParams, totalCount }) {
  const currentPage = params.page;
  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="mt-10 flex items-center justify-between">
      <Button
        variant="default"
        onClick={() => {
          if (currentPage > 1) {
            setParams((prevParams) => ({
              ...prevParams,
              page: currentPage - 1,
            }));
          }
        }}
        disabled={currentPage <= 1}
      >
        Back
      </Button>
      <p className="text-center text-xs sm:text-base">
        Showing results {Math.min(totalCount, 10)} out of {totalCount}
      </p>
      <Button
        variant="default"
        onClick={() => {
          if (currentPage < totalPages) {
            setParams((prevParams) => ({
              ...prevParams,
              page: currentPage + 1,
            }));
          }
        }}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  );
}
