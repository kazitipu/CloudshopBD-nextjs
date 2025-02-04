"use client";

import React, { Component } from "react";
import { useRouter } from "next/navigation";
import "./onHoverCategory.css";
function OnHoverCategory(props) {
  const router = useRouter();
  const getAllChildCategories = (category) => {
    if (props.categories && props.categories.length > 0) {
      let childCategories = props.categories.filter(
        (cat) => cat.parentCategory && cat.parentCategory == category.id
      );
      return [category, ...childCategories];
    } else {
      return [];
    }
  };

  let cat = getAllChildCategories(props.cat);

  return (
    <ul
      className="profile-info-container-2 onhover-show-div onhover-show-div-2"
      style={{ padding: 20, paddingLeft: 40, paddingRight: 40 }}
    >
      {" "}
      <div
        className="grid-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", // Adjust 120px to your desired size
          gap: "20px",
        }}
      >
        {cat &&
          cat.length > 0 &&
          cat.map((category, index) => (
            <div
              className="grid-item each-cat-container"
              key={index}
              onClick={() => {
                router.push(`/shop-default?categoryId=${category.id}`);
              }}
            >
              <div
                style={{
                  minHeight: 90,
                  minWidth: 90,
                  maxHeight: 90,
                  maxWidth: 90,
                  border: "2px solid gray",
                  backgroundImage: `url(${category.logo})`,
                  backgroundSize: "contain",
                  borderRadius: "50%",
                  margin: "auto",
                }}
              ></div>
              <div
                style={{
                  color: "#333",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                  textDecoration: "underline",
                }}
                className="cat-name"
              >
                {category.name}
              </div>
            </div>
          ))}
      </div>
    </ul>
  );
}

export default OnHoverCategory;
