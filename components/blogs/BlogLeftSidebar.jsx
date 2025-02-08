"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Image from "next/image";
import Link from "next/link";
import { blogArticles6 } from "@/data/blogs";
import Pagination2 from "../common/Pagination2";
import Hero from "@/components/homes/home-2/Hero";
import Products from "@/components/homes/home-skincare/Products";
import Categories from "@/components/homes/home-6/Categories";
import Brands from "@/components/homes/home-2/Brands";
import Collections from "../homes/home-headphone/Collections";
import Features from "@/components/common/Features";
import Marquee from "@/components/homes/home-1/Marquee";
import Banner from "@/components/homes/home-headphone/Banner";
import Products2 from "@/components/homes/home-6/Products";
import Collections2 from "@/components/homes/home-headphone/Collections2";
import Announcmentbar from "../common/Announcmentbar";
import {
  getAllHomeScreenProducts,
  updateAlgoliaRecords,
} from "@/firebase/firebase.utils";
import {
  getAllLatestProductsRedux,
  getAllTopCategoriesRedux,
  getAllCampaignsRedux,
  getAllHomeScreenCategoriesRedux,
  getAllHomeScreenProductsRedux,
} from "@/actions";
import { connect } from "react-redux";
const BlogLeftSidebar = ({
  categories,
  latestProducts,
  bestSelling,
  banners,
  topCategories,
  campaigns,
  homeCategories,
  bestSellingCategory,
  getAllLatestProductsRedux,
  getAllTopCategoriesRedux,
  getAllCampaignsRedux,
  getAllHomeScreenCategoriesRedux,
  getAllHomeScreenProductsRedux,
}) => {
  const [homeProducts, setHomeProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await getAllTopCategoriesRedux();
      await getAllCampaignsRedux();
      await getAllHomeScreenCategoriesRedux();
      setTimeout(async () => {
        await getAllLatestProductsRedux();
      }, 1000);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      if (homeCategories && homeCategories.length > 0) {
        console.time("homeProducts");
        const products = await getAllHomeScreenProducts();
        let homeProducts = await Promise.all(
          homeCategories.map(async (category) => {
            const products2 = products.filter(
              (product) => product.categoryId == category.id
            );
            return { categoryId: category.id, products: products2 };
          })
        );

        console.timeEnd("homeProducts"); // End the timer and log the time taken
        setHomeProducts(homeProducts);
      }
    };
    fetchProducts();
  }, [homeCategories]);
  console.log(latestProducts);
  return (
    <div className="container">
      <Announcmentbar />
      <div className="row">
        <div className="col-12">
          <div className="blog-sidebar-main" style={{ paddingTop: 10 }}>
            <Sidebar
              categories={categories}
              latestProducts={latestProducts}
              bestSelling={bestSelling}
              bestSellingCategory={bestSellingCategory}
            />
            <div className="list-blog">
              <Hero banners={banners} />

              <div style={{ marginTop: 20 }}>
                <Categories topCategories={topCategories} />
              </div>
              <div style={{ marginTop: 20 }}>
                <Collections2 campaigns={campaigns} />
              </div>

              <div style={{ marginTop: 20 }}>
                <Products
                  first={true}
                  homeCategories={homeCategories}
                  homeProducts={homeProducts}
                />
              </div>

              <div>
                <Collections />
              </div>
              <div>
                <Banner banners={banners} />
              </div>
              <div style={{ marginTop: 20 }}>
                <Products
                  homeCategories={homeCategories}
                  homeProducts={homeProducts}
                />
              </div>

              <Products2 latestProducts={latestProducts} />

              <ul
                className="wg-pagination"
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  textDecoration: "underline",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 22,
                }}
              >
                <Link href={`/shop-default?categoryId=latest`}>See all</Link>
                {/* <Pagination2 /> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    latestProducts: state.categories.latestProducts,
    topCategories: state.categories.topCategories,
    campaigns: state.categories.campaigns,
    homeCategories: state.categories.homeCategories,
    homeProducts: state.categories.homeProducts,
  };
};
export default connect(mapStateToProps, {
  getAllLatestProductsRedux,
  getAllTopCategoriesRedux,
  getAllCampaignsRedux,
  getAllHomeScreenCategoriesRedux,
  getAllHomeScreenProductsRedux,
})(BlogLeftSidebar);
