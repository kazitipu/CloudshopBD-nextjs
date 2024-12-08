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
export default function BlogLeftSidebar() {
  return (
    <div className="container">
      <Announcmentbar />
      <div className="row">
        <div className="col-12">
          <div className="blog-sidebar-main" style={{ paddingTop: 10 }}>
            <Sidebar />
            <div className="list-blog">
              <Hero />

              <div style={{ marginTop: 20 }}>
                <Categories />
              </div>
              <div style={{ marginTop: 20 }}>
                <Collections2 />
              </div>

              <div style={{ marginTop: 20 }}>
                <Products first={true} />
              </div>

              <div>
                <Collections />
              </div>
              <div>
                <Banner />
              </div>
              <div style={{ marginTop: 20 }}>
                <Products />
              </div>

              <Products2 />

              <ul
                className="wg-pagination"
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Pagination2 />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
