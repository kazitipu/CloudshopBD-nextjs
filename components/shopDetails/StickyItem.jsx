"use client";
import { options } from "@/data/singleProductOptions";
import Image from "next/image";
import React from "react";
import Quantity from "./Quantity";
import { products4 } from "@/data/products";
import { useContextElement } from "@/context/Context";

export default function StickyItem({ soldOut = false, product, total }) {
  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  return (
    <div className="tf-sticky-btn-atc">
      <div className="container">
        <div className="tf-height-observer w-100 d-flex align-items-center">
          <div className="tf-sticky-atc-product d-flex align-items-center">
            <div className="tf-sticky-atc-img">
              <Image
                className="lazyloaded"
                data-src={product.pictures ? product.pictures[0] : ""}
                alt="image"
                src={product.pictures ? product.pictures[0] : ""}
                width={770}
                height={1075}
              />
            </div>
            <div
              className="tf-sticky-atc-title fw-5 d-xl-block d-none"
              style={{ fontWeight: "bold" }}
            >
              Total Tk {total}
            </div>
          </div>
          <div className="tf-sticky-atc-infos">
            <form onSubmit={(e) => e.preventDefault()} className="">
              <div className="tf-sticky-atc-btns">
                <a
                  onClick={async () => {
                    setLoader(true);
                    openCartModal();
                    let cartObj = {
                      quantity: quantity,
                      productId: product.id,
                      product: product,
                      selectedVariation: state.variation
                        ? state.variation
                        : null,
                    };
                    setState({
                      ...state,
                    });

                    if (currentUser && currentUser.uid) {
                      await addToCartRedux(cartObj, currentUser);
                    } else {
                      // for guest add to local storage of the browser
                      await addToCartRedux2(cartObj);
                    }
                    toast("item added to cart.");
                    setState({
                      ...state,
                    });
                    setLoader(false);
                  }}
                  className="tf-btn btn-fill radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn"
                >
                  <span>Add to cart</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
