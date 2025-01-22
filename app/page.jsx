import BlogLeftSidebar from "@/components/blogs/BlogLeftSidebar";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";
import Link from "next/link";
import {
  getAllCategories,
  getAllLatestProducts,
  getAllHomeScreenBestSelling,
  getAllBanners,
  getAllTopCategories,
  getAllCampaigns,
  getAllHomeScreenCategories,
  getAllHomeScreenProducts,
} from "@/firebase/firebase.utils";
export const metadata = {
  title:
    "CloudShopBD – Your Trusted Destination for Makeup & Skincare Essentials",
  description: "Your Trusted Destination for Makeup & Skincare Essentials",
};
export default async function page() {
  const categories = await getAllCategories();
  const latestProducts = await getAllLatestProducts();
  let category = categories.find((cat) => cat.name === "Top selling");
  let bestSelling;
  if (category) {
    bestSelling = await getAllHomeScreenBestSelling(category.id);
  }
  const banners = await getAllBanners();
  const topCategories = await getAllTopCategories();
  const campaigns = await getAllCampaigns();
  const homeCategories = await getAllHomeScreenCategories();
  let homeProducts = [];
  if (homeCategories && homeCategories.length > 0) {
    homeProducts = await Promise.all(
      homeCategories.map(async (category) => {
        const products = await getAllHomeScreenProducts(category.id);
        return { categoryId: category.id, products };
      })
    );
  }
  return (
    <>
      <Header2 />
      <BlogLeftSidebar
        categories={categories}
        latestProducts={latestProducts}
        bestSelling={bestSelling}
        bestSellingCategory={category}
        banners={banners}
        topCategories={topCategories}
        campaigns={campaigns}
        homeCategories={homeCategories}
        homeProducts={homeProducts}
      />
      <Footer1 />
    </>
  );
}
