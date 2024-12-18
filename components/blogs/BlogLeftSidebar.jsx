"use client";

import React from "react";
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

export default function BlogLeftSidebar({
  categories,
  latestProducts,
  bestSelling,
  banners,
  topCategories,
  campaigns,
  homeCategories,
  homeProducts,
  bestSellingCategory,
}) {
  return (
    <div className="container">
      <Announcmentbar />
      <div className="row">
        <div className="col-12">
          <div className="blog-sidebar-main" style={{ paddingTop: 10 }}>
            <Sidebar
              categories={categories}
              latestProducts={latestProducts.productsArray}
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

              <Products2 latestProducts={latestProducts.productsArray} />

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
}
