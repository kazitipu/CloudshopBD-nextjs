import React from "react";

import ProductDetailPage from "@/components/shopDetails/ProductDetailPage";
export const metadata = {
  title: "CloudShopBD",
  description: "Product Details",
};

export default function page({ params }) {
  return <ProductDetailPage params={params} />;
}
