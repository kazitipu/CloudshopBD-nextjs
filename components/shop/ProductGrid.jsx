import { products1 } from "@/data/products";
import React from "react";
import ProductCard from "../shopCards/ProductCard";

export default function ProductGrid({ gridItems, allproducts, nbHits }) {
  const array = new Array(50).fill(null);
  return (
    <>
      <div
        style={{
          width: "fit-content",
          margin: "0  auto",
          fontSize: "17px",
          marginBottom: "24px",
        }}
      >
        {nbHits > 0 ? nbHits : allproducts.length} product(s) found
      </div>
      <div className="grid-layout wrapper-shop" data-grid={`grid-${gridItems}`}>
        {/* card product 1 */}
        {allproducts.length > 0
          ? allproducts.map((elm, i) => (
              <ProductCard product={elm} key={i} gridItems={gridItems} />
            ))
          : array.map((elm, i) => (
              <ProductCard product={elm} key={i} gridItems={gridItems} />
            ))}
      </div>{" "}
    </>
  );
}
