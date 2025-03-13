"use client";

import React from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const Filter = () => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // const handleFilterChange = (
  //   e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  // ) => {
  //   const { name, value } = e.target;
  //   //console.log(name, value);
  //   const params = new URLSearchParams(searchParams);
  //   params.set(name, value);
  //   replace(`${pathName}?${params.toString()}`);
  // };

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    replace(`${pathName}?${params.toString()}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    replace(`${pathName}?${params.toString()}`);
  };


  return (
    <div className="flex gap-2 overflow-x-scroll scrollbar-hide pt-8">
    <Select onValueChange={(value) => handleFilterChange("type", value)}>
      <SelectTrigger className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED] h-auto w-auto">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all_types">Type</SelectItem>
        <SelectItem value="physical">Physical</SelectItem>
        <SelectItem value="digital">Digital</SelectItem>
      </SelectContent>
    </Select>

    <Input
      type="text"
      name="min"
      placeholder="min price"
      className="text-sm font-medium rounded-full pl-4 w-28 placeholder:font-semibold placeholder:text-gray-700"
      onChange={handleInputChange}
    />
    <Input
      type="text"
      name="max"
      placeholder="max price"
      className="text-sm font-medium rounded-full pl-4 w-28 placeholder:font-semibold placeholder:text-gray-700"
      onChange={handleInputChange}
    />

    {/* <Select onValueChange={(value) => handleFilterChange("cat", value)}>
      <SelectTrigger className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED] h-auto w-auto">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all_categories">Category</SelectItem>
        <SelectItem value="newArrival">New Arrival</SelectItem>
        <SelectItem value="popular">Popular</SelectItem>
      </SelectContent>
    </Select> */}

    {/* <Select onValueChange={(value) => handleFilterChange("filter", value)}>
      <SelectTrigger className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED] h-auto w-auto">
        <SelectValue placeholder="All Filters" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all_filters">All Filters</SelectItem>
      </SelectContent>
    </Select> */}

    <Select onValueChange={(value) => handleFilterChange("sort", value)}>
      <SelectTrigger className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED] h-auto w-auto">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default_sort">Sort By</SelectItem>
        <SelectItem value="asc price">Price (low to high)</SelectItem>
        <SelectItem value="desc price">Price (high to low)</SelectItem>
        <SelectItem value="asc lastUpdated">Newest</SelectItem>
        <SelectItem value="desc lastUpdated">Oldest</SelectItem>
      </SelectContent>
    </Select>
  </div>
  );
};

export default Filter;
