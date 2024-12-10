"use client";
import React from "react";
import { recentCollections3 } from "@/data/categories";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";

const Collections2 = ({ campaigns }) => {
  return (
    <section>
      <div className="container" style={{ paddingRight: 0, paddingLeft: 0 }}>
        <Swiper
          dir="ltr"
          slidesPerView={3}
          breakpoints={{
            576: { slidesPerView: 3 },
            0: { slidesPerView: 1.3 },
          }}
          modules={[Autoplay]}
          spaceBetween={15}
          autoplay={{ delay: 3000 }}
          className="tf-sw-recent"
        >
          {campaigns.map((campaign, index) => (
            <SwiperSlide key={index}>
              <div className="collection-item-v4 lg hover-img">
                <div className="collection-inner">
                  <Link
                    href={`/shop-collection-sub`}
                    className="radius-20 collection-image img-style"
                  >
                    <Image
                      className="lazyload"
                      data-src={campaign.image}
                      alt={"image"}
                      src={campaign.image}
                      width={600}
                      height={771}
                      style={{ minHeight: 350, maxHeight: 350 }}
                    />
                  </Link>
                  <div
                    className="collection-content wow fadeInUp"
                    data-wow-delay="0s"
                  >
                    <p className="subheading text_white">{campaign.name}</p>
                    <h5 className="heading text_white fw-6">
                      {campaign.categoryId}
                    </h5>
                    <Link
                      href={`/shop-collection-sub`}
                      className="rounded-full tf-btn style-3 fw-6 btn-light-icon animate-hover-btn"
                    >
                      <span>Shop now</span>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Collections2;
