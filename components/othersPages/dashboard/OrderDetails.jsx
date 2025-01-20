"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { connect } from "react-redux";
import { getSingleOrder } from "@/firebase/firebase.utils";
import {
  setTotalRedux,
  updateOrderRedux,
  addToOrderRedux,
  getSingleOrderRedux,
} from "@/actions";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
const OrderDetails = ({
  orderId,
  orders,
  updateOrderRedux,
  addToOrderRedux,
  getSingleOrderRedux,
}) => {
  const [seletedTab, setSelectedTab] = useState("Order Tracking");
  const [loader, setLoader] = useState(false);
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
  useEffect(() => {
    const getOrder = async () => {
      if (orders && orders.length == 0) {
        await getSingleOrderRedux(orderId);
      }
    };
    getOrder();
  }, [orders]);

  const singleProductTotal = (product) => {
    let total = parseInt(getPrice4(product)) * product.quantity;
    return total;
  };
  const singleProductTotal2 = (product) => {
    let total = parseInt(getPrice3(product)) * product.quantity;
    return total;
  };

  const getPrice3 = (product) => {
    if (product.selectedVariation && product.selectedVariation.id) {
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
    if (product.selectedVariation && product.selectedVariation.id) {
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

  const handleSubmit = async (order) => {
    setLoader(true);
    console.log("Handle submit is getting called!");
    let orderObj = {
      ...order,
      orderStatus: "Cancelled",
      [`cancelledDate`]: new Date().getTime().toString(),
      orderStatusScore: 0,
      cancelNote: "Cacelled by customer",
    };

    await updateOrderRedux(orderObj);
    setLoader(false);
    toast.success("Order is cancelled!");
  };

  const orderAgain = async (order) => {
    setLoader(true);
    let orderObj = {
      ...order,
      id:
        new Date().getTime().toString() +
        (order.currentUser
          ? order.currentUser.id.slice(0, 3)
          : order.guest.id.slice(0, 3)),
      orderStatus: "Processing",
      date: new Date().getTime().toString(),
      orderStatusScore: 1,
    };
    await addToOrderRedux(orderObj);
    setLoader(false);
    toast.success("Your new order added successfully!");
  };
  let order = null;
  if (orders.length > 0) {
    order = orders.find((order) => order.id == orderId);
  }

  return (
    <>
      {order && (
        <div className="wd-form-order">
          <div className="order-head">
            <figure className="img-product">
              <Image
                alt="product"
                src={order.orders[0].product.pictures[0]}
                width="720"
                height="1005"
              />
            </figure>
            <div className="content">
              <div
                className="badge"
                style={{
                  backgroundColor:
                    order.orderStatus == "Processing"
                      ? "#1B75D0"
                      : order.orderStatus == "Confirmed"
                      ? "orange"
                      : order.orderStatus == "Packing"
                      ? "darkorange"
                      : order.orderStatus == "Delivered"
                      ? "green"
                      : "red",
                }}
              >
                {order.orderStatus}
              </div>
              <h6 className="mt-8 fw-5">Order #{order.id}</h6>
            </div>
          </div>
          <div className="tf-grid-layout md-col-2 gap-15">
            <div className="item">
              <div className="text-2 text_black-2">Ordered At</div>
              <div className="text-2 mt_4 fw-6">
                {" "}
                {new Date(Number(order.date)).toLocaleDateString()}
                {"   "}
                &nbsp;{new Date(Number(order.date)).toLocaleTimeString()}
              </div>
            </div>
            <div className="item">
              <div className="text-2 text_black-2">Delivery</div>
              <div
                className="text-2 mt_4 fw-6"
                style={{
                  backgroundColor: "cadetblue",
                  color: "white",
                  display: "inline",
                  padding: 2,
                  paddingLeft: 5,
                  paddingRight: 5,
                  fontWeight: "lighter",
                  fontSize: 12,
                  borderRadius: 2,
                }}
              >
                Regular delivery
              </div>
            </div>
            <div className="item">
              <div className="text-2 text_black-2">Amount Payable</div>
              <div className="text-2 mt_4 fw-6">
                Tk{" "}
                {order.subTotal +
                  order.deliveryCharge -
                  order.discountApplied -
                  (order.couponApplied ? order.couponApplied.discount : 0)}
              </div>
            </div>
            <div className="item">
              <div className="text-2 text_black-2">Address</div>
              <div className="text-2 mt_4 fw-6">
                {order.currentUser ? (
                  <>
                    {
                      order.currentUser.address.find(
                        (address) => address.defaultShipping
                      ).address
                    }
                    ,{" "}
                    {
                      order.currentUser.address.find(
                        (address) => address.defaultShipping
                      ).district
                    }
                    ,{" "}
                    {
                      order.currentUser.address.find(
                        (address) => address.defaultShipping
                      ).division
                    }
                  </>
                ) : (
                  <>
                    {
                      order.guest.address.find(
                        (address) => address.defaultShipping
                      ).address
                    }
                    ,{" "}
                    {
                      order.guest.address.find(
                        (address) => address.defaultShipping
                      ).district
                    }
                    ,{" "}
                    {
                      order.guest.address.find(
                        (address) => address.defaultShipping
                      ).division
                    }
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="widget-tabs style-has-border widget-order-tab">
            <ul className="widget-menu-tab">
              <li
                className={`item-title ${
                  seletedTab == "Order Tracking" ? "active" : ""
                }`}
              >
                <span
                  className="inner"
                  onClick={() => {
                    setSelectedTab("Order Tracking");
                  }}
                >
                  Order Tracking
                </span>
              </li>
              <li
                className={`item-title ${
                  seletedTab == "Item Details" ? "active" : ""
                }`}
              >
                <span
                  className="inner"
                  onClick={() => {
                    setSelectedTab("Item Details");
                  }}
                >
                  Item Details
                </span>
              </li>

              <li
                className={`item-title ${
                  seletedTab == "Delivery Address" ? "active" : ""
                }`}
              >
                <span
                  className="inner"
                  onClick={() => {
                    setSelectedTab("Delivery Address");
                  }}
                >
                  Delivery Address
                </span>
              </li>
            </ul>
            <div className="widget-content-tab">
              <div
                className={`widget-content-inner ${
                  seletedTab == "Order Tracking" ? "active" : ""
                }`}
              >
                {order.orderStatus !== "Cancelled" ? (
                  <p
                    className="text-2 text_success"
                    style={{ marginBottom: 10 }}
                  >
                    Thank you. Your order has been received
                  </p>
                ) : (
                  <p
                    className="text-2 text_success"
                    style={{ marginBottom: 10, color: "red" }}
                  >
                    Your order has been cancelled.
                  </p>
                )}
                {order.orderStatus !== "Cancelled" ? (
                  <div className="widget-timeline">
                    <ul className="timeline">
                      <li>
                        <div
                          className={`timeline-badge ${
                            order.orderStatusScore >= 1 ? "success" : ""
                          }`}
                        />
                        <div className="timeline-box">
                          <a className="timeline-panel" href="#">
                            <div className="text-2 fw-6"> Order Placed</div>
                            <span>Your order is successfully placed</span>
                          </a>
                          <p>
                            <strong>Date : </strong>
                            {new Date(Number(order.date)).toDateString("en-GB")}
                          </p>
                          <p>
                            <strong>Time : </strong>{" "}
                            {new Date(Number(order.date)).toLocaleTimeString(
                              "en-GB"
                            )}
                          </p>
                        </div>
                      </li>
                      <li>
                        <div
                          className={`timeline-badge ${
                            order.orderStatusScore >= 2 ? "success" : ""
                          }`}
                        />
                        <div className="timeline-box">
                          <a className="timeline-panel" href="#">
                            <div className="text-2 fw-6"> Processing</div>
                            <span>
                              {order.orderStatusScore >= 2 &&
                                "We are processing your order."}
                            </span>
                          </a>
                          {order.orderStatusScore >= 2 && (
                            <>
                              {" "}
                              <p>
                                <strong>Date : </strong>
                                {new Date(Number(order.date)).toDateString(
                                  "en-GB"
                                )}
                              </p>
                              <p>
                                <strong>Time : </strong>{" "}
                                {new Date(
                                  Number(order.date)
                                ).toLocaleTimeString("en-GB")}
                              </p>
                            </>
                          )}
                        </div>
                      </li>
                      <li>
                        <div
                          className={`timeline-badge ${
                            order.orderStatusScore >= 3 ? "success" : ""
                          }`}
                        />
                        <div className="timeline-box">
                          <a className="timeline-panel" href="#">
                            <div className="text-2 fw-6"> Confirmed</div>
                            <span>
                              {order.orderStatusScore >= 3 &&
                                "Your order is confirmed."}
                            </span>
                          </a>
                          {order.orderStatusScore >= 3 && (
                            <>
                              {" "}
                              <p>
                                <strong>Date : </strong>
                                {new Date(
                                  Number(order.confirmedDate)
                                ).toDateString("en-GB")}
                              </p>
                              <p>
                                <strong>Time : </strong>{" "}
                                {new Date(
                                  Number(order.confirmedDate)
                                ).toLocaleTimeString("en-GB")}
                              </p>
                            </>
                          )}
                        </div>
                      </li>
                      <li>
                        <div
                          className={`timeline-badge ${
                            order.orderStatusScore >= 4 ? "success" : ""
                          }`}
                        />
                        <div className="timeline-box">
                          <a className="timeline-panel" href="#">
                            <div className="text-2 fw-6"> Packing</div>
                            <span>
                              {order.orderStatusScore >= 4 &&
                                "We are packing your order."}
                            </span>
                          </a>
                          {order.orderStatusScore >= 4 && (
                            <>
                              {" "}
                              <p>
                                <strong>Date : </strong>
                                {new Date(
                                  Number(order.packingDate)
                                ).toDateString("en-GB")}
                              </p>
                              <p>
                                <strong>Time : </strong>{" "}
                                {new Date(
                                  Number(order.packingDate)
                                ).toLocaleTimeString()}
                              </p>
                            </>
                          )}
                        </div>
                      </li>
                      <li>
                        <div
                          className={`timeline-badge ${
                            order.orderStatusScore >= 5 ? "success" : ""
                          }`}
                        />
                        <div className="timeline-box">
                          <a className="timeline-panel" href="#">
                            <div className="text-2 fw-6"> Delivered</div>
                            <span
                              style={{
                                color:
                                  order.orderStatusScore >= 5
                                    ? "gray"
                                    : "white",
                              }}
                            >
                              Your order is delivered.
                            </span>
                          </a>
                          {order.orderStatusScore >= 5 && (
                            <>
                              {" "}
                              <p>
                                <strong>Date : </strong>
                                {new Date(
                                  Number(order.deliveredDate)
                                ).toDateString("en-GB")}
                              </p>
                              <p>
                                <strong>Time : </strong>{" "}
                                {new Date(
                                  Number(order.deliveredDate)
                                ).toLocaleTimeString()}
                              </p>
                            </>
                          )}
                        </div>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="widget-timeline">
                    <ul className="timeline">
                      <li>
                        <div className={`timeline-badge`} />
                        <div className="timeline-box">
                          <a className="timeline-panel" href="#">
                            <div className="text-2 fw-6"> Order Cancelled</div>
                            <span>Your order is cancelled</span>
                          </a>
                          <p>
                            <strong>Date : </strong>
                            {new Date(Number(order.cancelledDate)).toDateString(
                              "en-GB"
                            )}
                          </p>
                          <p>
                            <strong>Time : </strong>{" "}
                            {new Date(
                              Number(order.cancelledDate)
                            ).toLocaleTimeString("en-GB")}
                          </p>
                        </div>
                      </li>
                      <li>
                        <div
                          className={`timeline-badge ${
                            order.orderStatusScore >= 2 ? "success" : ""
                          }`}
                        />
                        <div className="timeline-box">
                          <a className="timeline-panel" href="#">
                            <div className="text-2 fw-6"> Processing</div>
                            <span>
                              {order.orderStatusScore >= 2 &&
                                "We are processing your order."}
                            </span>
                          </a>
                          {order.orderStatusScore >= 2 && (
                            <>
                              {" "}
                              <p>
                                <strong>Date : </strong>
                                {new Date(Number(order.date)).toDateString(
                                  "en-GB"
                                )}
                              </p>
                              <p>
                                <strong>Time : </strong>{" "}
                                {new Date(
                                  Number(order.date)
                                ).toLocaleTimeString("en-GB")}
                              </p>
                            </>
                          )}
                        </div>
                      </li>
                      <li>
                        <div
                          className={`timeline-badge ${
                            order.orderStatusScore >= 3 ? "success" : ""
                          }`}
                        />
                        <div className="timeline-box">
                          <a className="timeline-panel" href="#">
                            <div className="text-2 fw-6"> Confirmed</div>
                            <span>
                              {order.orderStatusScore >= 3 &&
                                "Your order is confirmed."}
                            </span>
                          </a>
                          {order.orderStatusScore >= 3 && (
                            <>
                              {" "}
                              <p>
                                <strong>Date : </strong>
                                {new Date(
                                  Number(order.confirmedDate)
                                ).toDateString("en-GB")}
                              </p>
                              <p>
                                <strong>Time : </strong>{" "}
                                {new Date(
                                  Number(order.confirmedDate)
                                ).toLocaleTimeString("en-GB")}
                              </p>
                            </>
                          )}
                        </div>
                      </li>
                      <li>
                        <div
                          className={`timeline-badge ${
                            order.orderStatusScore >= 4 ? "success" : ""
                          }`}
                        />
                        <div className="timeline-box">
                          <a className="timeline-panel" href="#">
                            <div className="text-2 fw-6"> Packing</div>
                            <span>
                              {order.orderStatusScore >= 4 &&
                                "We are packing your order."}
                            </span>
                          </a>
                          {order.orderStatusScore >= 4 && (
                            <>
                              {" "}
                              <p>
                                <strong>Date : </strong>
                                {new Date(
                                  Number(order.packingDate)
                                ).toDateString("en-GB")}
                              </p>
                              <p>
                                <strong>Time : </strong>{" "}
                                {new Date(
                                  Number(order.packingDate)
                                ).toLocaleTimeString()}
                              </p>
                            </>
                          )}
                        </div>
                      </li>
                      <li>
                        <div
                          className={`timeline-badge ${
                            order.orderStatusScore >= 5 ? "success" : ""
                          }`}
                        />
                        <div className="timeline-box">
                          <a className="timeline-panel" href="#">
                            <div className="text-2 fw-6"> Delivered</div>
                            <span
                              style={{
                                color:
                                  order.orderStatusScore >= 5
                                    ? "gray"
                                    : "white",
                              }}
                            >
                              Your order is delivered.
                            </span>
                          </a>
                          {order.orderStatusScore >= 5 && (
                            <>
                              {" "}
                              <p>
                                <strong>Date : </strong>
                                {new Date(
                                  Number(order.deliveredDate)
                                ).toDateString("en-GB")}
                              </p>
                              <p>
                                <strong>Time : </strong>{" "}
                                {new Date(
                                  Number(order.deliveredDate)
                                ).toLocaleTimeString()}
                              </p>
                            </>
                          )}
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div
                className={`widget-content-inner ${
                  seletedTab == "Item Details" ? "active" : ""
                }`}
              >
                <div className="tf-page-cart-footer">
                  <div className="tf-cart-footer-inner">
                    <div className="tf-page-cart-checkout widget-wrap-checkout">
                      <ul className="wrap-checkout-product">
                        {order.orders.map((item, i) => (
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
                                        <div
                                          key={index}
                                          style={{ marginTop: -5 }}
                                        >
                                          {item.product.savedAttributes.find(
                                            (attr) => attr.id == comb.parentId
                                          )
                                            ? item.product.savedAttributes.find(
                                                (attr) =>
                                                  attr.id == comb.parentId
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
                              <span
                                className="price"
                                style={{ fontWeight: "bold" }}
                              >
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

                      <div
                        className="d-flex"
                        style={{
                          color: "#31a56d",
                          fontWeight: "bold",
                          fontSize: 15,
                        }}
                      >
                        You are saving ৳ {order.discountApplied} in this order.{" "}
                      </div>

                      <div className="d-flex justify-content-between line pb_20">
                        <h6 className="fw-5">Subtotal</h6>
                        <h6 className="total fw-5">৳ {order.subTotal}</h6>
                      </div>
                      <div className="d-flex justify-content-between line pb_20">
                        <h6 className="fw-5">Discount applied</h6>
                        <h6 className="total fw-5">
                          {" "}
                          -৳ {order.discountApplied}
                        </h6>
                      </div>
                      {order.couponApplied && (
                        <div className="d-flex justify-content-between line pb_20">
                          <h6 className="fw-5">
                            Coupon applied{" "}
                            <span style={{ color: "#ff8084" }}>
                              ({order.couponApplied.name})
                            </span>
                          </h6>
                          <h6 className="total fw-5">
                            {" "}
                            -৳ {order.couponApplied.discount}
                          </h6>
                        </div>
                      )}
                      <div className="d-flex justify-content-between line pb_20">
                        <h6 className="fw-5">Delivery Charge</h6>
                        <h6 className="total fw-5">+৳{order.deliveryCharge}</h6>
                      </div>

                      <div className="d-flex justify-content-between line pb_20">
                        <h6 className="fw-5"> Amount Payable</h6>
                        <h6
                          className="total fw-5"
                          style={{ fontWeight: "bold" }}
                        >
                          ৳
                          {order.subTotal +
                            order.deliveryCharge -
                            order.discountApplied -
                            (order.couponApplied
                              ? order.couponApplied.discount
                              : 0)}
                        </h6>
                      </div>
                      {order.orderStatus !== "Cancelled" &&
                      order.orderStatus !== "Processing" ? (
                        <button
                          className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center"
                          onClick={() => {
                            orderAgain(order);
                          }}
                        >
                          {loader ? (
                            <ClipLoader
                              loading={loader}
                              size={19}
                              color="white"
                            />
                          ) : (
                            "Order again"
                          )}
                        </button>
                      ) : null}
                      {order.orderStatus !== "Cancelled" &&
                      order.orderStatus == "Processing" ? (
                        <button
                          className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center"
                          onClick={() => {
                            handleSubmit(order);
                          }}
                        >
                          {loader ? (
                            <ClipLoader
                              loading={loader}
                              size={19}
                              color="white"
                            />
                          ) : (
                            "Cancel Order"
                          )}
                        </button>
                      ) : null}
                      {order.cancelNote ? (
                        <div
                          className="justify-content-center"
                          style={{ color: "red", fontWeight: "bold" }}
                        >
                          Cancelled by customer
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`widget-content-inner ${
                  seletedTab == "Delivery Address" ? "active" : ""
                }`}
              >
                {order.currentUser ? (
                  <ul>
                    <li>
                      Name :{" "}
                      <span className="fw-7">
                        {" "}
                        {
                          order.currentUser.address.find(
                            (address) => address.defaultShipping
                          ).fullName
                        }
                      </span>
                    </li>
                    <li>
                      Mobile No :{" "}
                      <span className="fw-7">
                        {" "}
                        {
                          order.currentUser.address.find(
                            (address) => address.defaultShipping
                          ).mobileNo
                        }
                      </span>
                    </li>
                    <li>
                      Address :{" "}
                      <span className="fw-7">
                        {
                          order.currentUser.address.find(
                            (address) => address.defaultShipping
                          ).address
                        }
                      </span>
                    </li>
                    <li>
                      District :
                      <span className="fw-7">
                        {" "}
                        {
                          order.currentUser.address.find(
                            (address) => address.defaultShipping
                          ).district
                        }
                      </span>
                    </li>
                    <li>
                      Division :
                      <span className="fw-7">
                        {" "}
                        {
                          order.currentUser.address.find(
                            (address) => address.defaultShipping
                          ).division
                        }
                      </span>
                    </li>
                  </ul>
                ) : (
                  <ul>
                    <li>
                      Name :{" "}
                      <span className="fw-7">
                        {" "}
                        {
                          order.guest.address.find(
                            (address) => address.defaultShipping
                          ).fullName
                        }
                      </span>
                    </li>
                    <li>
                      Mobile No :{" "}
                      <span className="fw-7">
                        {" "}
                        {
                          order.guest.address.find(
                            (address) => address.defaultShipping
                          ).mobileNo
                        }
                      </span>
                    </li>
                    <li>
                      Address :{" "}
                      <span className="fw-7">
                        {
                          order.guest.address.find(
                            (address) => address.defaultShipping
                          ).address
                        }
                      </span>
                    </li>
                    <li>
                      District :
                      <span className="fw-7">
                        {" "}
                        {
                          order.guest.address.find(
                            (address) => address.defaultShipping
                          ).district
                        }
                      </span>
                    </li>
                    <li>
                      Division :
                      <span className="fw-7">
                        {" "}
                        {
                          order.guest.address.find(
                            (address) => address.defaultShipping
                          ).division
                        }
                      </span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    orders: state.cart.orders,
    freeShipping: state.cart.freeShipping,
    coupon: state.cart.coupon,
  };
};
export default connect(mapStateToProps, {
  setTotalRedux,
  updateOrderRedux,
  addToOrderRedux,
  getSingleOrderRedux,
})(OrderDetails);
