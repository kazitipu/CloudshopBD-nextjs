"use client";

import { ProductCard } from "@/components/shopCards/ProductCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { products1 } from "@/data/products";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { addToWishlistRedux, removeFromWishlistRedux } from "@/actions";
import toast from "react-hot-toast";
const Products = ({
  latestProducts,
  addToWishlistRedux,
  removeFromWishlistRedux,
  currentUser,
  wishlist,
}) => {
  const router = useRouter();
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

  return (
    <section
      className="flat-spacing-8"
      style={{ paddingTop: 35, paddingBottom: 35 }}
    >
      <div className="container" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="flat-animate-tab">
          <ul
            className="widget-tab-3 d-flex justify-content-center wow fadeInUp"
            style={{ marginBottom: 30 }}
          >
            <li className="nav-tab-item" role="presentation">
              <a className="active">New Arrival</a>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane active show">
              <div className="grid-layout " data-grid="grid-5">
                {latestProducts.length > 0 &&
                  latestProducts.map((product, i) => (
                    <div
                      className="card-product style-skincare"
                      style={{
                        position: "relative",
                        border: "1px solid gainsboro",
                      }}
                      onClick={() => {
                        router.push(
                          `/product-swatch-image-rounded/${product.id}`
                        );
                      }}
                      key={i}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                wishlist &&
                                wishlist.length > 0 &&
                                wishlist.find((wish) => wish.id == product.id)
                              ) {
                                removeFromWishlistRedux(product, currentUser);
                                toast("Item removed from wishlist");
                              } else {
                                addToWishlistRedux(product, currentUser);
                                toast("Item added to Wishlist");
                              }
                            }}
                            className="box-icon bg_white wishlist btn-icon-action"
                          >
                            <span
                              className={`icon icon-heart`}
                              style={{
                                color:
                                  wishlist &&
                                  wishlist.length > 0 &&
                                  wishlist.find((wish) => wish.id == product.id)
                                    ? "red"
                                    : "",
                              }}
                            />
                            <span className="tooltip">
                              {wishlist &&
                              wishlist.length > 0 &&
                              wishlist.find((wish) => wish.id == product.id)
                                ? "Added to Wishlist"
                                : "Add to Wishlist"}
                            </span>
                            <span className="icon icon-delete" />
                          </a>
                        </div>
                      </div>
                      <div
                        className="card-product-info text-center"
                        style={{
                          padding: 10,
                          paddingBottom: 5,
                        }}
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
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.users.currentUser,
    wishlist: state.wishlist.wishlist,
  };
};
export default connect(mapStateToProps, {
  addToWishlistRedux,
  removeFromWishlistRedux,
})(Products);
