import { paymentIcons } from "@/constants";
import { ClockIcon, PackageIcon, TruckTrailerIcon } from "@phosphor-icons/react";
import React from "react";
import { FaShieldAlt, FaUndoAlt, FaLock } from "react-icons/fa";

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
  deliveryValue,
}) => {
  const items = [
    {
      icon: <ClockIcon size={20} weight="bold" />,
      text: processingText,
      value: processingValue,
      iconBg: "bg-violet-100 text-violet-600",
      valueBg: "text-violet-700",
    },
    {
      icon: <TruckTrailerIcon size={20} weight="bold" />,
      text: dispatchingText,
      value: dispatchValue,
      iconBg: "bg-blue-100 text-blue-600",
      valueBg: "text-blue-700",
    },
    {
      icon: <PackageIcon size={20} weight="bold" />,
      text: deliveryText,
      value: deliveryValue,
      iconBg: "bg-emerald-100 text-emerald-600",
      valueBg: "text-emerald-700",
    },
  ];

  const trustBadges = [
    {
      icon: <FaShieldAlt size={18} className="text-emerald-600" />,
      text: "SSL Secure",
      iconBg: "bg-emerald-50",
      textClass: "text-emerald-800",
    },
    {
      icon: <FaUndoAlt size={18} className="text-blue-600" />,
      text: "30-Day Returns",
      iconBg: "bg-blue-50",
      textClass: "text-blue-800",
    },
  ];

  return (
    <div className="mt-4 p-1 space-y-3">

      {/* ── Promo Banner ── */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg shadow-violet-200/60">
        {/* gradient border via outer div */}
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-px rounded-2xl">
          <div className="bg-gradient-to-r from-violet-600/95 via-indigo-600/95 to-blue-600/95 backdrop-blur-sm rounded-[calc(1rem-1px)] px-4 py-3 text-white text-center space-y-1.5">
            <p className="text-sm font-bold tracking-wide">
              🚚 Free Shipping on Orders Over ₹650
            </p>
            <div className="h-px bg-white/20 mx-6" />
            <p className="text-xs text-indigo-100 font-medium">
              Add products to your cart now
            </p>
            <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 px-3 py-1 rounded-full text-[12px] font-bold tracking-widest">
              🏷️ Use Code:{" "}
              <span className="text-yellow-300 font-extrabold">FREEUS</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Timeline Cards: Processing / Dispatch / Delivery ── */}
      <div className="grid grid-cols-3 gap-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="group flex flex-col items-center bg-white border border-gray-100 p-3 rounded-2xl shadow-sm
                       hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
          >
            <span
              className={`w-10 h-10 flex items-center justify-center rounded-xl mb-2 
                          ${item.iconBg} transition-transform duration-200 group-hover:scale-110`}
            >
              {item.icon}
            </span>
            <span className={`font-extrabold text-xs ${item.valueBg} leading-snug`}>
              {item.value}
            </span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5 text-center leading-tight">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* ── Payment Icons ── */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-3">
          Secured Payments
        </p>
        <div className="flex justify-center items-center gap-2.5 flex-wrap">
          {paymentIcons.map((payment, index) => (
            <span
              key={index}
              className="flex items-center justify-center w-11 h-7 rounded-lg bg-gray-50
                         border border-gray-100 hover:border-violet-300 hover:bg-violet-50
                         transition-colors duration-150 cursor-pointer"
            >
              <payment.icon size={28} color="#6d28d9" />
            </span>
          ))}
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] font-semibold text-gray-400">
          <FaLock className="text-emerald-500" size={9} />
          <span>
            Secured by{" "}
            <span className="text-violet-600 font-bold">Razorpay</span>
          </span>
        </div>
      </div>

      {/* ── Trust Badges ── */}
      {/* <div className="grid grid-cols-2 gap-2">
        {trustBadges.map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100
                       shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <span
              className={`w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 ${badge.iconBg}`}
            >
              {badge.icon}
            </span>
            <span className={`text-xs font-semibold ${badge.textClass} leading-tight`}>
              {badge.text}
            </span>
          </div>
        ))}
      </div> */}

    </div>
  );
};

export default ProcessingBox;
