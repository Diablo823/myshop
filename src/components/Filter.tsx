"use client";

import React from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";

const Filter = () => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    //console.log(name, value);
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    replace(`${pathName}?${params.toString()}`);
  };
  return (
    <div className="flex gap-2 overflow-x-scroll scrollbar-hide pt-8">
      <select
        name="type"
        id=""
        className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
        onChange={handleFilterChange}
      >
        <option>Type</option>
        <option value="physical">Physical</option>
        <option value="digital">Digital</option>
      </select>
      <Input
        type="text"
        name="min"
        placeholder="min price"
        className="text-sm font-medium rounded-full pl-4 w-28 placeholder:font-semibold placeholder:text-gray-700"
        onChange={handleFilterChange}
      />
      <Input
        type="text"
        name="max"
        placeholder="max price"
        className="text-sm font-medium rounded-full pl-4 w-28 placeholder:font-semibold placeholder:text-gray-700"
        onChange={handleFilterChange}
      />
      {/* TODO: Filter Categories */}
      <select
        name="cat"
        className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
        onChange={handleFilterChange}
      >
        <option>Category</option>
        <option value="">New Arrival</option>
        <option value="">Popular</option>
      </select>
      <select
        name=""
        id=""
        className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
      >
        <option>All Filters</option>
      </select>

      <select
        name="sort"
        id=""
        className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
        onChange={handleFilterChange}
      >
        <option>Sort By</option>
        <option value="asc price">Price (low to high)</option>
        <option value="desc price">Price (high to low)</option>
        <option value="asc lastUpdated">Newest</option>
        <option value="desc lastUpdated">Oldest</option>
      </select>
    </div>
  );
};

export default Filter;
