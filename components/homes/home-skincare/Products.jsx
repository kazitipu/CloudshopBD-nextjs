"use client";

import { products5 } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContextElement } from "@/context/Context";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./products.css";

const Products = ({ homeCategories, homeProducts, first }) => {
  let firstCategories = [];
  const router = useRouter();
  let secondCategories = [];
  if (homeCategories) {
    firstCategories = homeCategories
      .filter((category) => category.homePosition < 4)
      .sort((a, b) => Number(a.homePosition) - Number(b.homePosition));
    secondCategories = homeCategories
      .filter((category) => category.homePosition > 3)
      .sort((a, b) => Number(a.homePosition) - Number(b.homePosition));
  }
  let renderableCategories = first ? firstCategories : secondCategories;

  const getPrice = (product) => {
    if (product.displayedVariations.length > 0) {
      if (product.displayedVariations[0].salePrice == 0) {
        return (
          <div>
            <div style={{ textAlign: "left", color: "white", fontSize: 11 }}>
              ৳0
            </div>
            <div
              style={{ textAlign: "left", fontWeight: "bold", marginTop: -5 }}
            >
              ৳{product.displayedVariations[0].price}
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div style={{ textAlign: "left", color: "#999", fontSize: 11 }}>
              <del>৳{product.displayedVariations[0].price}</del>
            </div>
            <div
              style={{ textAlign: "left", fontWeight: "bold", marginTop: -5 }}
            >
              ৳{product.displayedVariations[0].salePrice}
            </div>

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 10,
                height: 30,
                width: 30,
                backgroundImage: "url(/images/offer.svg)",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  color: "white",
                  fontSize: 9,
                  marginTop: -2,
                }}
              >
                {parseInt(
                  100 -
                    (product.displayedVariations[0].salePrice /
                      product.displayedVariations[0].price) *
                      100
                )}
                %
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: 9,
                  marginTop: -12,
                }}
              >
                Off
              </div>
            </div>
          </div>
        );
      }
    } else {
      if (product.salePrice == 0) {
        return (
          <div>
            <div style={{ textAlign: "left", color: "white", fontSize: 11 }}>
              ৳{product.price}
            </div>

            <div
              style={{ textAlign: "left", fontWeight: "bold", marginTop: -5 }}
            >
              ৳{product.price}
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div style={{ textAlign: "left", color: "#999", fontSize: 11 }}>
              <del>৳{product.price}</del>
            </div>
            <div
              style={{ textAlign: "left", fontWeight: "bold", marginTop: -5 }}
            >
              ৳{product.salePrice}
            </div>

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 10,
                height: 30,
                width: 30,
                backgroundImage: "url(/images/offer.svg)",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  color: "white",
                  fontSize: 9,
                  marginTop: -2,
                }}
              >
                {parseInt(100 - (product.salePrice / product.price) * 100)}%
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: 9,
                  marginTop: -12,
                }}
              >
                Off
              </div>
            </div>
          </div>
        );
      }
    }
  };

  const renderProducts = (category) => {
    let renderableProducts = [];
    if (homeProducts && homeProducts.length > 0) {
      let products = homeProducts.find(
        (product) => product.categoryId == category.id
      );
      if (products) {
        renderableProducts = products.products;
      }
    }
    console.log(homeProducts);
    return (
      <div className="tab-content">
        <div className="tab-pane active show" id="essentials" role="tabpanel">
          <div className="wrap-carousel">
            <Swiper
              dir="ltr"
              spaceBetween={30}
              slidesPerView={5}
              breakpoints={{
                768: { slidesPerView: 5 },
                576: { slidesPerView: 3 },
                0: { slidesPerView: 2 },
              }}
              modules={[Navigation, Pagination]}
              navigation={{
                prevEl: `.snbp265-${category.id}`,
                nextEl: `.snbn265-${category.id}`,
              }}
              pagination={{ clickable: true, el: `.spd265-${category.id}` }}
            >
              {renderableProducts.length > 0 &&
                renderableProducts.map((product) => (
                  <SwiperSlide key={product.id}>
                    <div
                      className="card-product style-skincare"
                      style={{ position: "relative" }}
                      onClick={() => {
                        router.push(
                          `/product-swatch-image-rounded/${product.id}`
                        );
                      }}
                    >
                      <div className="card-product-wrapper">
                        <a className="product-img fixed-height">
                          <Image
                            className="lazyload img-product"
                            data-src={product.imgSrc}
                            alt="image-product"
                            src={product.pictures[0]}
                            width={360}
                            height={384}
                          />
                          <Image
                            className="lazyload img-hover"
                            data-src={
                              product.pictures2 &&
                              product.pictures2[0] &&
                              product.pictures2[0] !=
                                "/static/media/addProduct.3dff302b.png"
                                ? product.pictures2[0]
                                : product.pictures[0]
                            }
                            alt="image-product"
                            src={
                              product.pictures2 &&
                              product.pictures2[0] &&
                              product.pictures2[0] !=
                                "/static/media/addProduct.3dff302b.png"
                                ? product.pictures2[0]
                                : product.pictures[0]
                            }
                            width={360}
                            height={384}
                          />
                        </a>
                        <div className="list-product-btn">
                          <a
                            onClick={() => {}}
                            className="box-icon bg_white wishlist btn-icon-action"
                          >
                            <span className={`icon icon-heart`} />
                            <span className="tooltip">Add to Wishlist</span>
                            <span className="icon icon-delete" />
                          </a>
                          <a
                            href="#compare"
                            data-bs-toggle="offcanvas"
                            aria-controls="offcanvasLeft"
                            onClick={() => {}}
                            className="box-icon bg_white compare btn-icon-action"
                          >
                            <span className={`icon icon-compare`} />
                            <span className="tooltip">Add to Compare</span>
                            <span className="icon icon-check" />
                          </a>
                          <a
                            href="#quick_view"
                            onClick={() => {}}
                            data-bs-toggle="modal"
                            className="box-icon bg_white quickview tf-btn-loading"
                          >
                            <span className="icon icon-view" />
                            <span className="tooltip">Quick View</span>
                          </a>
                        </div>
                      </div>
                      <div
                        className="card-product-info text-center"
                        style={{ padding: 10, paddingBottom: 5 }}
                      >
                        <Link
                          href={`/product-detail/${product.id}`}
                          className="title link"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                            textAlign: "left",
                            minHeight: "2.4em", // Minimum height to account for 2 lines
                            lineHeight: "1.2em",
                            fontWeight: "bold",
                            color: "#555",
                          }}
                        >
                          {product.name}
                        </Link>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 10,
                          }}
                        >
                          {getPrice(product)}

                          <div
                            className="tf-product-btns"
                            style={{ marginTop: 0 }}
                          >
                            <a
                              href="#quick_add"
                              onClick={() => {}}
                              data-bs-toggle="modal"
                              className="tf-btn radius-3 btn-fill animate-hover-btn"
                              style={{ padding: "8px 10px", fontSize: 13 }}
                            >
                              ADD
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
            <div
              className={`nav-sw style-not-line nav-next-slider nav-next-sell-1 box-icon w_46 round snbp265-${category.id}`}
            >
              <span className="icon icon-arrow-left" />
            </div>
            <div
              className={`nav-sw style-not-line nav-prev-slider nav-prev-sell-1 box-icon w_46 round snbn265-${category.id}`}
            >
              <span className="icon icon-arrow-right" />
            </div>
            <div
              className={`sw-dots style-2 sw-pagination-sell-1 justify-content-center spd265-${category.id}`}
            />
          </div>
        </div>
      </div>
    );
  };
  const colors = ["#d6ecff", "#e1d7fe", "#d7fdff"];
  return (
    <>
      {renderableCategories.map((category, index) => {
        return (
          <section
            className="flat-spacing-9 flat-spacing-26"
            style={{
              marginTop: 20,
              background: colors[index],
              paddingTop: 20,
              paddingBottom: 15,
              borderRadius: 10,
            }}
            key={index}
          >
            <div className="container">
              <div className="flat-tab-store flat-animate-tab overflow-unset">
                <div
                  className="widget-tab-3 d-flex  flex-wrap wow fadeInUp"
                  data-wow-delay="0s"
                  role="tablist"
                  style={{ marginBottom: 10, justifyContent: "space-between" }}
                >
                  <div className="nav-tab-item" role="presentation">
                    <a className="active" style={{ borderBottom: 0 }}>
                      {category.name}
                    </a>
                  </div>
                  <div className="see-all">
                    <Link
                      style={{
                        textDecoration: "underline",
                        fontWeight: "bold",
                      }}
                      href={`/shop-default?categoryId=${category.id}`}
                    >
                      See all
                    </Link>
                  </div>
                </div>
                {renderProducts(category)}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
};

export default Products;
