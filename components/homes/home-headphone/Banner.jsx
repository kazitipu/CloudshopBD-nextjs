"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { connect } from "react-redux";

const Banner = ({ banners }) => {
  useEffect(() => {}, []);

  let image = null;
  if (banners && banners.length > 0) {
    image = banners.find((banner) => banner.secondBanner).banner;
  }

  return (
    <>
      {image && (
        <section className="flat-spacing-8 pb_0">
          <div
            className="container"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <div className="tf-banner-collection">
              <Image
                className="lazyload"
                data-src={image}
                alt="img-banner"
                loading="lazy"
                src={image}
                width={2000}
                height={561}
              />
              {/* <div className="box-content">
                <div className="container wow fadeInUp" data-wow-delay="0s">
                  <div className="sub fw-7 text_white">
                    ECOMUS HEADPHONE DESIGN
                  </div>
                  <h2 className="heading fw-6 text_white">
                    Uniting Performance
                  </h2>
                  <p className="text_white">
                    Fast wireless charging on-the-go.
                  </p>
                  <Link
                    href={`/shop-default`}
                    className="rounded-full tf-btn style-3 fw-6 btn-light-icon animate-hover-btn"
                  >
                    <span>Shop Collection</span>
                  </Link>
                </div>
              </div> */}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    banners: state.categories.banners,
  };
};

export default connect(mapStateToProps, {})(Banner);
