"use client";
import Image from "next/image";
import { slidesData } from "@/data/heroslides";
import React, { useEffect } from "react";
import Link from "next/link";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getAllBannersRedux } from "@/actions";
import { connect } from "react-redux";
import "./hero.css";
const Hero = ({ getAllBannersRedux, banners }) => {
  useEffect(() => {
    const fetchBanner = async () => {
      await getAllBannersRedux();
    };
    fetchBanner();
  }, []);
  console.log(banners);
  let images = [];
  if (banners && banners.length > 0) {
    images = banners
      .filter((banner) => !banner.secondBanner)
      .map((banner) => banner.banner);
  }
  return (
    <div className="tf-slideshow slider-home-2 slider-effect-fade position-relative">
      <Swiper
        dir="ltr"
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        speed={1000}
        centeredSlides={false}
        modules={[Pagination]}
        pagination={{ clickable: true, el: ".spb1" }}
        breakpoints={{
          1024: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 1,
          },
        }}
        className="tf-sw-slideshow"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="wrap-slider">
              <Image
                className="lazyload"
                data-src={image}
                src={image}
                alt={""}
                priority
                width={2000}
                height={1034}
              />
              {/* <div className="box-content">
                <div className="container">
                  <h1 className="fade-item fade-item-1">
                    {slide.title.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </h1>
                  <p className="fade-item fade-item-2">{slide.description}</p>
                  <Link
                    href={`/shop-default`}
                    className="fade-item fade-item-3 tf-btn btn-fill animate-hover-btn btn-xl radius-3"
                  >
                    <span>Shop collection</span>
                    <i className="icon icon-arrow-right" />
                  </Link>
                </div>
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="wrap-pagination sw-absolute-2">
        <div className="container">
          <div className="sw-dots spb1 sw-pagination-slider" />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    banners: state.categories.banners,
  };
};
export default connect(mapStateToProps, { getAllBannersRedux })(Hero);
