import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Brands from "@/components/othersPages/brands/Brands";
import Categories from "@/components/othersPages/categories/Categories";
import React from "react";

export const metadata = {
  title: "Brands || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function page() {
  return (
    <>
      <Header2 />
      <div className="tf-page-title ">
        <div className="container-full">
          <div className="heading text-center">All Categories</div>
        </div>
      </div>

      <Categories />
      <Footer1 />
    </>
  );
}
