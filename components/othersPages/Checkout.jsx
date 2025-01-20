"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import { matchCoupon } from "@/firebase/firebase.utils";
import {
  setCouponRedux,
  setTotalRedux,
  updateSingleProductRedux,
  addToOrderRedux,
} from "@/actions";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
const Checkout = ({
  cartData,
  setCouponRedux,
  currentUser,
  freeShipping,
  setTotalRedux,
  guest,
  addToOrderRedux,
  updateSingleProductRedux,
}) => {
  const [number, onChangeNumber] = React.useState("");
  const [loader, setLoader] = useState(false);
  const [showCoupon, setShowCoupon] = React.useState(false);
  const [coupon, setCoupon] = React.useState(null);
  const [dhakaDelivery, setDhakaDelivery] = React.useState(true);
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
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const router = useRouter();
  useEffect(() => {
    calculateCart();
  }, [cartData]);

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

  const singleProductTotal = (product) => {
    let total = parseInt(getPrice4(product)) * product.quantity;
    return total;
  };
  const singleProductTotal2 = (product) => {
    let total = parseInt(getPrice3(product)) * product.quantity;
    return total;
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

  const getTotal = (sumAmount) => {
    let total = 0;
    let deliveryCharge = 0;
    if (dhakaDelivery) {
      deliveryCharge = 70;
    } else {
      deliveryCharge = 120;
    }
    if (coupon) {
      if (sumAmount < freeShipping) {
        total =
          coupon.discountType == "cash"
            ? sumAmount + deliveryCharge - coupon.discountAmount
            : sumAmount +
              deliveryCharge -
              parseInt(sumAmount * (coupon.discountAmount / 100));
        setTotalRedux(total);
        return total;
      } else {
        total =
          coupon.discountType == "cash"
            ? sumAmount - coupon.discountAmount
            : sumAmount - parseInt(sumAmount * (coupon.discountAmount / 100));
        setTotalRedux(total);
        return total;
      }
    } else {
      if (sumAmount < freeShipping) {
        total = sumAmount + deliveryCharge;
        setTotalRedux(total);
        return total;
      } else {
        total = sumAmount;
        setTotalRedux(total);
        return total;
      }
    }
  };

  let shippingAddress = null;
  if (currentUser && currentUser.address && currentUser.address.length > 0) {
    shippingAddress = currentUser.address.find((addr) => addr.defaultShipping);
  } else if (guest && guest.address && guest.address.length > 0) {
    shippingAddress = guest.address.find((addr) => addr.defaultShipping);
  }

  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="tf-page-cart-wrap layout-2">
          <div className="tf-page-cart-item">
            <h5 className="fw-5 mb_20">Delivery Address</h5>
            {shippingAddress ? (
              <div
                className="box"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 10,
                  border: "2px solid gainsboro",
                  borderRadius: 10,
                  background: "aliceblue",
                }}
              >
                <div>
                  <img
                    src="/images/delivery.png"
                    style={{ width: 100, height: 100 }}
                  />
                  <div
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      flexDirection: "row",
                      maxWidth: 100,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor:
                          shippingAddress.addressType == "Home"
                            ? "green"
                            : shippingAddress.addressType == "Office"
                            ? "blue"
                            : "darkorange",
                        padding: 5,
                        paddingTop: 0,
                        paddingBottom: 0,
                        alignSelf: "center",
                        display: "inline",

                        borderRadius: 3,
                        color: "white",
                      }}
                    >
                      {shippingAddress.addressType}
                    </div>
                  </div>
                </div>
                <div style={{ marginLeft: 10, marginTop: 5 }}>
                  <div style={{ fontWeight: "bold" }}>
                    {shippingAddress.fullName}
                  </div>
                  <div>{shippingAddress.mobileNo}</div>
                  <div>{shippingAddress.address}</div>
                  <div>
                    {" "}
                    {shippingAddress.district},{shippingAddress.division}
                  </div>
                </div>
                <div style={{ marginLeft: 20 }}>
                  <div
                    style={{
                      padding: 5,
                      paddingLeft: 10,
                      paddingRight: 10,
                      backgroundColor: "#fff0f4",
                      borderRadius: 7,
                      color: "#ff8084",
                      textAlign: "center",
                      paddingTop: 0,
                      paddingBottom: 0,
                      marginTop: 5,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      router.push(`/my-account-address?from=checkout`);
                    }}
                  >
                    Change
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="box"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 10,
                  border: "1px solid black",
                  borderRadius: 10,
                  background: "aliceblue",
                }}
              >
                <div>
                  <img
                    src="/images/delivery.png"
                    style={{ width: 100, height: 100 }}
                  />
                  <div
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      flexDirection: "row",
                      maxWidth: 100,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "green",
                        padding: 5,
                        paddingTop: 0,
                        paddingBottom: 0,
                        alignSelf: "center",
                        display: "inline",

                        borderRadius: 3,
                        color: "white",
                      }}
                    >
                      Home
                    </div>
                  </div>
                </div>
                <div style={{ marginLeft: 10, marginTop: 5 }}></div>
                <div
                  style={{
                    marginLeft: 20,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      padding: 5,
                      paddingLeft: 10,
                      paddingRight: 10,
                      backgroundColor: "#fff0f4",
                      borderRadius: 7,
                      color: "#ff8084",
                      textAlign: "center",
                      paddingTop: 3,
                      paddingBottom: 3,
                      fontSize: 14,
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      marginTop: -10,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      router.push(`/my-account-address?from=checkout`);
                    }}
                  >
                    + Add Shipping Address
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="tf-page-cart-footer">
            <div className="tf-cart-footer-inner">
              <h5 className="fw-5 mb_20">Your order</h5>
              <div className="tf-page-cart-checkout widget-wrap-checkout">
                <ul className="wrap-checkout-product">
                  {cartData.map((item, i) => (
                    <li key={i} className="checkout-product-item">
                      <figure className="img-product">
                        <Image
                          alt="product"
                          src={
                            item.selectedVariation &&
                            item.selectedVariation.id &&
                            item.selectedVariation.pictures &&
                            item.selectedVariation.pictures.length > 0
                              ? item.selectedVariation.pictures[0]
                              : item.product.pictures[0]
                          }
                          width={720}
                          height={1005}
                          style={{ objectFit: "cover", borderRadius: 5 }}
                        />
                        <span className="quantity">{item.quantity}</span>
                      </figure>
                      <div className="content">
                        <div className="info">
                          <p
                            className="name"
                            style={{ maxWidth: "80%", minWidth: "80%" }}
                          >
                            {item.product.name.slice(0, 40)}
                          </p>
                          <span className="variant">
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
                          </span>
                        </div>
                        <span className="price" style={{ fontWeight: "bold" }}>
                          ৳{singleProductTotal(item)} <br />
                          <span
                            style={{
                              fontWeight: "lighter",
                              fontSize: 11,
                              textDecoration: "line-through",
                              marginLeft: 5,
                            }}
                          >
                            ৳{singleProductTotal2(item)}
                          </span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                {cartData.length == 0 && (
                  <div className="container">
                    <div className="row align-items-center mt-5 mb-5">
                      <div className="col-12 fs-18">
                        Your shop cart is empty
                      </div>
                      <div className="col-12 mt-3">
                        <Link
                          href={`/shop-default`}
                          className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                          style={{ width: "fit-content" }}
                        >
                          Explore Products!
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                <div className="coupon-box">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    onChange={(e) => {
                      onChangeNumber(e.target.value);
                    }}
                    value={number}
                  />
                  <div
                    className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                    onClick={async () => {
                      let matchedCoupon = await matchCoupon(number);

                      if (matchedCoupon) {
                        if (
                          Date.parse(matchedCoupon.expirationDate) <
                          Date.parse(new Date().toDateString())
                        ) {
                          setCouponRedux(null);
                          setCoupon(null);
                          toast(
                            `${number} Coupon code was expired at ${matchedCoupon.expirationDate}`
                          );
                          return;
                        }
                        if (
                          currentUser &&
                          currentUser.coupons &&
                          currentUser.coupons.length > 0 &&
                          currentUser.coupons.find(
                            (coupon) => coupon.id == matchedCoupon.id
                          ) &&
                          currentUser.coupons.find(
                            (coupon) => coupon.id == matchedCoupon.id
                          ).usageLimit >= matchedCoupon.usageLimit
                        ) {
                          setCouponRedux(null);
                          setCoupon(null);
                          toast(
                            `you've reaced the maximum usage limit of coupon ${number}.`
                          );
                          return;
                        }
                        if (matchedCoupon.minimumOrder > state.sumAmount) {
                          setCouponRedux(null);
                          setCoupon(null);
                          toast(
                            `Please Order at least ${matchedCoupon.minimumOrder}Tk to use this Coupon ${number} `
                          );
                        }

                        setCouponRedux(matchedCoupon);
                        setCoupon(matchedCoupon);
                        toast(
                          `Coupon code ${number} has been applied to your order.`
                        );
                        return;
                      } else {
                        setCouponRedux(null);
                        setCoupon(null);
                        toast(`${number} is not a valid coupon code.`);
                        return;
                      }
                    }}
                  >
                    Apply
                  </div>
                </div>
                <div
                  className="d-flex"
                  style={{ color: "#ff8084", fontWeight: "bold", fontSize: 15 }}
                >
                  You are saving ৳ {state.actualOrder - state.sumAmount} in this
                  order.{" "}
                </div>
                <div className="d-flex">
                  <img
                    src="/images/logo/cashonDelivery.png"
                    style={{ height: 100, width: 100 }}
                  />
                  <div
                    style={{
                      alignSelf: "center",
                      color: "white",
                      background: "#1b5cce",
                      fontWeight: "bold",
                      padding: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      borderRadius: 5,
                      width: "100%",
                    }}
                  >
                    Cash on delivery
                  </div>
                </div>

                <div className="d-flex justify-content-between line pb_20">
                  <h6 className="fw-5">Subtotal</h6>
                  <h6 className="total fw-5">৳ {state.actualOrder}</h6>
                </div>
                <div className="d-flex justify-content-between line pb_20">
                  <h6 className="fw-5">Discount applied</h6>
                  <h6 className="total fw-5">
                    {" "}
                    -৳ {state.actualOrder - state.sumAmount}
                  </h6>
                </div>
                {coupon && (
                  <div className="d-flex justify-content-between line pb_20">
                    <h6 className="fw-5">
                      Coupon applied{" "}
                      <span style={{ color: "#ff8084" }}>({coupon.name})</span>
                    </h6>
                    <h6 className="total fw-5">
                      {" "}
                      -৳{" "}
                      {coupon.discountType == "cash"
                        ? coupon.discountAmount
                        : parseInt(
                            state.sumAmount * (coupon.discountAmount / 100)
                          )}
                    </h6>
                  </div>
                )}
                <div className="d-flex justify-content-between line pb_20">
                  <h6 className="fw-5">Regular Delivery</h6>
                  <h6 className="total fw-5">
                    {state.sumAmount > freeShipping
                      ? "Free"
                      : dhakaDelivery
                      ? "৳ 70"
                      : "৳ 120"}
                  </h6>
                </div>

                <div className="wd-check-payment">
                  <div className="fieldset-radio" style={{ marginBottom: 5 }}>
                    <input
                      required
                      type="radio"
                      name="payment"
                      id="delivery"
                      className="tf-check"
                      checked={dhakaDelivery}
                      onChange={(e) => {
                        setDhakaDelivery(true);
                      }}
                    />
                    <label htmlFor="delivery">
                      12-48 hours delivery (Inside Dhaka) -{" "}
                      <span style={{ fontWeight: "bold" }}>৳ 70 </span>
                    </label>
                  </div>
                  <div className="fieldset-radio">
                    <input
                      required
                      type="radio"
                      name="payment"
                      id="delivery"
                      className="tf-check"
                      checked={!dhakaDelivery}
                      onChange={(e) => {
                        setDhakaDelivery(false);
                      }}
                    />
                    <label htmlFor="delivery">
                      1-5 days delivery (Outside Dhaka) -{" "}
                      <span style={{ fontWeight: "bold" }}>৳ 120 </span>
                    </label>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      padding: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      backgroundColor: "cadetblue",
                      borderRadius: 5,
                      color: "white",
                      alignSelf: "flex-start",
                      display: "inline",
                    }}
                  >
                    ! Order above ৳ {freeShipping} to get free delivery.
                  </div>
                </div>

                <div className="d-flex justify-content-between line pb_20">
                  <h6 className="fw-5"> Amount Payable</h6>
                  <h6 className="total fw-5">৳ {getTotal(state.sumAmount)}</h6>
                </div>
                <div className="wd-check-payment">
                  <div className="fieldset-radio mb_20"></div>

                  <div className="box-checkbox fieldset-radio mb_20">
                    <input
                      required
                      type="checkbox"
                      id="check-agree"
                      className="tf-check"
                      checked={termsAndConditions}
                      onChange={(e) => {
                        setTermsAndConditions(!termsAndConditions);
                      }}
                    />
                    <label htmlFor="check-agree" className="text_black-2">
                      I have read and agree to the website{" "}
                      <Link
                        href={`/terms-conditions`}
                        className="text-decoration-underline"
                      >
                        terms and conditions
                      </Link>
                      .
                    </label>
                  </div>
                </div>
                <button
                  className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center"
                  onClick={async () => {
                    if (!shippingAddress) {
                      toast.error(
                        "You must add/choose a shipping address to place order."
                      );
                      router.push(`/my-account-address?from=checkout`);
                      return;
                    }
                    if (!termsAndConditions) {
                      toast.error(
                        "Please check terms and conditions to proceed."
                      );
                      return;
                    }
                    setLoader(true);
                    console.log(guest);
                    console.log(currentUser);
                    let orderObj = {
                      id:
                        new Date().getTime().toString() +
                        (currentUser
                          ? currentUser.uid.slice(0, 3)
                          : guest.id.slice(0, 3)),
                      time: new Date().getTime().toString(),
                      currentUser: currentUser ? currentUser : "",
                      guest: guest && guest.id ? guest : false,
                      orders: cartData,
                      subTotal: state.actualOrder,
                      deliveryCharge:
                        state.sumAmount >= freeShipping
                          ? 0
                          : dhakaDelivery
                          ? 70
                          : 120,
                      discountApplied: state.actualOrder - state.sumAmount,
                      couponApplied: coupon
                        ? {
                            name: coupon.name,
                            discount:
                              coupon.discountType == "cash"
                                ? coupon.discountAmount
                                : parseInt(
                                    state.sumAmount *
                                      (coupon.discountAmount / 100)
                                  ),
                          }
                        : null,
                      orderStatus: "Processing",
                      date: new Date().getTime().toString(),
                      orderStatusScore: 1,
                      userId: currentUser ? currentUser.uid : guest.id,
                    };
                    console.log(orderObj);
                    await addToOrderRedux(orderObj);
                    for (let i = 0; i < orderObj.orders.length; i++) {
                      await updateSingleProductRedux({
                        ...orderObj.orders[i].product,
                        totalSold: orderObj.orders[i].product.totalSold
                          ? orderObj.orders[i].product.totalSold +
                            parseInt(orderObj.orders[i].quantity)
                          : parseInt(orderObj.orders[i].quantity),
                      });
                    }
                    setLoader(false);
                    toast.success("Order placed successfully");
                    router.push(`payment-confirmation?orderId=${orderObj.id}`);
                  }}
                >
                  {loader ? (
                    <ClipLoader loading={loader} size={19} color="white" />
                  ) : (
                    "Place Order"
                  )}
                </button>
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
    coupon: state.cart.coupon,
    currentUser: state.users.currentUser,
    freeShipping: state.cart.freeShipping,
    total: state.cart.total,
    guest: state.users.guest,
  };
};
export default connect(mapStateToProps, {
  setCouponRedux,
  setTotalRedux,
  addToOrderRedux,
  updateSingleProductRedux,
})(Checkout);
