"use client";

import { products5 } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  getAllHomeScreenCategoriesRedux,
  getAllHomeScreenProductsRedux,
} from "@/actions";
const Products = ({
  getAllHomeScreenCategoriesRedux,
  homeCategories,
  getAllHomeScreenProductsRedux,
  homeProducts,
}) => {
  let firstCategories = [];
  let secondCategories = [];
  if (homeCategories) {
    firstCategories = homeCategories
      .filter((category) => category.homePosition < 4)
      .sort((a, b) => Number(a.homePosition) - Number(b.homePosition));
    secondCategories = homeCategories
      .filter((category) => category.homePosition > 3)
      .sort((a, b) => Number(a.homePosition) - Number(b.homePosition));
  }

  const getPrice = (product) => {
    if (product.displayedVariations.length > 0) {
      if (product.displayedVariations[0].salePrice == 0) {
        return (
          <>
            <div>৳{product.displayedVariations[0].price}</div>
            <div
              style={{
                flex: 0.5,
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div>৳0</div>
              <div>
                <div>0% Off</div>
              </div>
            </div>
          </>
        );
      } else {
        return (
          <>
            <div>৳{product.displayedVariations[0].salePrice}</div>
            <div
              style={{
                flex: 0.5,
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div>৳{product.displayedVariations[0].price}</div>
              <div>
                <div>
                  {parseInt(
                    100 -
                      (product.displayedVariations[0].salePrice /
                        product.displayedVariations[0].price) *
                        100
                  )}
                  % Off
                </div>
              </div>
            </div>
          </>
        );
      }
    } else {
      if (product.salePrice == 0) {
        return (
          <>
            <div>৳{product.price}</div>
            <div
              style={{
                flex: 0.5,
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div>৳{product.price}</div>
              <div>
                <div>0% Off</div>
              </div>
            </div>
          </>
        );
      } else {
        return (
          <>
            <div>৳{product.salePrice}</div>
            <div
              style={{
                flex: 0.5,
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div>৳{product.price}</div>
              <div>
                <div>
                  {parseInt(100 - (product.salePrice / product.price) * 100)}%
                  Off
                </div>
              </div>
            </div>
          </>
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
                    <div className="card-product style-skincare">
                      <div className="card-product-wrapper">
                        <a href={product.id} className="product-img">
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
                              product.pictures[1]
                                ? product.pictures[1]
                                : product.pictures[0]
                            }
                            alt="image-product"
                            src={
                              product.pictures[1]
                                ? product.pictures[1]
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
                      <div className="card-product-info text-center">
                        <Link
                          href={`/product-detail/${product.id}`}
                          className="title link"
                          style={{
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                          }}
                        >
                          {product.name.slice(0, 12)}
                        </Link>
                        <span className="price">
                          <span className="text_primary">
                            {getPrice(product)}
                          </span>
                        </span>

                        <div className="tf-product-btns">
                          <a
                            href="#quick_add"
                            onClick={() => {}}
                            data-bs-toggle="modal"
                            className="tf-btn style-3 radius-3 btn-fill animate-hover-btn"
                          >
                            Quick add
                          </a>
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
      {secondCategories.map((category, index) => {
        return (
          <section
            className="flat-spacing-9 bg_grey-6 flat-spacing-26"
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
                <ul
                  className="widget-tab-3 d-flex justify-content-center flex-wrap wow fadeInUp"
                  data-wow-delay="0s"
                  role="tablist"
                >
                  <li className="nav-tab-item" role="presentation">
                    <a className="active">{category.name}</a>
                  </li>
                </ul>
                {renderProducts(category)}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    homeCategories: state.categories.homeCategories,
    homeProducts: state.categories.homeProducts,
  };
};
export default connect(mapStateToProps, {
  getAllHomeScreenCategoriesRedux,
  getAllHomeScreenProductsRedux,
})(Products);
