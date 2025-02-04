"use client";
import React, { useState } from "react";
import { getAllProductsRedux, clearAllProductsRedux } from "@/actions";
import { connect } from "react-redux";
import { algoliasearch } from "algoliasearch";
import { fetchAllProducts } from "@/firebase/firebase.utils";
export const searchClient = algoliasearch(
  "NILPZSAV6Q",
  "f8dd9476cf54f47a7e1594f3f3b238cb"
);
const Pagination = ({
  pageNo,
  nbHits,
  setPageNo,
  searchParam,
  category,
  algolia,
  getAllProductsRedux,
  clearAllProductsRedux,
  setProducts,
}) => {
  return (
    <>
      <li>
        <a
          onClick={async () => {
            if (algolia) {
              if (pageNo > 1) {
                clearAllProductsRedux();
                window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to the top
                const response = await searchClient.searchSingleIndex({
                  indexName: "products",
                  searchParams: {
                    query: category ? category.name : searchParam,
                    hitsPerPage: 50,
                    page: pageNo - 2,
                  },
                });
                console.log(response);
                if (response && response.hits && response.hits.length > 0) {
                  const objectIDs = response.hits.map((hit) => hit.objectID);
                  const chunkArray = (array, chunkSize) => {
                    const chunks = [];
                    for (let i = 0; i < array.length; i += chunkSize) {
                      chunks.push(array.slice(i, i + chunkSize));
                    }
                    return chunks;
                  };
                  const chunks = chunkArray(objectIDs, 10);

                  let products = await fetchAllProducts(chunks);
                  setProducts(products);
                  setPageNo(pageNo - 1);
                }

                return;
              } else {
                alert("Already on the first page");
                return;
              }
            }
            if (pageNo > 1) {
              window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to the top
              clearAllProductsRedux();
              await getAllProductsRedux(pageNo - 1);
              setPageNo(pageNo - 1);
            } else {
              alert("Already on the first page");
            }
          }}
          className="pagination-link animate-hover-btn"
        >
          <span className="icon icon-arrow-left" />
        </a>
      </li>
      <li className="active">
        <a
          className="pagination-link"
          // onClick={() => handlePageClick(1)}
        >
          {pageNo}
        </a>
      </li>{" "}
      <li>
        <a
          onClick={async () => {
            // algolia serch kore pawa product er jonno ekrokom pagination
            if (algolia) {
              if (nbHits > pageNo * 50) {
                window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to the
                clearAllProductsRedux();
                const response = await searchClient.searchSingleIndex({
                  indexName: "products",
                  searchParams: {
                    query: category ? category.name : searchParam,
                    hitsPerPage: 50,
                    page: pageNo,
                  },
                });
                console.log(response);
                if (response && response.hits && response.hits.length > 0) {
                  const objectIDs = response.hits.map((hit) => hit.objectID);
                  const chunkArray = (array, chunkSize) => {
                    const chunks = [];
                    for (let i = 0; i < array.length; i += chunkSize) {
                      chunks.push(array.slice(i, i + chunkSize));
                    }
                    return chunks;
                  };
                  const chunks = chunkArray(objectIDs, 10);

                  let products = await fetchAllProducts(chunks);
                  setProducts(products);
                }
                setPageNo(pageNo + 1);
                return;
              } else {
                alert("Already on the last page.");
                return;
              }
            }
            // r normal pagination er jonno ekrokom pagination
            if (pageNo < Math.ceil(nbHits / 50)) {
              window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to the
              clearAllProductsRedux();
              await getAllProductsRedux(pageNo + 1);

              setPageNo(pageNo + 1);
            } else {
              alert("Already on the last page");
            }
          }}
          className="pagination-link animate-hover-btn"
        >
          <span className="icon icon-arrow-right" />
        </a>
      </li>
    </>
  );
};

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps, {
  getAllProductsRedux,
  clearAllProductsRedux,
})(Pagination);
