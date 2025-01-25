"use client";

import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Image from "next/image";
import Link from "next/link";
import CartLength from "../common/CartLength";
import WishlistLength from "../common/WishlistLength";
import { ReactTyped } from "react-typed";
import "./Header2.css";
import { algoliasearch } from "algoliasearch";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
// search api key for use in client side code
export const searchClient = algoliasearch(
  "NILPZSAV6Q",
  "f8dd9476cf54f47a7e1594f3f3b238cb"
);
export default function Header2({
  textClass,
  bgColor = "",
  uppercase = false,
  isArrow = true,
  Linkfs = "",
}) {
  const [searchBarValue, setSearchBarValue] = useState("");
  const [products, setProducts] = useState([]);
  const [nbHits, setNbHits] = useState(0);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  useEffect(() => {
    console.log("searchbar value is getting changed outside");
    const getAlgoliaProducts = async () => {
      if (searchBarValue && searchBarValue.length >= 3) {
        console.log("searchbar value is getting changed inside");
        setLoader(true);
        const response = await searchClient.searchSingleIndex({
          indexName: "products",
          searchParams: { query: searchBarValue },
        });
        console.log(response);
        if (response && response.hits && response.hits.length > 0) {
          setProducts(response.hits);
          setNbHits(response.nbHits);
        }
        setLoader(false);
      }
      if (searchBarValue == "") {
        setProducts([]);
        setNbHits(0);
      }
    };
    getAlgoliaProducts();
  }, [searchBarValue]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearchBarValue(value);
  };

  return (
    <header
      id="header"
      style={{ borderBottom: "1px solid gainsboro" }}
      className={`header-default ${uppercase ? "header-uppercase" : ""}`}
    >
      <div className="px_15 lg-px_40">
        <div className="row wrapper-header align-items-center">
          <div className="col-md-4 col-3 tf-lg-hidden">
            <a
              href="#mobileMenu"
              data-bs-toggle="offcanvas"
              aria-controls="offcanvasLeft"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={16}
                viewBox="0 0 24 16"
                fill="none"
              >
                <path
                  d="M2.00056 2.28571H16.8577C17.1608 2.28571 17.4515 2.16531 17.6658 1.95098C17.8802 1.73665 18.0006 1.44596 18.0006 1.14286C18.0006 0.839753 17.8802 0.549063 17.6658 0.334735C17.4515 0.120408 17.1608 0 16.8577 0H2.00056C1.69745 0 1.40676 0.120408 1.19244 0.334735C0.978109 0.549063 0.857702 0.839753 0.857702 1.14286C0.857702 1.44596 0.978109 1.73665 1.19244 1.95098C1.40676 2.16531 1.69745 2.28571 2.00056 2.28571ZM0.857702 8C0.857702 7.6969 0.978109 7.40621 1.19244 7.19188C1.40676 6.97755 1.69745 6.85714 2.00056 6.85714H22.572C22.8751 6.85714 23.1658 6.97755 23.3801 7.19188C23.5944 7.40621 23.7148 7.6969 23.7148 8C23.7148 8.30311 23.5944 8.59379 23.3801 8.80812C23.1658 9.02245 22.8751 9.14286 22.572 9.14286H2.00056C1.69745 9.14286 1.40676 9.02245 1.19244 8.80812C0.978109 8.59379 0.857702 8.30311 0.857702 8ZM0.857702 14.8571C0.857702 14.554 0.978109 14.2633 1.19244 14.049C1.40676 13.8347 1.69745 13.7143 2.00056 13.7143H12.2863C12.5894 13.7143 12.8801 13.8347 13.0944 14.049C13.3087 14.2633 13.4291 14.554 13.4291 14.8571C13.4291 15.1602 13.3087 15.4509 13.0944 15.6653C12.8801 15.8796 12.5894 16 12.2863 16H2.00056C1.69745 16 1.40676 15.8796 1.19244 15.6653C0.978109 15.4509 0.857702 15.1602 0.857702 14.8571Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
          <div className="col-xl-4 col-md-4 col-6">
            <Link href={`/`} className="logo-header">
              <Image
                alt="logo"
                className="logo"
                src="/images/logo/cloudshopBD.png"
                width="10"
                height="10"
                priority
              />
            </Link>
          </div>
          <div className="col-xl-5 tf-md-hidden">
            <div className="box-navigation text-center">
              <div
                className="top-searchbar-container-2"
                style={{ position: "relative" }}
              >
                <form
                  className="form_search top-form form-search2"
                  role="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setProducts([]);
                    setNbHits(0);
                    setLoader(false);
                    router.push(`/shop-default?searchParam=${searchBarValue}`);
                    setSearchBarValue("");
                  }}
                  style={{
                    borderRadius: "0px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    border: "2px solid gainsboro",
                  }}
                >
                  <ReactTyped
                    strings={[
                      "Search for products",
                      "Search for categories",
                      "Search for brands",
                    ]}
                    typeSpeed={40}
                    backSpeed={50}
                    attr="placeholder"
                    loop
                    style={{ minWidth: "80%" }}
                  >
                    <input
                      id="query search-autocomplete typed-input"
                      type="search"
                      value={searchBarValue}
                      onChange={handleChange}
                      name="searchBarValue"
                      className="nav-search nav-search-field"
                      aria-expanded="true"
                      style={{ color: "black", fontSize: 15, border: 0 }}
                    />
                  </ReactTyped>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      style={{
                        position: "relative",
                        backgroundColor: "rgb(238 54 90)",
                        minHeight: "100%",
                        paddingLeft: 20,
                        paddingRight: 20,
                        borderRadius: 0,
                        borderTopRightRadius: 5,
                        borderBottomRightRadius: 5,
                        border: "none",
                      }}
                    >
                      <i
                        className="icon icon-search"
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        &nbsp;Search
                      </i>
                    </button>
                  </div>
                </form>
                {loader ? (
                  <ul
                    className="list-group position-absolute w-100"
                    style={{
                      maxHeight: "500px",
                      overflowY: "auto",
                      zIndex: 1000,
                      borderBottom: "1px solid gainsboro",
                    }}
                  >
                    <li
                      className="list-group-item"
                      style={{
                        cursor: "pointer",
                        borderRadius: 0,
                        border: 0,
                        padding: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <ClipLoader
                          loading={loader}
                          size={28}
                          color="#ec345b"
                        />
                      </div>
                    </li>
                  </ul>
                ) : products.length > 0 ? (
                  <ul
                    className="list-group position-absolute w-100"
                    style={{
                      maxHeight: "500px",
                      overflowY: "auto",
                      zIndex: 1000,
                      borderBottom: "1px solid gainsboro",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: "5px 10px",
                        background: "white",
                      }}
                    >
                      <div style={{ color: "#ec345b", fontWeight: "bold" }}>
                        {nbHits} items found
                      </div>
                      <div
                        style={{
                          color: "#ec345b",
                          textDecoration: "underline",
                          fontSize: 14,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setProducts([]);
                          setNbHits(0);
                          setLoader(false);
                          router.push(
                            `/shop-default?searchParam=${searchBarValue}`
                          );
                          setSearchBarValue("");
                        }}
                      >
                        see all
                      </div>
                    </div>

                    {products.map((product, index) => {
                      return (
                        <li
                          className="list-group-item"
                          key={index}
                          style={{
                            cursor: "pointer",
                            borderRadius: 0,
                            borderBottom: "1px solid gainsboro",
                            padding: 10,
                          }}
                          onClick={() => {
                            console.log(product);
                            router.push(
                              `/product-swatch-image-rounded/${product.objectID}`
                            );
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                              }}
                            >
                              <img
                                src={
                                  product.pictures &&
                                  product.pictures.length > 0
                                    ? product.pictures[0]
                                    : ""
                                }
                                style={{
                                  height: 80,
                                  width: 80,
                                  borderRadius: 5,
                                  border: "1px solid gainsboro",
                                }}
                              />
                              <div style={{ padding: 5, position: "relative" }}>
                                <div
                                  className="two-lines2"
                                  style={{ textAlign: "left" }}
                                >
                                  {product.name}
                                </div>
                                <div
                                  style={{
                                    textAlign: "left",
                                    position: "absolute",
                                    bottom: "10px",
                                    color: "#ec345b",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ৳{product.price ? product.price : ""}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : !loader && searchBarValue.length >= 3 ? (
                  <ul
                    className="list-group position-absolute w-100"
                    style={{
                      maxHeight: "500px",
                      overflowY: "auto",
                      zIndex: 1000,
                      borderBottom: "1px solid gainsboro",
                    }}
                  >
                    <li
                      className="list-group-item"
                      style={{
                        cursor: "pointer",
                        borderRadius: 0,
                        border: 0,
                        padding: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                          }}
                        >
                          <div style={{ padding: 5, position: "relative" }}>
                            <div className="two-lines2">
                              No matching results found
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-4 col-3">
            <ul className="nav-icon d-flex justify-content-end align-items-center gap-20">
              <li className="nav-account">
                <a
                  href="#userProfile"
                  data-bs-toggle="modal"
                  className="nav-icon-item"
                >
                  <i className="icon icon-account" />
                </a>
              </li>
              <li className="nav-wishlist">
                <Link href={`/wishlist`} className="nav-icon-item">
                  <i className="icon icon-heart" />
                  <span className={`count-box ${bgColor} ${textClass}`}>
                    <WishlistLength />
                  </span>
                </Link>
              </li>
              <li className="nav-cart">
                <a
                  href="#shoppingCart"
                  data-bs-toggle="modal"
                  className="nav-icon-item"
                >
                  <i className="icon icon-bag" />
                  <span className={`count-box ${bgColor} ${textClass}`}>
                    <CartLength />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row hide-row-in-pc">
          <div style={{ marginTop: 5, marginBottom: 10, position: "relative" }}>
            <form
              className="form_search top-form form-search2"
              role="form"
              style={{
                borderRadius: "0px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <ReactTyped
                strings={[
                  "Search for products",
                  "Search for categories",
                  "Search for brands",
                ]}
                typeSpeed={40}
                backSpeed={50}
                attr="placeholder"
                loop
                style={{ minWidth: "80%" }}
              >
                <input
                  id="query search-autocomplete"
                  type="search"
                  value={searchBarValue}
                  onChange={handleChange}
                  name="searchBarValue"
                  className="nav-search nav-search-field"
                  aria-expanded="true"
                  style={{ color: "black", fontSize: 14 }}
                />
              </ReactTyped>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="submit"
                  style={{
                    position: "relative",
                    backgroundColor: "rgb(238 54 90)",
                    minHeight: "100%",
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: 0,
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                    border: "none",
                  }}
                >
                  <i
                    className="icon icon-search"
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    &nbsp;Search
                  </i>
                </button>
              </div>
            </form>
            {loader ? (
              <ul
                className="list-group position-absolute w-100"
                style={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  zIndex: 1000,
                  borderBottom: "1px solid gainsboro",
                  maxWidth: "95%",
                }}
              >
                <li
                  className="list-group-item"
                  style={{
                    cursor: "pointer",
                    borderRadius: 0,
                    border: 0,
                    padding: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <ClipLoader loading={loader} size={28} color="#ec345b" />
                  </div>
                </li>
              </ul>
            ) : products.length > 0 ? (
              <ul
                className="list-group position-absolute w-100"
                style={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  zIndex: 1000,
                  borderBottom: "1px solid gainsboro",
                  maxWidth: "95%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "5px 10px",
                    background: "white",
                  }}
                >
                  <div style={{ color: "#ec345b", fontWeight: "bold" }}>
                    {nbHits} items found
                  </div>
                  <div
                    style={{
                      color: "#ec345b",
                      textDecoration: "underline",
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setProducts([]);
                      setNbHits(0);
                      setLoader(false);
                      router.push(
                        `/shop-default?searchParam=${searchBarValue}`
                      );
                      setSearchBarValue("");
                    }}
                  >
                    see all
                  </div>
                </div>

                {products.map((product, index) => {
                  return (
                    <li
                      className="list-group-item"
                      key={index}
                      style={{
                        cursor: "pointer",
                        borderRadius: 0,
                        borderBottom: "1px solid gainsboro",
                        padding: 10,
                      }}
                      onClick={() => {
                        console.log(product);
                        router.push(
                          `/product-swatch-image-rounded/${product.objectID}`
                        );
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                          }}
                        >
                          <img
                            src={
                              product.pictures && product.pictures.length > 0
                                ? product.pictures[0]
                                : ""
                            }
                            style={{
                              height: 80,
                              width: 80,
                              borderRadius: 5,
                              border: "1px solid gainsboro",
                            }}
                          />
                          <div style={{ padding: 5, position: "relative" }}>
                            <div
                              className="two-lines2"
                              style={{ textAlign: "left" }}
                            >
                              {product.name}
                            </div>
                            <div
                              style={{
                                textAlign: "left",
                                position: "absolute",
                                bottom: "10px",
                                color: "#ec345b",
                                fontWeight: "bold",
                              }}
                            >
                              ৳{product.price ? product.price : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : !loader && searchBarValue.length >= 3 ? (
              <ul
                className="list-group position-absolute w-100"
                style={{
                  maxHeight: "500px",
                  maxWidth: "95%",
                  overflowY: "auto",
                  zIndex: 1000,
                  borderBottom: "1px solid gainsboro",
                }}
              >
                <li
                  className="list-group-item"
                  style={{
                    cursor: "pointer",
                    borderRadius: 0,
                    border: 0,
                    padding: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div style={{ padding: 5, position: "relative" }}>
                        <div className="two-lines2">
                          No matching results found
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            ) : null}
          </div>
        </div>
        {/* for header navbar comment out the below lines  */}
        {/* <div className="row">
          <div className="col-xl-6 tf-md-hidden">
            <nav className="box-navigation text-center">
              <ul className="box-nav-ul d-flex align-items-center justify-content-center gap-30">
                <Nav isArrow={isArrow} Linkfs={Linkfs} />
              </ul>
            </nav>
          </div>
        </div> */}
      </div>
    </header>
  );
}
