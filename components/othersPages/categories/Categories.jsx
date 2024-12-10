"use client";
import { filterData, labels } from "@/data/brandList";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Categories from "@/components/common/Categories";
const Brands = ({ categories }) => {
  const [currentTitle, setCurrentTitle] = useState("all");
  const [selected, setselected] = useState([]);
  useEffect(() => {
    if (currentTitle.toLowerCase() == "all") {
      setselected(filterData);
    } else {
      setselected(
        [...filterData].filter(
          (elm) => elm.title.toLowerCase() == currentTitle.toLowerCase()
        )
      );
    }
  }, [currentTitle]);

  let mainCategories = [];
  if (categories && categories.length > 0) {
    mainCategories = categories
      .filter((category) => category.parentCategory == "")
      .filter((cat) => cat.name != "offer");
  }

  return (
    <section className="flat-spacing-1" style={{ paddingTop: 0 }}>
      <div className="container tf-brands-filter-wrap">
        <div className="flat-accordion style-default has-btns-arrow mb_60">
          <Categories />
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    categories: state.categories.categories,
  };
};
export default connect(mapStateToProps, {})(Brands);
