import { ClockIcon, PackageIcon, TruckTrailerIcon } from "@phosphor-icons/react";
import React from "react";
import { FaClock, FaBox, FaTruck } from "react-icons/fa";

interface InfoBoxProps {
  processingText: string;
  dispatchingText: string;
  deliveryText: string;
  processingValue: string;
  dispatchValue: string;
  deliveryValue: string;
}

const ProcessingBox: React.FC<InfoBoxProps> = ({
  processingText,
  dispatchingText,
  deliveryText,
  processingValue,
  dispatchValue,
  deliveryValue
}) => {
  const items = [
    { icon: <ClockIcon size={25} weight="bold" />, text: processingText, value: processingValue },
    { icon: <TruckTrailerIcon size={25} weight="bold" />, text: dispatchingText, value: dispatchValue },
    { icon: <PackageIcon size={25} weight="bold" />, text: deliveryText, value: deliveryValue },
  ];

  return (
    <div className="mt-4 p-1">
      <div className="grid grid-cols-3 gap-2 text-center">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white/60 p-4 rounded-2xl shadow-md bg-gradient-to-r from-green-50 to-amber-50"
          >
            <span className="mb-2">{item.icon}</span>
            <span className="font-semibold text-xs">
              {item.value}
            </span>
            <span className="font-semibold text-xs">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingBox;
