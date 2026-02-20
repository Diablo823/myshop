"use client";

import { products } from "@wix/stores";
import { useEffect, useState } from "react";
import Add from "./Add";

const CustomizeProducts = ({
  productId,
  variants,
  productOptions,
  selectedOptions,
  setSelectedOptions,
}: {
  productId: string;
  variants: products.Variant[];
  productOptions: products.ProductOption[];
  selectedOptions: Record<string, string>;
  setSelectedOptions: (options: Record<string, string>) => void;
}) => {
  // Early return if no real options or variants
  if (
    !productOptions || productOptions.length === 0 ||
    !variants || variants.length === 0 ||
    (variants.length === 1 && variants[0]._id === "00000000-0000-0000-0000-000000000000")
  ) {
    return (
      <Add
        productId={productId}
        variantId="00000000-0000-0000-0000-000000000000"
        stockNumber={0}
      />
    );
  }

  const [selectedVariant, setSelectedVariant] = useState<products.Variant>();

  useEffect(() => {
    const variant = variants.find((v) => {
      const variantChoices = v.choices;
      if (!variantChoices) return false;
      return Object.entries(selectedOptions).every(
        ([key, value]) => variantChoices[key] === value
      );
    });
    setSelectedVariant(variant);

    // If current selection is not in stock, try to find an alternative
    if (!variant || !variant.stock?.inStock || !variant.stock?.quantity || variant.stock.quantity <= 0) {
      // Find the first available variant that matches as many current selections as possible
      const availableVariant = variants.find((v) =>
        v.stock?.inStock &&
        v.stock?.quantity &&
        v.stock.quantity > 0 &&
        v.choices
      );

      if (availableVariant && availableVariant.choices) {
        // Only update if the current selection is actually unavailable
        const currentIsUnavailable = !variant || !variant.stock?.inStock || !variant.stock?.quantity || variant.stock.quantity <= 0;

        if (currentIsUnavailable) {
          setSelectedOptions(availableVariant.choices);
        }
      }
    }
  }, [selectedOptions, variants, setSelectedOptions]);

  const handleOptionSelect = (optionType: string, choice: string) => {
    setSelectedOptions({ ...selectedOptions, [optionType]: choice });
  };

  const isVariantInStock = (choices: { [key: string]: string }) => {
    return variants.some((variant) => {
      const variantChoices = variant.choices;
      if (!variantChoices) return false;

      return (
        Object.entries(choices).every(
          ([key, value]) => variantChoices[key] === value
        ) &&
        variant.stock?.inStock &&
        variant.stock?.quantity &&
        variant.stock?.quantity > 0
      );
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {productOptions.map((option) => (
        <div className="flex flex-col gap-3" key={option.name}>
          <h4 className="font-medium text-sm text-gray-900">Choose a {option.name}</h4>
          <ul className="flex items-center gap-2 flex-wrap">
            {option.choices?.map((choice) => {
              const disabled = !isVariantInStock({
                ...selectedOptions,
                [option.name!]: choice.description!,
              });

              const selected =
                selectedOptions[option.name!] === choice.description;

              const clickHandler = disabled
                ? undefined
                : () => handleOptionSelect(option.name!, choice.description!);

              return option.name === "Color" ? (
                <li
                  className={`w-9 h-9 rounded-full ring-2 relative transition-all duration-200 ${selected
                      ? "ring-gray-900 ring-offset-2"
                      : "ring-gray-300"
                    }`}
                  style={{
                    backgroundColor: choice.value,
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                  onClick={clickHandler}
                  key={choice.description}
                >
                  {selected && (
                    <div className="absolute inset-0 rounded-full ring-2 ring-gray-900 ring-offset-2" />
                  )}
                  {disabled && (
                    <div className="absolute w-full h-0.5 bg-red-500 rotate-45 top-1/2 left-0 transform -translate-y-1/2" />
                  )}
                </li>
              ) : (
                <li
                  className={`rounded-lg py-2 px-4 text-xs md:text-sm font-medium transition-all duration-200 ${selected
                      ? "bg-gray-900 text-white"
                      : disabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200 cursor-pointer"
                    }`}
                  key={choice.description}
                  onClick={clickHandler}
                >
                  {choice.description}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <Add
        productId={productId}
        variantId={
          selectedVariant?._id || "00000000-0000-0000-0000-000000000000"
        }
        stockNumber={selectedVariant?.stock?.quantity || 0}
      />
    </div>
  );

};

export default CustomizeProducts;