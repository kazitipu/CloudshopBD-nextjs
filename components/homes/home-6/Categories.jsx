"use client";

import { collectionData3 } from "@/data/categories";
import { Swiper, SwiperSlide } from "swiper/react";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "swiper/modules";
import { connect } from "react-redux";
import { getAllTopCategoriesRedux } from "@/actions";
const Categories = ({ getAllTopCategoriesRedux, topCategories }) => {
  useEffect(() => {
    const fetchCategories = async () => {
      await getAllTopCategoriesRedux();
    };
    fetchCategories();
  }, []);
  return (
    <section
      className="flat-spacing-12"
      style={{ backgroundColor: "#faf8f2", borderRadius: 5 }}
    >
      <div className="container">
        <div
          className="flat-title flex-row justify-content-between align-items-center px-0 wow fadeInUp"
          data-wow-delay="0s"
          style={{ marginBottom: 30 }}
        >
          <h3 className="title" style={{ fontWeight: "bold" }}>
            Top Categories
          </h3>
          <Link href={`/shop-collection-sub`} className="tf-btn btn-line">
            View all categories
            <i className="icon icon-arrow1-top-left" />
          </Link>
        </div>
        <div className="hover-sw-nav hover-sw-2">
          <Swiper
            dir="ltr"
            className="tf-sw-collection"
            slidesPerView={6}
            breakpoints={{
              768: {
                slidesPerView: 6,
              },
              576: {
                slidesPerView: 3,
              },
              0: {
                slidesPerView: 2,
              },
            }}
            spaceBetween={15}
            loop={false}
            autoplay={false}
            modules={[Navigation]}
            navigation={{
              prevEl: ".snbp130",
              nextEl: ".snbn130",
            }}
          >
            {topCategories &&
              topCategories.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="collection-item-circle hover-img">
                    <Link
                      href={`/shop-collection-sub`}
                      className="collection-image img-style"
                      style={{ border: "3px solid rgb(184, 155, 0)" }}
                    >
                      <Image
                        className="lazyload"
                        data-src={item.logo}
                        alt={"Image"}
                        src={item.logo}
                        width={130}
                        height={130}
                      />
                    </Link>
                    <div
                      className="collection-content text-center"
                      style={{ marginTop: 10 }}
                    >
                      <Link
                        href={`/shop-collection-sub`}
                        className="link title fw-5"
                      >
                        {item.name}
                      </Link>
                      {/* <div className="count">12 items</div> */}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
          <div className="sw-dots style-2 sw-pagination-collection justify-content-center" />
          <div className="nav-sw nav-next-slider nav-next-collection snbp130">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-collection snbn130">
            <span className="icon icon-arrow-right" />
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    topCategories: state.categories.topCategories,
  };
};
export default connect(mapStateToProps, {
  getAllTopCategoriesRedux,
})(Categories);