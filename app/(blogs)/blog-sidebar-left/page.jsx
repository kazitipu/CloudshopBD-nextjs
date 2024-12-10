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
  title: "Blog  Sidebar Left || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default async function page() {
  const categories = await getAllCategories();
  const latestProducts = await getAllLatestProducts();
  const bestSelling = await getAllHomeScreenBestSelling("1697451881986");
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
