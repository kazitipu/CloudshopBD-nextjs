"use client";
import { layouts } from "@/data/shop";
import ProductGrid from "./ProductGrid";
import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import ShopFilter from "./ShopFilter";
import Sorting from "./Sorting";
import { connect } from "react-redux";
import {
  getAllLatestProductsRedux,
  getSingleCategoryProductsRedux,
} from "@/actions";
const ShopDefault = ({
  getAllLatestProductsRedux,
  getSingleCategoryProductsRedux,
  latestProducts,
  categoryId,
  category,
  categories,
  results,
  products2,
}) => {
  const [gridItems, setGridItems] = useState(6);
  const [products, setProducts] = useState([]);
  const [finalSorted, setFinalSorted] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (categoryId == "latest") {
        getAllLatestProductsRedux();
      } else {
        if (results.length > 0) {
          if (category && results.length > 0) {
            let categories = results.map((cat) => cat.id);
            console.log(categories);
            getSingleCategoryProductsRedux(categories.slice(0, 10), null);
          }
        }
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    setProducts(latestProducts);
  }, [latestProducts]);
  useEffect(() => {
    setProducts(products2);
  }, [products2]);
  return (
    <>
      <section className="flat-spacing-2">
        <div className="container">
          <div className="tf-shop-control grid-3 align-items-center">
            <div className="tf-control-filter">
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "clamp(15px, 2vw, 32px)",
                  paddingBottom: 7,
                  borderBottom: "2px solid black",
                  alignSelf: "flex-start",
                  display: "inline-block",
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
              >
                {categoryId == "latest" ? "New Arrival" : category.name}
              </div>
            </div>
            <ul className="tf-control-layout d-flex justify-content-center">
              {layouts.map((layout, index) => (
                <li
                  key={index}
                  className={`tf-view-layout-switch ${layout.className} ${
                    gridItems == layout.dataValueGrid ? "active" : ""
                  }`}
                  onClick={() => setGridItems(layout.dataValueGrid)}
                >
                  <div className="item">
                    <span className={`icon ${layout.iconClass}`} />
                  </div>
                </li>
              ))}
            </ul>
            <div className="tf-control-sorting d-flex justify-content-end">
              <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
                <Sorting setFinalSorted={setFinalSorted} products={products} />
              </div>
            </div>
          </div>
          <div className="wrapper-control-shop">
            <div className="meta-filter-shop" />
            <ProductGrid allproducts={finalSorted} gridItems={gridItems} />
            {/* pagination */}
            {finalSorted.length ? (
              <ul className="tf-pagination-wrap tf-pagination-list tf-pagination-btn">
                <Pagination />
              </ul>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
      {/* <ShopFilter setProducts={setProducts} /> */}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    latestProducts: state.categories.latestProducts,
    products2: state.products.products,
  };
};
export default connect(mapStateToProps, {
  getAllLatestProductsRedux,
  getSingleCategoryProductsRedux,
})(ShopDefault);
