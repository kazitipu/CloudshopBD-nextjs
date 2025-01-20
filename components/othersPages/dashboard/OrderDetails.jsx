"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { connect } from "react-redux";
import { getSingleOrder } from "@/firebase/firebase.utils";
const OrderDetails = ({ orderId, orders }) => {
  const [order, setOrder] = useState(null);
  useEffect(() => {
    const getOrder = async () => {
      let order = null;
      if (orders && orders.length > 0) {
        order = orders.find((order) => order.id === orderId);
      } else {
        order = await getSingleOrder(orderId);
      }
      setOrder(order);
    };
    getOrder();
  }, []);

  useEffect(() => {
    const tabs = () => {
      console.log("tab is getting called!");
      document.querySelectorAll(".widget-tabs").forEach((widgetTab) => {
        const titles = widgetTab.querySelectorAll(
          ".widget-menu-tab .item-title"
        );

        titles.forEach((title, index) => {
          title.addEventListener("click", () => {
            // Remove active class from all menu items
            titles.forEach((item) => item.classList.remove("active"));
            // Add active class to the clicked item
            title.classList.add("active");

            // Remove active class from all content items
            const contentItems = widgetTab.querySelectorAll(
              ".widget-content-tab > *"
            );
            contentItems.forEach((content) =>
              content.classList.remove("active")
            );

            // Add active class and fade-in effect to the matching content item
            const contentActive = contentItems[index];
            contentActive.classList.add("active");
            contentActive.style.display = "block";
            contentActive.style.opacity = 0;
            setTimeout(() => (contentActive.style.opacity = 1), 0);

            // Hide all siblings' content
            contentItems.forEach((content, idx) => {
              if (idx !== index) {
                content.style.display = "none";
              }
            });
          });
        });
      });
    };

    // Call the function to initialize the tabs
    tabs();

    // Clean up event listeners when the component unmounts
    return () => {
      document
        .querySelectorAll(".widget-menu-tab .item-title")
        .forEach((title) => {
          title.removeEventListener("click", () => {});
        });
    };
  }, []);
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
              <li className="item-title active">
                <span className="inner">Order Tracking</span>
              </li>
              <li className="item-title">
                <span className="inner">Item Details</span>
              </li>
              <li className="item-title">
                <span className="inner">Courier</span>
              </li>
              <li className="item-title">
                <span className="inner">Receiver</span>
              </li>
            </ul>
            <div className="widget-content-tab">
              <div className="widget-content-inner active">
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
                              {new Date(Number(order.date)).toLocaleTimeString(
                                "en-GB"
                              )}
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
                              {new Date(Number(order.packingDate)).toDateString(
                                "en-GB"
                              )}
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
                                order.orderStatusScore >= 5 ? "gray" : "white",
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
              </div>
              <div className="widget-content-inner">
                <div className="order-head">
                  <figure className="img-product">
                    <img
                      alt="product"
                      src="images/products/brown.jpg"
                      width="720"
                      height="1005"
                    />
                  </figure>
                  <div className="content">
                    <div className="text-2 fw-6">Ribbed modal T-shirt</div>
                    <div className="mt_4">
                      <span className="fw-6">Price :</span> $28.95
                    </div>
                    <div className="mt_4">
                      <span className="fw-6">Size :</span> XL
                    </div>
                  </div>
                </div>
                <ul>
                  <li className="d-flex justify-content-between text-2">
                    <span>Total Price</span>
                    <span className="fw-6">$28.95</span>
                  </li>
                  <li className="d-flex justify-content-between text-2 mt_4 pb_8 line">
                    <span>Total Discounts</span>
                    <span className="fw-6">$10</span>
                  </li>
                  <li className="d-flex justify-content-between text-2 mt_8">
                    <span>Order Total</span>
                    <span className="fw-6">$18.95</span>
                  </li>
                </ul>
              </div>
              <div className="widget-content-inner">
                <p>
                  Our courier service is dedicated to providing fast, reliable,
                  and secure delivery solutions tailored to meet your needs.
                  Whether you're sending documents, parcels, or larger
                  shipments, our team ensures that your items are handled with
                  the utmost care and delivered on time. With a commitment to
                  customer satisfaction, real-time tracking, and a wide network
                  of routes, we make it easy for you to send and receive
                  packages both locally and internationally. Choose our service
                  for a seamless and efficient delivery experience.
                </p>
              </div>
              <div className="widget-content-inner">
                <p className="text-2 text_success">
                  Thank you Your order has been received
                </p>
                <ul className="mt_20">
                  <li>
                    Order Number : <span className="fw-7">#17493</span>
                  </li>
                  <li>
                    Date : <span className="fw-7"> 17/07/2024, 02:34pm</span>
                  </li>
                  <li>
                    Total : <span className="fw-7">$18.95</span>
                  </li>
                  <li>
                    Payment Methods :
                    <span className="fw-7">Cash on Delivery</span>
                  </li>
                </ul>
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
  };
};
export default connect(mapStateToProps, {})(OrderDetails);
