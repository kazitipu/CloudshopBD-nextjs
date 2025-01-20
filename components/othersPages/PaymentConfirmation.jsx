"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { connect } from "react-redux";

const PaymentConfirmation = ({ orderId }) => {
  console.log(orderId);

  useEffect(() => {}, []);
  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div
              className="tf-page-cart-checkout"
              style={{ background: "white" }}
            >
              <div className="d-flex gap-10">
                <Link
                  href={`/blog-sidebar-left`}
                  className="tf-btn w-100 btn-outline animate-hover-btn rounded-0 justify-content-center"
                >
                  <span>Continue Shopping</span>
                </Link>
                <a
                  href={`/my-account-orders`}
                  className="tf-btn w-100 btn-fill animate-hover-btn radius-3 justify-content-center"
                >
                  <span>View Orders</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps, {})(PaymentConfirmation);
