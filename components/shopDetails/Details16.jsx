"use client";
import React, { useState } from "react";
import Image from "next/image";
import { openCartModal } from "@/utlis/openCartModal";
import {
  colorOptions2,
  paymentImages,
  sizeOptions,
} from "@/data/singleProductOptions";
import StickyItem from "./StickyItem";
import { useRouter } from "next/navigation";
import Quantity from "./Quantity";
import CountdownComponent from "@/components/common/Countdown";
import Slider1ZoomOuter from "./sliders/Slider1ZoomOuter";
import { useContextElement } from "@/context/Context";
import { connect } from "react-redux";
const Details16 = ({ product, freeShipping }) => {
  const router = useRouter();
  const [currentColor, setCurrentColor] = useState(colorOptions2[0]);
  const [currentSize, setCurrentSize] = useState(sizeOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const handleColor = (color) => {
    const updatedColor = colorOptions2.filter(
      (elm) => elm.value.toLowerCase() == color.toLowerCase()
    )[0];
    if (updatedColor) {
      setCurrentColor(updatedColor);
    }
  };
  const getStar = (product) => {
    if (product.reviews && product.reviews.length > 0) {
      let averageStar = 0;
      product.reviews.map((review) => {
        averageStar += parseInt(review.star);
      });
      return averageStar / product.reviews.length;
    } else {
      return 0;
    }
  };

  const getVariation = (obj) => {
    const { product } = props;
    let selectedVariation = {};
    if (product && product.id && product.displayedVariations.length > 0) {
      product.displayedVariations.map((vari) => {
        let combinationIdArray = vari.combination.map((combination) => {
          return combination.id;
        });
        let ids = [];
        for (var key of Object.keys(obj)) {
          ids.push(obj[key].id);
        }

        if (combinationIdArray.sort().join(",") === ids.sort().join(",")) {
          selectedVariation = vari;
        }
      });
    }
    return selectedVariation;
  };

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
            <div
              style={{ textAlign: "left", fontWeight: "bold", fontSize: 23 }}
            >
              ৳{product.displayedVariations[0].salePrice}
            </div>
            <div
              style={{
                textAlign: "left",
                color: "#999",
                fontSize: 15,
              }}
            >
              <del>৳{product.displayedVariations[0].price}</del>
            </div>

            <div
              style={{
                height: 30,
                width: 30,
                backgroundImage: "url(/images/offer.svg)",
                zIndex: 100,
                marginTop: 5,
              }}
            >
              <div
                style={{
                  color: "white",
                  fontSize: 11,
                  textAlign: "center",
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
                  fontSize: 11,
                  marginTop: -12,
                  textAlign: "center",
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
            <div
              style={{ textAlign: "left", fontWeight: "bold", fontSize: 23 }}
            >
              ৳{product.salePrice}
            </div>
            <div
              style={{
                textAlign: "left",
                color: "#999",
                fontSize: 15,
              }}
            >
              <del>৳{product.price}</del>
            </div>
            <div
              style={{
                height: 30,
                width: 30,
                backgroundImage: "url(/images/offer.svg)",
                zIndex: 100,
                marginTop: 5,
              }}
            >
              <div
                style={{
                  color: "white",
                  fontSize: 11,
                  textAlign: "center",
                }}
              >
                {parseInt(100 - (product.salePrice / product.price) * 100)}%
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: 11,
                  marginTop: -12,
                  textAlign: "center",
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

  const getTimeRemaining = () => {
    const date = new Date();
    const endtime = `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getDate()} ${date.getFullYear()} 23:59:59 GMT+0600`;

    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return (
      <div
        style={{
          color: "#292929",

          fontSize: 14,
        }}
      >
        <i
          class="icofont-delivery-time"
          style={{ fontWeight: "bold", marginRight: 7, fontSize: 18 }}
        ></i>
        Order in The Next{" "}
        <span
          style={{
            textDecorationLine: "underline",
            color: "#ff8084",
            fontWeight: "bold",
            fontSize: 14,
          }}
        >
          {hours ? hours : "6"} hours {minutes ? minutes : "00"} minutes
        </span>{" "}
        to get it by{" "}
        <span
          style={{
            fontWeight: "bold",
            fontSize: 14,
          }}
        >
          {date.toLocaleString("default", { month: "long" })}{" "}
          {date.getDate() + 2}, {date.getFullYear()}
        </span>
        .
      </div>
    );
  };

  const {
    addProductToCart,
    isAddedToCartProducts,
    addToCompareItem,
    isAddedtoCompareItem,
    addToWishlist,
    isAddedtoWishlist,
  } = useContextElement();
  return (
    <section
      className="flat-spacing-4 pt_0"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <div className="tf-main-product section-image-zoom">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top">
                <div className="thumbs-slider">
                  <Slider1ZoomOuter
                    handleColor={handleColor}
                    currentColor={currentColor.value}
                    firstImage={product.pictures[0]}
                    product={product}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom">
                  <div className="tf-product-info-title">
                    <h5>{product.name}</h5>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          color:
                            product.stockStatus == "In stock"
                              ? "#5ddb79"
                              : "#fe151b",
                        }}
                      >
                        {product.stockStatus}
                      </div>
                      <div>
                        <div className="rating">
                          <i
                            className="icon-start"
                            style={{
                              color:
                                getStar(product) > 0 ? "orange" : "gainsboro",
                            }}
                          />
                          <i
                            className="icon-start"
                            style={{
                              color:
                                getStar(product) > 1 ? "orange" : "gainsboro",
                            }}
                          />
                          <i
                            className="icon-start"
                            style={{
                              color:
                                getStar(product) > 2 ? "orange" : "gainsboro",
                            }}
                          />
                          <i
                            className="icon-start"
                            style={{
                              color:
                                getStar(product) > 3 ? "orange" : "gainsboro",
                            }}
                          />
                          <i
                            className="icon-start"
                            style={{
                              color:
                                getStar(product) > 4 ? "orange" : "gainsboro",
                            }}
                          />
                        </div>
                        <div>
                          <div
                            style={{
                              textAlign: "center",
                              color: "gray",
                              fontSize: 12,
                            }}
                          >
                            ({product.reviews ? product.reviews.length : 0}{" "}
                            Reviews)
                          </div>
                          {/* <div
                            style={{
                              color: "gray",
                              fontSize: 12,
                              textAlign: "center",
                              marginTop: 20,
                            }}
                          >
                            Total Sold:
                            {product.totalSold ? product.totalSold : 0}
                          </div>
                          <div
                            style={{
                              color: "gray",
                              fontSize: 12,
                              textAlign: "center",
                            }}
                          >
                            Wishlist:{product.wishlist ? product.wishlist : 0}
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tf-product-info-price"
                    style={{ marginTop: -20 }}
                  >
                    {getPrice(product)}
                  </div>

                  {product.selectedBrands &&
                  product.selectedBrands.length > 0 ? (
                    <div
                      style={{
                        color: "#ff8084",
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                      onClick={() => {
                        router.push();
                      }}
                    >
                      {product.selectedBrands && product.selectedBrands[0].name}
                    </div>
                  ) : null}
                  <div style={{ marginBottom: 7 }}>{getTimeRemaining()}</div>
                  <div>
                    <div>
                      <i
                        class="icofont-gift"
                        style={{
                          fontWeight: "bold",
                          marginRight: 7,
                          fontSize: 18,
                        }}
                      ></i>

                      <span
                        style={{
                          color: "#292929",
                          fontSize: 14,
                        }}
                      >
                        Spend{" "}
                        <span
                          style={{
                            color: "#ff8084",
                            fontWeight: "bold",
                            textDecorationLine: "underline",
                            fontSize: 14,
                          }}
                        >
                          Tk {freeShipping}{" "}
                        </span>
                        to get Free Delivery.
                      </span>
                    </div>
                  </div>
                  <div className="tf-product-info-variant-picker">
                    <div className="variant-picker-item">
                      <div className="variant-picker-label">
                        Color:{" "}
                        <span className="fw-6 variant-picker-label-value">
                          {currentColor.value}
                        </span>
                      </div>
                      <form className="variant-picker-values">
                        {colorOptions2.map((color) => (
                          <React.Fragment key={color.id}>
                            <input
                              id={color.id}
                              type="radio"
                              name="color1"
                              readOnly
                              checked={currentColor == color}
                            />
                            <label
                              onClick={() => setCurrentColor(color)}
                              className="hover-tooltip image-rounded radius-60"
                              htmlFor={color.id}
                              data-value={color.value}
                            >
                              <span className="btn-checkbox">
                                <Image
                                  alt={color.value}
                                  src={color.imgSrc}
                                  width={color.width}
                                  height={color.height}
                                />
                              </span>
                              <span className="tooltip">{color.value}</span>
                            </label>
                          </React.Fragment>
                        ))}
                      </form>
                    </div>
                    <div className="variant-picker-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="variant-picker-label">
                          Size:{" "}
                          <span className="fw-6 variant-picker-label-value">
                            {currentSize.value}
                          </span>
                        </div>
                        <a
                          href="#find_size"
                          data-bs-toggle="modal"
                          className="find-size fw-6"
                        >
                          Find your size
                        </a>
                      </div>
                      <form className="variant-picker-values">
                        {sizeOptions.map((size) => (
                          <React.Fragment key={size.id}>
                            <input
                              type="radio"
                              name="size1"
                              id={size.id}
                              readOnly
                              checked={currentSize == size}
                            />
                            <label
                              onClick={() => setCurrentSize(size)}
                              className="style-text"
                              htmlFor={size.id}
                              data-value={size.value}
                            >
                              <p>{size.value}</p>
                            </label>
                          </React.Fragment>
                        ))}
                      </form>
                    </div>
                  </div>
                  <div className="tf-product-info-quantity">
                    <div className="quantity-title fw-6">Quantity</div>
                    <Quantity setQuantity={setQuantity} />
                  </div>
                  <div className="tf-product-info-buy-button">
                    <form onSubmit={(e) => e.preventDefault()} className="">
                      <a
                        onClick={() => {
                          openCartModal();
                          addProductToCart(product.id, quantity ? quantity : 1);
                        }}
                        className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn "
                      >
                        <span>
                          {isAddedToCartProducts(product.id)
                            ? "Already Added"
                            : "Add to cart"}{" "}
                          -{" "}
                        </span>
                        <span className="tf-qty-price">
                          ${(product.price * quantity).toFixed(2)}
                        </span>
                      </a>
                      <a
                        onClick={() => addToWishlist(product.id)}
                        className="tf-product-btn-wishlist hover-tooltip box-icon bg_white wishlist btn-icon-action"
                      >
                        <span
                          className={`icon icon-heart ${
                            isAddedtoWishlist(product.id) ? "added" : ""
                          }`}
                        />
                        <span className="tooltip">
                          {" "}
                          {isAddedtoWishlist(product.id)
                            ? "Already Wishlisted"
                            : "Add to Wishlist"}
                        </span>
                        <span className="icon icon-delete" />
                      </a>
                      <a
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        onClick={() => addToCompareItem(product.id)}
                        className="tf-product-btn-wishlist hover-tooltip box-icon bg_white compare btn-icon-action"
                      >
                        <span
                          className={`icon icon-compare ${
                            isAddedtoCompareItem(product.id) ? "added" : ""
                          }`}
                        />
                        <span className="tooltip">
                          {" "}
                          {isAddedtoCompareItem(product.id)
                            ? "Already Compared"
                            : "Add to Compare"}
                        </span>
                        <span className="icon icon-check" />
                      </a>
                      <div className="w-100">
                        <a href="#" className="btns-full">
                          Buy with{" "}
                          <Image
                            alt="image"
                            src="/images/payments/paypal.png"
                            width={64}
                            height={18}
                          />
                        </a>
                        <a href="#" className="payment-more-option">
                          More payment options
                        </a>
                      </div>
                    </form>
                  </div>
                  <div className="tf-product-info-extra-link">
                    <a
                      href="#compare_color"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon">
                        <Image
                          alt="image"
                          src="/images/item/compare.svg"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="text fw-6">Compare color</div>
                    </a>
                    <a
                      href="#ask_question"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon">
                        <i className="icon-question" />
                      </div>
                      <div className="text fw-6">Ask a question</div>
                    </a>
                    <a
                      href="#delivery_return"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon">
                        <svg
                          className="d-inline-block"
                          xmlns="http://www.w3.org/2000/svg"
                          width={22}
                          height={18}
                          viewBox="0 0 22 18"
                          fill="currentColor"
                        >
                          <path d="M21.7872 10.4724C21.7872 9.73685 21.5432 9.00864 21.1002 8.4217L18.7221 5.27043C18.2421 4.63481 17.4804 4.25532 16.684 4.25532H14.9787V2.54885C14.9787 1.14111 13.8334 0 12.4255 0H9.95745V1.69779H12.4255C12.8948 1.69779 13.2766 2.07962 13.2766 2.54885V14.5957H8.15145C7.80021 13.6052 6.85421 12.8936 5.74468 12.8936C4.63515 12.8936 3.68915 13.6052 3.33792 14.5957H2.55319C2.08396 14.5957 1.70213 14.2139 1.70213 13.7447V2.54885C1.70213 2.07962 2.08396 1.69779 2.55319 1.69779H9.95745V0H2.55319C1.14528 0 0 1.14111 0 2.54885V13.7447C0 15.1526 1.14528 16.2979 2.55319 16.2979H3.33792C3.68915 17.2884 4.63515 18 5.74468 18C6.85421 18 7.80021 17.2884 8.15145 16.2979H13.423C13.7742 17.2884 14.7202 18 15.8297 18C16.9393 18 17.8853 17.2884 18.2365 16.2979H21.7872V10.4724ZM16.684 5.95745C16.9494 5.95745 17.2034 6.08396 17.3634 6.29574L19.5166 9.14894H14.9787V5.95745H16.684ZM5.74468 16.2979C5.27545 16.2979 4.89362 15.916 4.89362 15.4468C4.89362 14.9776 5.27545 14.5957 5.74468 14.5957C6.21392 14.5957 6.59575 14.9776 6.59575 15.4468C6.59575 15.916 6.21392 16.2979 5.74468 16.2979ZM15.8298 16.2979C15.3606 16.2979 14.9787 15.916 14.9787 15.4468C14.9787 14.9776 15.3606 14.5957 15.8298 14.5957C16.299 14.5957 16.6809 14.9776 16.6809 15.4468C16.6809 15.916 16.299 16.2979 15.8298 16.2979ZM18.2366 14.5957C17.8853 13.6052 16.9393 12.8936 15.8298 12.8936C15.5398 12.8935 15.252 12.943 14.9787 13.04V10.8511H20.0851V14.5957H18.2366Z" />
                        </svg>
                      </div>
                      <div className="text fw-6">Delivery &amp; Return</div>
                    </a>
                    <a
                      href="#share_social"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon">
                        <i className="icon-share" />
                      </div>
                      <div className="text fw-6">Share</div>
                    </a>
                  </div>
                  <div className="tf-product-info-delivery-return">
                    <div className="row">
                      <div className="col-xl-6 col-12">
                        <div className="tf-product-delivery">
                          <div className="icon">
                            <i className="icon-delivery-time" />
                          </div>
                          <p>
                            Estimate delivery times:{" "}
                            <span className="fw-7">12-26 days</span>{" "}
                            (International),{" "}
                            <span className="fw-7">3-6 days</span> (United
                            States).
                          </p>
                        </div>
                      </div>
                      <div className="col-xl-6 col-12">
                        <div className="tf-product-delivery mb-0">
                          <div className="icon">
                            <i className="icon-return-order" />
                          </div>
                          <p>
                            Return within <span className="fw-7">30 days</span>{" "}
                            of purchase. Duties &amp; taxes are non-refundable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tf-product-info-trust-seal">
                    <div className="tf-product-trust-mess">
                      <i className="icon-safe" />
                      <p className="fw-6">
                        Guarantee Safe <br /> Checkout
                      </p>
                    </div>
                    <div className="tf-payment">
                      {paymentImages.map((image, index) => (
                        <Image
                          key={index}
                          alt={image.alt}
                          src={image.src}
                          width={image.width}
                          height={image.height}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StickyItem />
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    freeShipping: state.cart.freeShipping,
  };
};
export default connect(mapStateToProps, {})(Details16);
