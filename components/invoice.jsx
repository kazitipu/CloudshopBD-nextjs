"use client";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  setTotalRedux,
  updateOrderRedux,
  addToOrderRedux,
  getSingleOrderRedux,
} from "@/actions";
import Image from "next/image";
const Invoice = ({
  orderId,
  orders,
  updateOrderRedux,
  addToOrderRedux,
  getSingleOrderRedux,
  currentUser,
  guest,
}) => {
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

  let order = null;
  if (orders.length > 0) {
    order = orders.find((order) => order.id == orderId);
  }
  let currentUser2 = null;
  if (currentUser && currentUser.uid) {
    currentUser2 = currentUser;
  } else {
    currentUser2 = guest;
  }
  return (
    <div className="wrapper-invoice">
      <section className="invoice-section">
        <div className="cus-container2">
          <div className="top">
            <a href="#" className="tf-btn btn-fill animate-hover-btn">
              Print this invoice
            </a>
          </div>
          {order && (
            <div className="box-invoice">
              <div className="header" style={{ paddingTop: 100 }}>
                <div className="wrap-top" style={{ marginBottom: 40 }}>
                  <div className="box-left">
                    <a href="index.html">
                      <img
                        src="images/logo/cloudshopBD.png"
                        alt="logo"
                        className="logo"
                      />
                    </a>
                  </div>
                  <div className="box-right">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <div className="title" style={{ marginTop: 20 }}>
                        Invoice #{order.id}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="wrap-date" style={{ marginBottom: 30 }}>
                  <div className="box-left">
                    <label htmlFor="">Order date:</label>
                    <span className="date">
                      {" "}
                      {new Date(Number(order.date)).toLocaleDateString()}
                      {"   "}
                      &nbsp;{new Date(Number(order.date)).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="box-right">
                    <label htmlFor="">Delivery:</label>
                    <span
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
                      {" "}
                      Regular delivery
                    </span>
                  </div>
                </div>
                <div className="wrap-info">
                  {order.currentUser ? (
                    <div className="box-left">
                      <div className="title">Delivery Address</div>
                      <div className="sub">
                        {" "}
                        {
                          order.currentUser.address.find(
                            (address) => address.defaultShipping
                          ).fullName
                        }
                      </div>
                      <p className="desc">
                        {
                          order.currentUser.address.find(
                            (address) => address.defaultShipping
                          ).mobileNo
                        }
                        <br />{" "}
                        {
                          order.currentUser.address.find(
                            (address) => address.defaultShipping
                          ).address
                        }
                        <br />{" "}
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
                      </p>
                    </div>
                  ) : (
                    <div className="box-left">
                      <div className="title">Delivery Address</div>
                      <div className="sub">
                        {
                          order.guest.address.find(
                            (address) => address.defaultShipping
                          ).fullName
                        }
                      </div>
                      <p className="desc">
                        {
                          order.guest.address.find(
                            (address) => address.defaultShipping
                          ).mobileNo
                        }
                        <br />
                        {
                          order.guest.address.find(
                            (address) => address.defaultShipping
                          ).address
                        }
                        <br />{" "}
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
                      </p>
                    </div>
                  )}
                </div>
                <div className="wrap-table-invoice">
                  <table className="invoice-table">
                    <thead>
                      <tr className="title">
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>

                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orders.map((item, index) => (
                        <tr className="content" key={index}>
                          <td
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              borderBottom: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}
                          >
                            {" "}
                            <img
                              alt="product"
                              src={
                                item.selectedVariation &&
                                item.selectedVariation.id &&
                                item.selectedVariation.pictures &&
                                item.selectedVariation.pictures.length > 0
                                  ? item.selectedVariation.pictures[0]
                                  : item.product.pictures[0]
                              }
                              style={{
                                objectFit: "cover",
                                borderRadius: 5,
                                height: 80,
                                width: 80,
                              }}
                            />
                            <div style={{ marginLeft: 10 }}>
                              {item.product.name.slice(0, 30)}{" "}
                              <span className="variant">
                                {" "}
                                {item.selectedVariation &&
                                  item.selectedVariation.id &&
                                  item.selectedVariation.combination.map(
                                    (comb, index) => (
                                      <div
                                        key={index}
                                        style={{ marginTop: -8, fontSize: 12 }}
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
                              </span>
                            </div>
                          </td>
                          <td
                            style={{
                              textAlign: "start",
                              verticalAlign: "top",
                              borderBottom: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}
                          >
                            {item.quantity}
                          </td>
                          <td
                            style={{
                              textAlign: "start",
                              verticalAlign: "top",
                              borderBottom: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}
                          >
                            <span className="price">
                              ৳{getPrice4(item)} <br />
                              <span
                                style={{
                                  fontWeight: "lighter",
                                  fontSize: 11,
                                  textDecoration: "line-through",
                                  marginLeft: 5,
                                }}
                              >
                                ৳{getPrice3(item)}
                              </span>
                            </span>
                          </td>

                          <td
                            style={{
                              textAlign: "start",
                              verticalAlign: "top",
                              borderBottom: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}
                          >
                            {" "}
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
                          </td>
                        </tr>
                      ))}
                      <tr
                        className="content"
                        style={{ borderTop: "1px solid gainsboro" }}
                      >
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        >
                          Subtotal
                        </td>
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        />
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        />
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        >
                          {" "}
                          ৳ {order.subTotal}
                        </td>
                      </tr>
                      <tr className="content">
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        >
                          Discount applied
                        </td>
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        />
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        />
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        >
                          -৳ {order.discountApplied}
                        </td>
                      </tr>
                      {order.couponApplied && (
                        <tr className="content">
                          <td
                            className="total"
                            tyle={{
                              paddingTop: 5,
                              paddingBottom: 5,
                              borderBottom: "1px solid gainsboro",
                            }}
                          >
                            Coupon applied{" "}
                            <span
                              style={{ fontSize: 12, color: "#ff8084" }}
                            ></span>
                          </td>
                          <td
                            style={{
                              paddingTop: 5,
                              paddingBottom: 5,
                              borderBottom: "1px solid gainsboro",
                            }}
                          />
                          <td
                            style={{
                              paddingTop: 5,
                              paddingBottom: 5,
                              borderBottom: "1px solid gainsboro",
                            }}
                          />
                          <td
                            className="total"
                            style={{
                              paddingTop: 5,
                              paddingBottom: 5,
                              borderBottom: "1px solid gainsboro",
                            }}
                          >
                            -৳ {order.couponApplied.discount}
                          </td>
                        </tr>
                      )}
                      <tr className="content">
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        >
                          Delivery Charge
                        </td>
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        />
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        />
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: "1px solid gainsboro",
                          }}
                        >
                          +৳ {order.deliveryCharge}
                        </td>
                      </tr>
                      <tr className="content">
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            fontWeight: "bold",
                          }}
                        >
                          Total Bill
                        </td>
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                          }}
                        />
                        <td
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                          }}
                        />
                        <td
                          className="total"
                          style={{
                            paddingTop: 5,
                            paddingBottom: 5,
                            fontWeight: "bold",
                          }}
                        >
                          ৳{" "}
                          {order.subTotal +
                            order.deliveryCharge -
                            order.discountApplied -
                            (order.couponApplied
                              ? order.couponApplied.discount
                              : 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="footer">
                <ul className="box-contact">
                  <li>www.cloudshopbd.com</li>
                  <li>invoice@cloudshopbd.com</li>
                  <li>+8801707773082</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    orders: state.cart.orders,
    freeShipping: state.cart.freeShipping,
    coupon: state.cart.coupon,
    currentUser: state.users.currentUser,
    guest: state.users.guest,
  };
};
export default connect(mapStateToProps, {
  setTotalRedux,
  updateOrderRedux,
  addToOrderRedux,
  getSingleOrderRedux,
})(Invoice);
