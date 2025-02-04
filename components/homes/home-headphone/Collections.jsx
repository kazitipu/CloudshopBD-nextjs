"use client";

import { collections3 } from "@/data/categories";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import { getAllBrandsRedux } from "@/actions";
import "./collections.css";
const Collections = ({ getAllBrandsRedux, brands }) => {
  useEffect(() => {
    const fetchData = async () => {
      await getAllBrandsRedux();
    };
    fetchData();
  }, []);
  return (
    <section className="flat-spacing-10 flat-testimonial">
      <div className="container" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: 30,
            marginBottom: 20,
          }}
        >
          Top Brands
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {brands.map((brand, index) => (
            <div
              className="collection-item-circle has-bg hover-img each-box-flex"
              key={index}
            >
              <Link
                href={`/shop-default?brandId=${brand.id}&brandName=${brand.name}`}
                className="collection-image img-style"
                style={{
                  border: "3px solid #b89b00",
                }}
              >
                <Image
                  className="lazyload custom-image-style"
                  data-src={brand.logo}
                  alt={"image"}
                  src={brand.logo}
                  width={124}
                  height={125}
                />
              </Link>
              <div className="collection-content text-center">
                <Link
                  href={`/shop-default?brandId=${brand.id}&brandName=${brand.name}`}
                  className="link title fw-6"
                >
                  {brand.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
const mapStateToProps = (state) => {
  return {
    brands: state.brands.brands,
  };
};
export default connect(mapStateToProps, { getAllBrandsRedux })(Collections);
