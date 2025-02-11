"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { tfLoopItems } from "@/data/products";
import { connect } from "react-redux";
import { useEffect } from "react";
import {
  getAllLatestProductsRedux,
  getAllHomeScreenBestSellingRedux,
} from "@/actions";
const SearchModal = ({
  getAllLatestProductsRedux,
  getAllHomeScreenBestSellingRedux,
  latestProducts,
  bestSelling,
}) => {
  useEffect(() => {
    const fetchProducts = async () => {
      getAllLatestProductsRedux();
      getAllHomeScreenBestSellingRedux("1697451881986");
    };
    fetchProducts();
  }, []);
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
          </div>
        );
      }
    }
  };

  return (
    <div className="offcanvas offcanvas-end canvas-search" id="canvasSearch">
      <div className="canvas-wrapper">
        <header className="tf-search-head">
          <div className="title fw-5">
            Explore Products
            <div className="close">
              <span
                className="icon-close icon-close-popup"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
          </div>
        </header>
        <div className="canvas-body p-0">
          <div className="tf-search-content">
            <div
              className="sidebar-item sidebar-post"
              style={{
                border: "1px solid gainsboro",
                padding: 10,
                paddingBottom: 20,
              }}
            >
              <div
                className="sidebar-title"
                style={{
                  borderBottom: "2px solid #ee365a",
                  color: "#ee365a",
                  fontWeight: "bold",
                }}
              >
                Latest Products
              </div>
              <div className="sidebar-content">
                {latestProducts && latestProducts.length > 0 && (
                  <ul>
                    {latestProducts.slice(0, 3).map((product, index) => (
                      <li
                        key={index}
                        style={{
                          paddingBottom: 20,
                          paddingTop: 10,
                          borderBottom: "1px solid gainsboro",
                        }}
                      >
                        <div className="blog-article-item style-sidebar">
                          <div
                            style={{
                              border: "1px solid gainsboro",
                              backgroundImage: `url(${product.pictures[0]})`,
                              backgroundSize: "contain",
                              maxHeight: 100,
                              minHeight: 100,
                              maxWidth: 100,
                              minWidth: 100,
                              borderRadius: 5,
                            }}
                          ></div>

                          <div className="article-content">
                            <div
                              style={{
                                fontWeight: "bold",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                                lineHeight: "1.5em",
                                height: "3em", // 2 lines * line height
                                textOverflow: "ellipsis",
                              }}
                            >
                              {product.name}
                            </div>
                            <div>{getPrice(product)}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        paddingRight: 12,
                      }}
                    >
                      <Link
                        style={{
                          fontWeight: "bold",
                          textDecoration: "underline",
                          cursor: "pointer",
                          color: "#ee365a",
                        }}
                        href={`/shop-default?categoryId=latest`}
                      >
                        view all
                      </Link>
                    </div>
                  </ul>
                )}
              </div>
            </div>
            <div
              className="sidebar-item sidebar-post"
              style={{
                border: "1px solid gainsboro",
                padding: 10,
                paddingBottom: 20,
              }}
            >
              <div
                className="sidebar-title"
                style={{
                  borderBottom: "2px solid #ee365a",
                  color: "#ee365a",
                  fontWeight: "bold",
                }}
              >
                Top Selling
              </div>
              <div className="sidebar-content">
                {bestSelling && bestSelling.length > 0 && (
                  <ul>
                    {bestSelling.slice(0, 3).map((product, index) => (
                      <li
                        key={index}
                        style={{
                          paddingBottom: 20,
                          paddingTop: 10,
                          borderBottom: "1px solid gainsboro",
                        }}
                      >
                        <div className="blog-article-item style-sidebar">
                          <div
                            style={{
                              border: "1px solid gainsboro",
                              backgroundImage: `url(${product.pictures[0]})`,
                              backgroundSize: "contain",
                              maxHeight: 100,
                              minHeight: 100,
                              maxWidth: 100,
                              minWidth: 100,
                              borderRadius: 5,
                            }}
                          ></div>

                          <div className="article-content">
                            <div
                              style={{
                                fontWeight: "bold",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                                lineHeight: "1.5em",
                                height: "3em", // 2 lines * line height
                                textOverflow: "ellipsis",
                              }}
                            >
                              {product.name}
                            </div>
                            <div>{getPrice(product)}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        paddingRight: 12,
                      }}
                    >
                      <Link
                        style={{
                          fontWeight: "bold",
                          textDecoration: "underline",
                          cursor: "pointer",
                          color: "#ee365a",
                        }}
                        href={`/shop-default?categoryId=1697451881986`}
                      >
                        view all
                      </Link>
                    </div>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    latestProducts: state.categories.latestProducts,
    bestSelling: state.categories.bestSelling,
  };
};
export default connect(mapStateToProps, {
  getAllHomeScreenBestSellingRedux,
  getAllLatestProductsRedux,
})(SearchModal);
