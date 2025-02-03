"use client";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import DefaultShopDetails from "@/components/shopDetails/DefaultShopDetails";
import Details16 from "@/components/shopDetails/Details16";
import Products from "@/components/shopDetails/Products";
import RecentProducts from "@/components/shopDetails/RecentProducts";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import React from "react";
import Link from "next/link";
import { getSingleProductRedux } from "@/actions";
import { allProducts } from "@/data/products";
import ProductSinglePrevNext from "@/components/common/ProductSinglePrevNext";
import { connect } from "react-redux";
import { useEffect } from "react";
import "./ProductDetailPage.css";
const page = ({ params, getSingleProductRedux, product }) => {
  useEffect(() => {
    if (params.id) {
      getSingleProductRedux(params.id);
    }
  }, []);
  console.log(product);
  return (
    <>
      {product && (
        <>
          <Header2 />
          <div className="tf-breadcrumb">
            <div className="container">
              <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
                <div className="tf-breadcrumb-list">
                  <Link href={`/`} className="text">
                    Home
                  </Link>
                  <i className="icon icon-arrow-right" />

                  <span className="text two-line-span">{product.name}</span>
                </div>
              </div>
            </div>
          </div>
          <Details16 product={product} />
          <ShopDetailsTab product={product} />
          <Products item={product.selectedCategories[0]} />
          {/* <RecentProducts />  */}
          <Footer1 />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    product: state.products.productObj,
  };
};
export default connect(mapStateToProps, { getSingleProductRedux })(page);
