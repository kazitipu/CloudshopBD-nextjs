import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import ShopDefault from "@/components/shop/ShopDefault";
import React from "react";
import {
  getAllCategories,
  getAllLatestProducts,
} from "@/firebase/firebase.utils";

export const metadata = {
  title: "Product Default || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default async function page({ searchParams }) {
  const categoryId = searchParams.categoryId;
  let categories = [];
  let category = null;
  let results = [];
  let categoriesById = [];

  const getAllChildCategories = (categoryId) => {
    const targetId = categoryId;
    const results = [];
    for (const cat of categories) {
      let c = cat;
      while (c && c.parentCategory) {
        c = c.parentCategory && categoriesById.get(c.parentCategory);
        if (c && c.id === targetId) {
          results.push(cat);
          break;
        }
      }
    }
    return results;
  };

  // jodi latest na hoy tokhon egula setup korbo category wise product fetching korar jonno onnothay direct getAllLatestProducts call shopDefault component er useEffect te
  if (categoryId !== "latest") {
    categories = await getAllCategories();
    category = categories.find((cat) => cat.id === categoryId);
    if (categories.length > 0) {
      categoriesById = new Map(
        categories.map((category) => [category.id, category])
      );
      results = [category, ...getAllChildCategories(categoryId)];
    }
  }

  return (
    <>
      <Header2 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">
            {categoryId === "latest" ? "New Arrival" : category.name}
          </div>
          <p className="text-center text-2 text_black-2 mt_5">
            {categoryId === "latest"
              ? "Shop through our latest selection of Fashion"
              : ""}
          </p>
        </div>
      </div>
      <ShopDefault
        categories={categories}
        category={category}
        categoryId={categoryId}
        results={results}
      />
      <Footer1 />
    </>
  );
}
