"use client";
import { allProducts } from "@/data/products";
import { useContextElement } from "@/context/Context";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import ProductCard from "../shopCards/ProductCardWishlist";
import Link from "next/link";

const Wishlist = ({ wishlist }) => {
  return (
    <section className="flat-spacing-2">
      <div className="container">
        <div className="grid-layout wrapper-shop" data-grid="grid-4">
          {wishlist.map((elm, i) => (
            <ProductCard key={i} product={elm} />
          ))}
        </div>
        {wishlist.length == 0 && (
          <>
            <div
              className="row align-items-center w-100"
              style={{ rowGap: "20px" }}
            >
              <div className="col-lg-3 col-md-6 fs-18">
                Your wishlist is empty
              </div>
              <div className="col-lg-3  col-md-6">
                <Link
                  href={`/shop-default`}
                  className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                >
                  Explore Products!
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    wishlist: state.wishlist.wishlist,
  };
};
export default connect(mapStateToProps, {})(Wishlist);
