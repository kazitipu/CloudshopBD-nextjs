"use client";
import { useContextElement } from "@/context/Context";
import { products1 } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useDispatch } from "react-redux";
import {
  setCartRedux,
  incrementQuantityRedux,
  decrementQuantityRedux,
  setQuantityRedux,
  removeFromCartRedux,
  setReduxWishlist,
  setOrderNoteRedux,
} from "@/actions";
import { connect } from "react-redux";
import "./shopCart.css";
import { useRouter } from "next/navigation";
const ShopCart = ({
  freeShipping,
  cartData,
  incrementQuantityRedux,
  decrementQuantityRedux,
  removeFromCartRedux,
  currentUser,
  setQuantityRedux,
  orderNote2,
  setOrderNoteRedux,
}) => {
  const { cartProducts, totalPrice, setCartProducts, setQuickViewItem } =
    useContextElement();
  let router = useRouter();
  useEffect(() => {
    calculateCart();
  }, [cartData]);

  const [state, setState] = useState({
    loading: true,
    cartArr: [],
    cartProducts: [],
    sumAmount: 0,
    actualOrder: 0,
    isApplied: false,
    validCode: false,
    couponCode: null,
    dhakaDelivery: true,
    orderNote: "",
    giftWrap: false,
  });
  useEffect(() => {
    setState({
      ...state,
      orderNote: orderNote2,
    });
  }, [orderNote2]);
  const dispatch = useDispatch();

  const addNoteRef = useRef();
  const addGiftRef = useRef();

  const calculateCart = () => {
    let cartProducts = cartData;
    let sumAmount = 0;
    let actualOrder = 0;

    //find and create array
    cartProducts &&
      cartProducts.length > 0 &&
      cartProducts.forEach(function (item, index) {
        let price = getPrice2(item);
        let actualPrice = getPrice3(item);
        sumAmount += parseInt(price) * item.quantity;
        actualOrder += parseInt(actualPrice) * item.quantity;
      });

    setState({
      ...state,
      loading: false,
      cartProducts: cartProducts,
      sumAmount: sumAmount,
      actualOrder: actualOrder,
    });
    // props.setTotalRedux(sumAmount);
  };

  const getPrice2 = (product) => {
    if (product.selectedVariation.id) {
      if (product.selectedVariation.salePrice == 0) {
        return product.selectedVariation.price;
      } else {
        return product.selectedVariation.salePrice;
      }
    } else {
      if (product.product) {
        if (product.product.salePrice == 0) {
          return product.product.price;
        } else {
          return product.product.salePrice;
        }
      } else {
        return 0;
      }
    }
  };
  const getPrice3 = (product) => {
    if (product.selectedVariation.id) {
      return product.selectedVariation.price;
    } else {
      if (product.product) {
        return product.product.price;
      } else {
        return 0;
      }
    }
  };
  const getPrice4 = (product) => {
    if (product.selectedVariation.id) {
      if (product.selectedVariation.salePrice == 0) {
        return product.selectedVariation.price;
      } else {
        return product.selectedVariation.salePrice;
      }
    } else {
      if (product.product) {
        if (product.product.salePrice == 0) {
          return product.product.price;
        } else {
          return product.product.salePrice;
        }
      } else {
        return 0;
      }
    }
  };

  const getPrice5 = (product) => {
    if (product.selectedVariation.id) {
      if (product.selectedVariation.salePrice == 0) {
        return "";
      } else {
        return `৳ ${product.selectedVariation.price}`;
      }
    } else {
      if (product.product) {
        if (product.product.salePrice == 0) {
          return "";
        } else {
          return `৳ ${product.product.price}`;
        }
      } else {
        return 0;
      }
    }
  };

  const singleProductTotal = (product) => {
    let total = parseInt(getPrice4(product)) * product.quantity;
    return total;
  };

  return (
    <div className="modal fullRight fade modal-shopping-cart" id="shoppingCart">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="header">
            <div className="title fw-5">Shopping cart</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="wrap">
            <div className="tf-mini-cart-threshold">
              <div className="tf-progress-bar">
                <span
                  style={{
                    width:
                      parseInt(state.sumAmount) >= parseInt(freeShipping)
                        ? "100%"
                        : `${(state.sumAmount / freeShipping) * 100}%`,
                    backgroundColor:
                      parseInt(state.sumAmount) >= parseInt(freeShipping)
                        ? "green"
                        : `red`,
                  }}
                >
                  <div
                    className="progress-car"
                    style={{
                      color:
                        parseInt(state.sumAmount) >= parseInt(freeShipping)
                          ? "green"
                          : `red`,
                      borderColor:
                        parseInt(state.sumAmount) >= parseInt(freeShipping)
                          ? "green"
                          : `red`,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={21}
                      height={14}
                      viewBox="0 0 21 14"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 0.875C0 0.391751 0.391751 0 0.875 0H13.5625C14.0457 0 14.4375 0.391751 14.4375 0.875V3.0625H17.3125C17.5867 3.0625 17.845 3.19101 18.0104 3.40969L20.8229 7.12844C20.9378 7.2804 21 7.46572 21 7.65625V11.375C21 11.8582 20.6082 12.25 20.125 12.25H17.7881C17.4278 13.2695 16.4554 14 15.3125 14C14.1696 14 13.1972 13.2695 12.8369 12.25H7.72563C7.36527 13.2695 6.39293 14 5.25 14C4.10706 14 3.13473 13.2695 2.77437 12.25H0.875C0.391751 12.25 0 11.8582 0 11.375V0.875ZM2.77437 10.5C3.13473 9.48047 4.10706 8.75 5.25 8.75C6.39293 8.75 7.36527 9.48046 7.72563 10.5H12.6875V1.75H1.75V10.5H2.77437ZM14.4375 8.89937V4.8125H16.8772L19.25 7.94987V10.5H17.7881C17.4278 9.48046 16.4554 8.75 15.3125 8.75C15.0057 8.75 14.7112 8.80264 14.4375 8.89937ZM5.25 10.5C4.76676 10.5 4.375 10.8918 4.375 11.375C4.375 11.8582 4.76676 12.25 5.25 12.25C5.73323 12.25 6.125 11.8582 6.125 11.375C6.125 10.8918 5.73323 10.5 5.25 10.5ZM15.3125 10.5C14.8293 10.5 14.4375 10.8918 14.4375 11.375C14.4375 11.8582 14.8293 12.25 15.3125 12.25C15.7957 12.25 16.1875 11.8582 16.1875 11.375C16.1875 10.8918 15.7957 10.5 15.3125 10.5Z"
                      />
                    </svg>
                  </div>
                </span>
              </div>
              {state.sumAmount < freeShipping ? (
                <div
                  className="tf-progress-msg"
                  style={{ color: "#ff8084", fontWeight: "bold" }}
                >
                  Spend Tk {freeShipping - state.sumAmount} more to enjoy Free
                  delivery
                </div>
              ) : (
                <div
                  className="tf-progress-msg"
                  style={{ color: "green", fontWeight: "bold" }}
                >
                  hooray! You will get free delivery
                </div>
              )}
            </div>
            <div className="tf-mini-cart-wrap">
              <div className="tf-mini-cart-main">
                <div className="tf-mini-cart-sroll">
                  <div className="tf-mini-cart-items">
                    {cartData.length > 0 &&
                      cartData.map((item, i) => (
                        <div key={i} className="tf-mini-cart-item">
                          <div className="tf-mini-cart-image">
                            <Link
                              href={`/product-swatch-image-rounded/${item.productId}`}
                            >
                              <Image
                                alt="image"
                                src={
                                  item.selectedVariation &&
                                  item.selectedVariation.id &&
                                  item.selectedVariation.pictures &&
                                  item.selectedVariation.pictures.length > 0
                                    ? item.selectedVariation.pictures[0]
                                    : item.product.pictures[0]
                                }
                                width={668}
                                height={932}
                                style={{ objectFit: "cover", borderRadius: 5 }}
                              />
                            </Link>
                          </div>
                          <div className="tf-mini-cart-info">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Link
                                className="title link"
                                style={{ maxWidth: "60%" }}
                                href={`/product-swatch-image-rounded/${item.productId}`}
                              >
                                {item.product.name.length > 60 ? (
                                  <div className="two-lines">
                                    {item.product.name.slice(0, 40)}
                                  </div>
                                ) : (
                                  <div className="two-lines">
                                    {item.product.name}
                                    <span style={{ color: "white" }}>
                                      {" "}
                                      000000000000
                                    </span>
                                  </div>
                                )}
                              </Link>
                              <div>
                                <div
                                  className="price fw-6"
                                  style={{
                                    textAlign: "center",
                                    marginTop: 3,
                                    fontSize: 14,
                                    fontWeight: "bold",
                                  }}
                                >
                                  ৳ {getPrice4(item)}
                                </div>
                                <div
                                  className="price fw-6"
                                  style={{
                                    textAlign: "center",
                                    textDecoration: "line-through",

                                    color: "gray",
                                    fontSize: 11,
                                  }}
                                >
                                  {getPrice5(item)}
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                className="meta-variant"
                                style={{ marginTop: 5 }}
                              >
                                {" "}
                                {item.selectedVariation &&
                                  item.selectedVariation.id &&
                                  item.selectedVariation.combination.map(
                                    (comb, index) => (
                                      <div
                                        key={index}
                                        style={{ marginTop: -5 }}
                                      >
                                        {item.product.savedAttributes.find(
                                          (attr) => attr.id == comb.parentId
                                        )
                                          ? item.product.savedAttributes.find(
                                              (attr) => attr.id == comb.parentId
                                            ).name
                                          : ""}
                                        :{" "}
                                        <span style={{ fontWeight: "bold" }}>
                                          {comb.name}
                                        </span>
                                      </div>
                                    )
                                  )}
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 5,
                              }}
                            >
                              <div
                                className="tf-mini-cart-btns"
                                style={{ marginTop: 0 }}
                              >
                                <div className="wg-quantity small">
                                  <span
                                    className="btn-quantity minus-btn"
                                    onClick={() => {
                                      decrementQuantityRedux(item);
                                    }}
                                  >
                                    -
                                  </span>
                                  <input
                                    type="text"
                                    name="number"
                                    value={item.quantity}
                                    min={1}
                                    onChange={(e) => {
                                      setQuantityRedux(item, e.target.value);
                                    }}
                                  />
                                  <span
                                    className="btn-quantity plus-btn"
                                    onClick={() => {
                                      incrementQuantityRedux(item);
                                    }}
                                  >
                                    +
                                  </span>
                                </div>
                              </div>
                              <div
                                style={{ marginTop: 10, fontWeight: "bold" }}
                              >
                                Total: ৳{singleProductTotal(item)}
                              </div>
                            </div>
                            <div>
                              <div
                                className="tf-mini-cart-remove"
                                style={{
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                  marginTop: 10,
                                  textAlign: "right",
                                  fontSize: 12,
                                  display: "inline-block",
                                }}
                                onClick={() => {
                                  removeFromCartRedux(item);
                                }}
                              >
                                Remove
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    {cartData.length == 0 && (
                      <div className="container">
                        <div className="row align-items-center mt-5 mb-5">
                          <div className="col-12 fs-18">
                            Your shopping cart is empty
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="tf-mini-cart-bottom">
                <div className="tf-mini-cart-tool">
                  <div
                    className="tf-mini-cart-tool-btn btn-add-note"
                    onClick={() => addNoteRef.current.classList.add("open")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={18}
                      viewBox="0 0 16 18"
                      fill="currentColor"
                    >
                      <path d="M5.12187 16.4582H2.78952C2.02045 16.4582 1.39476 15.8325 1.39476 15.0634V2.78952C1.39476 2.02045 2.02045 1.39476 2.78952 1.39476H11.3634C12.1325 1.39476 12.7582 2.02045 12.7582 2.78952V7.07841C12.7582 7.46357 13.0704 7.77579 13.4556 7.77579C13.8407 7.77579 14.1529 7.46357 14.1529 7.07841V2.78952C14.1529 1.25138 12.9016 0 11.3634 0H2.78952C1.25138 0 0 1.25138 0 2.78952V15.0634C0 16.6015 1.25138 17.8529 2.78952 17.8529H5.12187C5.50703 17.8529 5.81925 17.5407 5.81925 17.1555C5.81925 16.7704 5.50703 16.4582 5.12187 16.4582Z" />
                      <path d="M15.3882 10.0971C14.5724 9.28136 13.2452 9.28132 12.43 10.0965L8.60127 13.9168C8.51997 13.9979 8.45997 14.0979 8.42658 14.2078L7.59276 16.9528C7.55646 17.0723 7.55292 17.1993 7.58249 17.3207C7.61206 17.442 7.67367 17.5531 7.76087 17.6425C7.84807 17.7319 7.95768 17.7962 8.07823 17.8288C8.19879 17.8613 8.32587 17.8609 8.44621 17.8276L11.261 17.0479C11.3769 17.0158 11.4824 16.9543 11.5675 16.8694L15.3882 13.0559C16.2039 12.2401 16.2039 10.9129 15.3882 10.0971ZM10.712 15.7527L9.29586 16.145L9.71028 14.7806L12.2937 12.2029L13.2801 13.1893L10.712 15.7527ZM14.4025 12.0692L14.2673 12.204L13.2811 11.2178L13.4157 11.0834C13.6876 10.8115 14.1301 10.8115 14.402 11.0834C14.6739 11.3553 14.6739 11.7977 14.4025 12.0692Z" />
                    </svg>
                  </div>
                </div>
                <div className="tf-mini-cart-bottom-wrap">
                  <div className="tf-cart-totals-discounts">
                    <div className="tf-cart-total">Subtotal</div>
                    <div className="tf-totals-total-value fw-6">
                      ৳ {state.sumAmount}
                    </div>
                  </div>

                  <div className="tf-mini-cart-line" />

                  <div className="tf-mini-cart-view-checkout">
                    <div
                      className="tf-btn btn-outline radius-3 link w-100 justify-content-center"
                      onClick={() => {
                        setOrderNoteRedux(state.orderNote);
                        router.push(`/view-cart`);
                      }}
                    >
                      View cart
                    </div>
                    <div
                      className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                      onClick={() => {
                        setOrderNoteRedux(state.orderNote);
                        router.push(`/checkout`);
                      }}
                    >
                      <span>Check out</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tf-mini-cart-tool-openable add-note"
                ref={addNoteRef}
              >
                <div
                  className="overplay tf-mini-cart-tool-close"
                  onClick={() => addNoteRef.current.classList.remove("open")}
                />
                <div className="tf-mini-cart-tool-content">
                  <label htmlFor="Cart-note" className="tf-mini-cart-tool-text">
                    <div className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={18}
                        viewBox="0 0 16 18"
                        fill="currentColor"
                      >
                        <path d="M5.12187 16.4582H2.78952C2.02045 16.4582 1.39476 15.8325 1.39476 15.0634V2.78952C1.39476 2.02045 2.02045 1.39476 2.78952 1.39476H11.3634C12.1325 1.39476 12.7582 2.02045 12.7582 2.78952V7.07841C12.7582 7.46357 13.0704 7.77579 13.4556 7.77579C13.8407 7.77579 14.1529 7.46357 14.1529 7.07841V2.78952C14.1529 1.25138 12.9016 0 11.3634 0H2.78952C1.25138 0 0 1.25138 0 2.78952V15.0634C0 16.6015 1.25138 17.8529 2.78952 17.8529H5.12187C5.50703 17.8529 5.81925 17.5407 5.81925 17.1555C5.81925 16.7704 5.50703 16.4582 5.12187 16.4582Z" />
                        <path d="M15.3882 10.0971C14.5724 9.28136 13.2452 9.28132 12.43 10.0965L8.60127 13.9168C8.51997 13.9979 8.45997 14.0979 8.42658 14.2078L7.59276 16.9528C7.55646 17.0723 7.55292 17.1993 7.58249 17.3207C7.61206 17.442 7.67367 17.5531 7.76087 17.6425C7.84807 17.7319 7.95768 17.7962 8.07823 17.8288C8.19879 17.8613 8.32587 17.8609 8.44621 17.8276L11.261 17.0479C11.3769 17.0158 11.4824 16.9543 11.5675 16.8694L15.3882 13.0559C16.2039 12.2401 16.2039 10.9129 15.3882 10.0971ZM10.712 15.7527L9.29586 16.145L9.71028 14.7806L12.2937 12.2029L13.2801 13.1893L10.712 15.7527ZM14.4025 12.0692L14.2673 12.204L13.2811 11.2178L13.4157 11.0834C13.6876 10.8115 14.1301 10.8115 14.402 11.0834C14.6739 11.3553 14.6739 11.7977 14.4025 12.0692Z" />
                      </svg>
                    </div>
                    <span>Add Order Note</span>
                  </label>
                  <textarea
                    name="note"
                    id="Cart-note"
                    placeholder="How can we help you?"
                    defaultValue={""}
                    value={state.orderNote}
                    onChange={(e) => {
                      setState({
                        ...state,
                        orderNote: e.target.value,
                      });
                    }}
                  />
                  <div className="tf-cart-tool-btns justify-content-center">
                    <div
                      className="tf-mini-cart-tool-primary text-center w-100 fw-6 tf-mini-cart-tool-close "
                      onClick={() =>
                        addNoteRef.current.classList.remove("open")
                      }
                    >
                      Close
                    </div>
                  </div>
                </div>
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
    freeShipping: state.cart.freeShipping,
    cartData: state.cart.cartData,
    orderNote2: state.cart.orderNote,
    currentUser: state.users.currentUser,
  };
};
export default connect(mapStateToProps, {
  setCartRedux,
  incrementQuantityRedux,
  decrementQuantityRedux,
  removeFromCartRedux,
  setQuantityRedux,
  setOrderNoteRedux,
})(ShopCart);
