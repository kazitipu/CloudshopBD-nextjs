"use client";
import { faqs1 } from "@/data/faqs";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { getAllCategoriesRedux } from "@/actions";
import "./categories.css";
import { useRouter } from "next/navigation";
const Accordion = ({ faqs = faqs1, getAllCategoriesRedux, categories }) => {
  const parentRefs = useRef([]);
  const questionRefs = useRef([]);
  const answerRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      await getAllCategoriesRedux();
    };
    fetchData();
  }, []);
  useEffect(() => {
    questionRefs.current.forEach((el) => {
      el.classList.remove("active");
    });
    parentRefs.current.forEach((el) => {
      el.classList.remove("active");
    });
    answerRefs.current.forEach((el) => {
      el.style.height = "0px";
      el.style.overflow = "hidden";
      el.style.transition = "all 0.4s ease-in-out";
      el.style.paddingTop = "0px";
      el.style.paddingBottom = "0px";
    });
    if (currentIndex !== -1 && categories && categories.length > 0) {
      questionRefs.current[currentIndex].classList.add("active");
      parentRefs.current[currentIndex].classList.add("active");
      const element = answerRefs.current[currentIndex];
      element.style.height = element.scrollHeight + 40 + "px";
      element.style.overflow = "hidden";
      element.style.transition = "all 0.4s ease-in-out";
      element.style.paddingTop = "22px";
      element.style.paddingBottom = "22px";
    }
  }, [currentIndex, categories]);
  let mainCategories = [];
  if (categories && categories.length > 0) {
    mainCategories = categories
      .filter((category) => category.parentCategory == "")
      .filter((cat) => cat.name != "offer");
  }

  const renderChild = (category) => {
    let cat = [];
    if (categories && categories.length > 0) {
      let childCategories = categories.filter(
        (cat) => cat.parentCategory && cat.parentCategory == category.id
      );
      cat = [category, ...childCategories];
    } else {
      cat = [];
    }
    return (
      <div
        className="grid-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", // Adjust 120px to your desired size
          gap: "20px",
        }}
      >
        {cat &&
          cat.length > 0 &&
          cat.map((category, index) => (
            <div
              className="grid-item"
              key={index}
              onClick={() => {
                router.push(`/shop-default?categoryId=${category.id}`);
              }}
            >
              <div
                style={{
                  minHeight: 80,
                  minWidth: 80,
                  maxHeight: 80,
                  maxWidth: 80,
                  border: "3px solid rgb(184, 155, 0)",
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
                  textDecorationColor: "rgb(184, 155, 0)",
                }}
              >
                {category.name}
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <>
      {mainCategories.length > 0 &&
        mainCategories.map((cat, index) => (
          <div
            key={index}
            ref={(el) => (parentRefs.current[index] = el)}
            className={`flat-toggle ${currentIndex == index ? "active" : ""}`}
          >
            <div
              className={`toggle-title ${
                currentIndex == index ? "active" : ""
              } arrow-btn-design`}
              ref={(el) => (questionRefs.current[index] = el)}
              onClick={() => {
                setCurrentIndex((pre) => (pre == index ? -1 : index));
              }}
            >
              <img
                src={
                  cat.logo &&
                  cat.logo != "/static/media/plus image.3dff302b.jpeg"
                    ? cat.logo
                    : "/images/logo/img.png"
                }
                style={{
                  minHeight: 40,
                  minWidth: 40,
                  maxHeight: 40,
                  maxWidth: 40,
                  border: "1px solid black",
                  borderRadius: 5,
                }}
                alt="loading"
              />
              &nbsp;&nbsp;{cat.name}
            </div>
            <div
              className="toggle-content"
              style={{ display: "block" }}
              ref={(el) => (answerRefs.current[index] = el)}
            >
              {renderChild(cat)}
            </div>
          </div>
        ))}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    categories: state.categories.categories,
  };
};
export default connect(mapStateToProps, { getAllCategoriesRedux })(Accordion);
