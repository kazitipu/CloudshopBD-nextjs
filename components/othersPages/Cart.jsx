"use client";
import {
  decrementQuantityRedux,
  incrementQuantityRedux,
  removeFromCartRedux,
  setOrderNoteRedux,
  setQuantityRedux,
} from "@/actions";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const Cart = ({
  cartData,
  removeFromCartRedux,
  incrementQuantityRedux,
  decrementQuantityRedux,
  setQuantityRedux,
  freeShipping,
  orderNote2,
  setOrderNoteRedux,
}) => {
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
  });

  const router = useRouter();

  const [termsAndCondition, setTermsAndCondition] = useState(false);
  const [orderNote, setOrderNote] = useState("");

  useEffect(() => {
    calculateCart();
  }, [cartData]);
  useEffect(() => {
    setOrderNote(orderNote2);
  }, [orderNote2]);

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
    <section className="flat-spacing-11">
      <div className="container">
        <div className="tf-page-cart-wrap">
          <div className="tf-page-cart-item">
            <form onSubmit={(e) => e.preventDefault()}>
              <table className="tf-table-page-cart">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartData.map((item, i) => (
                    <tr key={i} className="tf-cart-item file-delete">
                      <td className="tf-cart-item_product">
                        <Link
                          href={`/product-swatch-image-rounded/${item.productId}`}
                          className="img-box"
                        >
                          <Image
                            alt="img-product"
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
                        <div className="cart-info">
                          <Link
                            href={`/product-swatch-image-rounded/${item.productId}`}
                            className="cart-title link"
                          >
                            <div>{item.product.name.slice(0, 40)}</div>
                          </Link>
                          <div className="cart-meta-variant">
                            {" "}
                            {item.selectedVariation &&
                              item.selectedVariation.id &&
                              item.selectedVariation.combination.map(
                                (comb, index) => (
                                  <div key={index} style={{ marginTop: -5 }}>
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
                          <span
                            className="remove-cart link remove"
                            onClick={() => {
                              removeFromCartRedux(item);
                            }}
                          >
                            Remove
                          </span>
                        </div>
                      </td>
                      <td
                        className="tf-cart-item_price"
                        cart-data-title="Price"
                      >
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
                      </td>
                      <td
                        className="tf-cart-item_quantity"
                        cart-data-title="Quantity"
                      >
                        <div className="cart-quantity">
                          <div className="wg-quantity">
                            <span
                              className="btn-quantity minus-btn"
                              onClick={() => {
                                decrementQuantityRedux(item);
                              }}
                            >
                              <svg
                                className="d-inline-block"
                                width={9}
                                height={1}
                                viewBox="0 0 9 1"
                                fill="currentColor"
                              >
                                <path d="M9 1H5.14286H3.85714H0V1.50201e-05H3.85714L5.14286 0L9 1.50201e-05V1Z" />
                              </svg>
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
                              <svg
                                className="d-inline-block"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                                fill="currentColor"
                              >
                                <path d="M9 5.14286H5.14286V9H3.85714V5.14286H0V3.85714H3.85714V0H5.14286V3.85714H9V5.14286Z" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td
                        className="tf-cart-item_total"
                        cart-data-title="Total"
                      >
                        <div
                          className="cart-total"
                          style={{ minWidth: "60px" }}
                        >
                          ৳{singleProductTotal(item)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!cartData.length && (
                <>
                  <div className="row align-items-center mb-5">
                    <div className="col-6 fs-18">Your shop cart is empty</div>
                    <div className="col-6">
                      <Link
                        href={`/shop-default`}
                        className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                        style={{ width: "fit-content" }}
                      >
                        Explore Products!
                      </Link>
                    </div>
                  </div>
                </>
              )}
              <div className="tf-page-cart-note">
                <label htmlFor="cart-note">Add Order Note</label>
                <textarea
                  name="note"
                  id="cart-note"
                  placeholder="How can we help you?"
                  defaultValue={""}
                  onChange={(e) => {
                    setOrderNote(e.target.value);
                  }}
                  value={orderNote}
                />
              </div>
            </form>
          </div>
          <div className="tf-page-cart-footer">
            <div className="tf-cart-footer-inner">
              <div className="tf-free-shipping-bar">
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
              <div className="tf-page-cart-checkout">
                <div className="tf-cart-totals-discounts">
                  <h3>Subtotal</h3>
                  <span className="total-value">৳ {state.sumAmount}</span>
                </div>

                <div className="cart-checkbox">
                  <input
                    type="checkbox"
                    className="tf-check"
                    id="check-agree"
                    checked={termsAndCondition}
                    onChange={(e) => {
                      setTermsAndCondition(!termsAndCondition);
                    }}
                  />
                  <label htmlFor="check-agree" className="fw-4">
                    I agree with the{" "}
                    <Link href={`/terms-conditions`}>terms and conditions</Link>
                  </label>
                </div>
                <div className="cart-checkout-btn">
                  <div
                    href={`/checkout`}
                    className="tf-btn w-100 btn-fill animate-hover-btn radius-3 justify-content-center"
                    onClick={() => {
                      setOrderNoteRedux(orderNote);
                      router.push(`/checkout`);
                    }}
                  >
                    <span>Check out</span>
                  </div>
                </div>
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
    cartData: state.cart.cartData,
    freeShipping: state.cart.freeShipping,
    orderNote2: state.cart.orderNote,
  };
};
export default connect(mapStateToProps, {
  removeFromCartRedux,
  incrementQuantityRedux,
  decrementQuantityRedux,
  setQuantityRedux,
  setOrderNoteRedux,
})(Cart);
