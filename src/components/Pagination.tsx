"use client";

import React from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Pagination = ({
  currentPage,
  hasPrev,
  hasNext,
}: {
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
}) => {
  const pathName = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    replace(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="mt-2 flex justify-center gap-4 w-full">
      <Button
        className="rounded-xl text-sm font-semibold text-black bg-emerald-300 hover:bg-emerald-500 hover:text-slate-100 disabled:hidden"
        disabled={!hasPrev}
        onClick={() => createPageUrl(currentPage - 1)}
      >
        <FaArrowLeft /> Back
      </Button>
      <Button
        className="rounded-xl text-sm font-semibold text-black bg-emerald-300 hover:bg-emerald-500 hover:text-slate-100 disabled:hidden"
        disabled={!hasNext}
        onClick={() => createPageUrl(currentPage + 1)}
      >
        Next <FaArrowRight />
      </Button>
    </div>
  );
};

export default Pagination;
