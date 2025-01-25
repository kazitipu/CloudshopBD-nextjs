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
import { algoliasearch } from "algoliasearch";
import { fetchAllProducts } from "@/firebase/firebase.utils";
// search api key for use in client side code
export const searchClient = algoliasearch(
  "NILPZSAV6Q",
  "f8dd9476cf54f47a7e1594f3f3b238cb"
);
const ShopDefault = ({
  getAllLatestProductsRedux,
  getSingleCategoryProductsRedux,
  latestProducts,
  categoryId,
  category,
  categories,
  results,
  products2,
  searchParam,
}) => {
  const [gridItems, setGridItems] = useState(6);
  const [products, setProducts] = useState([]);
  const [finalSorted, setFinalSorted] = useState([]);
  const [nbHits, setNbHits] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      if (searchParam) {
        const response = await searchClient.searchSingleIndex({
          indexName: "products",
          searchParams: { query: searchParam, hitsPerPage: 50 },
        });
        console.log(response);
        const objectIDs = response.hits.map((hit) => hit.objectID);
        const chunkArray = (array, chunkSize) => {
          const chunks = [];
          for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
          }
          return chunks;
        };
        const chunks = chunkArray(objectIDs, 10);
        setNbHits(response.nbHits);
        let products = await fetchAllProducts(chunks);
        setProducts(products);
      } else if (categoryId == "latest") {
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
                {searchParam ? (
                  <span style={{ fontWeight: "lighter" }}>
                    Search result for {searchParam}
                  </span>
                ) : categoryId == "latest" ? (
                  "New Arrival"
                ) : (
                  category.name
                )}
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
            <ProductGrid
              allproducts={finalSorted}
              gridItems={gridItems}
              nbHits={nbHits}
            />
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
