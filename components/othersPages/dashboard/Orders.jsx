"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import { getAllOrdersRedux } from "@/actions";
const Orders = ({ getAllOrdersRedux, currentUser, guest, orders }) => {
  useEffect(() => {
    const getAllOrders = async () => {
      if (currentUser) {
        await getAllOrdersRedux(currentUser.uid);
      } else if (guest) {
        await getAllOrdersRedux(guest.id);
      }
    };
    getAllOrders();
  }, [currentUser, guest]);
  return (
    <div className="my-account-content account-order">
      <div className="wrap-account-order">
        {orders && orders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th className="fw-6">Order</th>
                <th className="fw-6">Date</th>
                <th className="fw-6">Status</th>
                <th className="fw-6">Total</th>
                <th className="fw-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr className="tf-order-item">
                  <td>#{order.id}</td>
                  <td>{new Date(Number(order.date)).toLocaleDateString()}</td>
                  <td>
                    <div
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
                        padding: 5,
                        paddingTop: 2,
                        paddingBottom: 2,
                        fontSize: 12,
                        borderRadius: 5,
                        color: "white",
                        alignSelf: "flex-start",
                        display: "inline",
                      }}
                    >
                      {order.orderStatus}
                    </div>
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {" "}
                    ৳{" "}
                    {order.subTotal +
                      order.deliveryCharge -
                      order.discountApplied -
                      (order.couponApplied ? order.couponApplied.discount : 0)}
                  </td>
                  <td>
                    <Link
                      href={`/my-account-orders-details?orderId=${order.id}`}
                      className="tf-btn btn-fill animate-hover-btn rounded-0 justify-content-center"
                    >
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginTop: 25,
              fontSize: 15,
            }}
          >
            Sorry You do not have any orders here.{" "}
          </div>
        )}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    cartData: state.cart.cartData,
    orders: state.cart.orders,
    currentUser: state.users.currentUser,
    guest: state.users.guest,
  };
};
export default connect(mapStateToProps, { getAllOrdersRedux })(Orders);
