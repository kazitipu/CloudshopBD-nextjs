"use client";
import React, { useEffect, useState } from "react";
import { products1 } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "../shopCards/ProductCard";
import { Navigation, Pagination } from "swiper/modules";
import { connect } from "react-redux";
import {
  getAllCategoriesRedux,
  getSimilarCategoryProductsRedux,
} from "@/actions";

const Products = (props) => {
  const { item } = props;
  const [result, setResult] = useState([]);

  useEffect(() => {
    props.getAllCategoriesRedux();
  }, []);
  useEffect(() => {
    console.log(item);
    if (props.categories.length > 0 && item) {
      console.log(item);
      let results = getAllChildCategories(item);
      setResult([item, ...results]);
    }
  }, [props.categories, item]);
  useEffect(() => {
    if (item && result.length > 0) {
      let categories = result.map((cat) => cat.id);
      props.getSimilarCategoryProductsRedux(categories.slice(0, 10));
    }
  }, [result, item]);

  const categoriesById = new Map(
    props.categories.map((category) => [category.id, category])
  );
  const getAllChildCategories = (category) => {
    const targetId = category.id;
    const results = [];
    for (const cat of props.categories) {
      let c = cat;
      while (c && c.parentCategory) {
        c = c.parentCategory && categoriesById.get(c.parentCategory);
        if (c && c.id === targetId) {
          results.push(cat);
          break;
        }
      }
    }
    return results;
  };

  return (
    <section className="flat-spacing-1 pt_0">
      <div className="container">
        <div className="flat-title">
          <span className="title">Similar Products</span>
        </div>
        {props.products && props.products.length > 0 ? (
          <div className="hover-sw-nav hover-sw-2">
            <Swiper
              dir="ltr"
              className="swiper tf-sw-product-sell wrap-sw-over"
              slidesPerView={4} // Equivalent to data-preview={4}
              spaceBetween={30} // Equivalent to data-space-lg={30}
              breakpoints={{
                1024: {
                  slidesPerView: 4, // Equivalent to data-tablet={3}
                },
                640: {
                  slidesPerView: 3, // Equivalent to data-tablet={3}
                },
                0: {
                  slidesPerView: 2, // Equivalent to data-mobile={2}
                  spaceBetween: 15, // Equivalent to data-space-md={15}
                },
              }}
              modules={[Navigation, Pagination]}
              navigation={{
                prevEl: ".snbp3070",
                nextEl: ".snbn3070",
              }}
              pagination={{ clickable: true, el: ".spd307" }}
            >
              {props.products.slice(0, 12).map((product, i) => (
                <SwiperSlide key={i} className="swiper-slide">
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="nav-sw nav-next-slider nav-next-product box-icon w_46 round snbp3070">
              <span className="icon icon-arrow-left" />
            </div>
            <div className="nav-sw nav-prev-slider nav-prev-product box-icon w_46 round snbn3070">
              <span className="icon icon-arrow-right" />
            </div>
            <div className="sw-dots style-2 sw-pagination-product justify-content-center spd307" />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </section>
  );
};
const mapStateToProps = (state) => {
  return {
    categories: state.categories.categories,
    products: state.products.similarProducts,
  };
};
export default connect(mapStateToProps, {
  getAllCategoriesRedux,
  getSimilarCategoryProductsRedux,
})(Products);
