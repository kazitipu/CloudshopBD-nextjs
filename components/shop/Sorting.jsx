"use client";

import { sortingOptions } from "@/data/shop";
import React, { useEffect, useState } from "react";

export default function Sorting({ products, setFinalSorted }) {
  const [selectedOptions, setSelectedOptions] = useState(sortingOptions[0]);
  const getPrice = (product) => {
    if (product.displayedVariations.length > 0) {
      if (product.displayedVariations[0].salePrice == 0) {
        return product.displayedVariations[0].price;
      } else {
        return product.displayedVariations[0].salePrice;
      }
    } else {
      if (product.salePrice == 0) {
        return product.price;
      } else {
        return product.salePrice;
      }
    }
  };
  let sortableProducts = products.map((product) => {
    let price = getPrice(product);
    return {
      ...product,
      sortedPrice: price,
    };
  });
  useEffect(() => {
    if (selectedOptions.text == "Default") {
      setFinalSorted([...products]);
    } else if (selectedOptions.text == "Alphabetically, A-Z") {
      setFinalSorted(
        [...products].sort((a, b) => a.name.localeCompare(b.name))
      );
    } else if (selectedOptions.text == "Alphabetically, Z-A") {
      setFinalSorted(
        [...products].sort((a, b) => b.name.localeCompare(a.name))
      );
    } else if (selectedOptions.text == "Price, low to high") {
      setFinalSorted(
        sortableProducts.sort((a, b) => a.sortedPrice - b.sortedPrice)
      );
    } else if (selectedOptions.text == "Price, high to low") {
      setFinalSorted(
        sortableProducts.sort((a, b) => b.sortedPrice - a.sortedPrice)
      );
    }
  }, [products, selectedOptions]);

  return (
    <>
      {" "}
      <div className="btn-select">
        <span className="text-sort-value">{selectedOptions.text}</span>
        <span className="icon icon-arrow-down" />
      </div>
      <div className="dropdown-menu">
        {sortingOptions.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedOptions(item)}
            className={`select-item ${item == selectedOptions ? "active" : ""}`}
          >
            <span className="text-value-item">{item.text}</span>
          </div>
        ))}
      </div>
    </>
  );
}
