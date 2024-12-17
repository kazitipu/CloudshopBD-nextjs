import React from "react";

import ProductDetailPage from "@/components/shopDetails/ProductDetailPage";
export const metadata = {
  title:
    "Product Swatch Image Rounded || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};

export default function page({ params }) {
  return <ProductDetailPage params={params} />;
}
