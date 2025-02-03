import React from "react";
import OnHoverCategory from "./onHoverCategory";
import "./main.css";
import Link from "next/link";

const Sidebar = ({
  categories,
  latestProducts,
  bestSelling,
  bestSellingCategory,
}) => {
  // Dependency array ensures this runs only once on mount

  let mainCategories = [];
  if (categories && categories.length > 0) {
    mainCategories = categories
      .filter((category) => category.parentCategory == "")
      .filter((cat) => cat.name != "offer");
  }

  const getPrice = (product) => {
    if (product.displayedVariations.length > 0) {
      if (product.displayedVariations[0].salePrice == 0) {
        return (
          <div>
            <div style={{ textAlign: "left", color: "white", fontSize: 11 }}>
              ৳0
            </div>
            <div
              style={{ textAlign: "left", fontWeight: "bold", marginTop: -5 }}
            >
              ৳{product.displayedVariations[0].price}
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div style={{ textAlign: "left", color: "#999", fontSize: 11 }}>
              <del>৳{product.displayedVariations[0].price}</del>
            </div>
            <div
              style={{ textAlign: "left", fontWeight: "bold", marginTop: -5 }}
            >
              ৳{product.displayedVariations[0].salePrice}
            </div>

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 10,
                height: 30,
                width: 30,
                backgroundImage: "url(/images/offer.svg)",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  color: "white",
                  fontSize: 9,
                  marginTop: -2,
                }}
              >
                {parseInt(
                  100 -
                    (product.displayedVariations[0].salePrice /
                      product.displayedVariations[0].price) *
                      100
                )}
                %
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: 9,
                  marginTop: -12,
                }}
              >
                Off
              </div>
            </div>
          </div>
        );
      }
    } else {
      if (product.salePrice == 0) {
        return (
          <div>
            <div style={{ textAlign: "left", color: "white", fontSize: 11 }}>
              ৳{product.price}
            </div>

            <div
              style={{ textAlign: "left", fontWeight: "bold", marginTop: -5 }}
            >
              ৳{product.price}
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div style={{ textAlign: "left", color: "#999", fontSize: 11 }}>
              <del>৳{product.price}</del>
            </div>
            <div
              style={{ textAlign: "left", fontWeight: "bold", marginTop: -5 }}
            >
              ৳{product.salePrice}
            </div>

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 10,
                height: 30,
                width: 30,
                backgroundImage: "url(/images/offer.svg)",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  color: "white",
                  fontSize: 9,
                  marginTop: -2,
                }}
              >
                {parseInt(100 - (product.salePrice / product.price) * 100)}%
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: 9,
                  marginTop: -12,
                }}
              >
                Off
              </div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="tf-section-sidebar wrap-sidebar-mobile">
      <div className="sidebar-item sidebar-categories">
        <div className="category-box">
          <li
            style={{
              fontWeight: "bold",
              marginBottom: 10,
              fontSize: 18,
              background: "#ee365a",
              padding: 20,
              color: "white",
            }}
          >
            <i
              className="icofont-navigation-menu"
              style={{ paddingRight: 5, fontSize: 20, color: "white" }}
            />{" "}
            Products Category{" "}
          </li>
          <div
            style={{
              padding: 10,
              paddingTop: 0,
              paddingBottom: 0,
              border: "1px solid gray",
            }}
          >
            {mainCategories.length > 0 &&
              mainCategories.map((cat, index) => {
                return (
                  <div
                    className="option-bg onhover-dropdown  onhover-dropdown-2 "
                    key={index}
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
                    <li style={{ alignSelf: "center" }}>
                      &nbsp; &nbsp;{cat.name}
                      <OnHoverCategory
                        cat={cat}
                        category={cat.name}
                        categories={categories}
                      />
                    </li>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div
        className="sidebar-item sidebar-post"
        style={{
          border: "1px solid gainsboro",
          padding: 10,
          paddingBottom: 20,
        }}
      >
        <div
          className="sidebar-title"
          style={{
            borderBottom: "2px solid #ee365a",
            color: "#ee365a",
            fontWeight: "bold",
          }}
        >
          Latest Products
        </div>
        <div className="sidebar-content">
          {latestProducts && latestProducts.length > 0 && (
            <ul>
              {latestProducts.slice(0, 3).map((product, index) => (
                <li
                  key={index}
                  style={{
                    paddingBottom: 20,
                    borderBottom: "1px solid gainsboro",
                  }}
                >
                  <div className="blog-article-item style-sidebar">
                    <div
                      style={{
                        border: "1px solid gainsboro",
                        backgroundImage: `url(${product.pictures[0]})`,
                        backgroundSize: "contain",
                        maxHeight: 100,
                        minHeight: 100,
                        maxWidth: 100,
                        minWidth: 100,
                        borderRadius: 5,
                      }}
                    ></div>

                    <div className="article-content">
                      <div
                        style={{
                          fontWeight: "bold",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          lineHeight: "1.5em",
                          height: "3em", // 2 lines * line height
                          textOverflow: "ellipsis",
                        }}
                      >
                        {product.name}
                      </div>
                      <div>{getPrice(product)}</div>
                    </div>
                  </div>
                </li>
              ))}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingRight: 12,
                }}
              >
                <Link
                  style={{
                    fontWeight: "bold",
                    textDecoration: "underline",
                    cursor: "pointer",
                    color: "#ee365a",
                  }}
                  href={`/shop-default?categoryId=latest`}
                >
                  view all
                </Link>
              </div>
            </ul>
          )}
        </div>
      </div>
      <div
        className="sidebar-item sidebar-post"
        style={{
          border: "1px solid gainsboro",
          padding: 10,
          paddingBottom: 20,
        }}
      >
        <div
          className="sidebar-title"
          style={{
            borderBottom: "2px solid #ee365a",
            color: "#ee365a",
            fontWeight: "bold",
          }}
        >
          {bestSellingCategory.name}
        </div>
        <div className="sidebar-content">
          {bestSelling && bestSelling.length > 0 && (
            <ul>
              {bestSelling.slice(0, 3).map((product, index) => (
                <li
                  key={index}
                  style={{
                    paddingBottom: 20,
                    borderBottom: "1px solid gainsboro",
                  }}
                >
                  <div className="blog-article-item style-sidebar">
                    <div
                      style={{
                        border: "1px solid gainsboro",
                        backgroundImage: `url(${product.pictures[0]})`,
                        backgroundSize: "contain",
                        maxHeight: 100,
                        minHeight: 100,
                        maxWidth: 100,
                        minWidth: 100,
                        borderRadius: 5,
                      }}
                    ></div>

                    <div className="article-content">
                      <div
                        style={{
                          fontWeight: "bold",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          lineHeight: "1.5em",
                          height: "3em", // 2 lines * line height
                          textOverflow: "ellipsis",
                        }}
                      >
                        {product.name}
                      </div>
                      <div>{getPrice(product)}</div>
                    </div>
                  </div>
                </li>
              ))}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingRight: 12,
                }}
              >
                <Link
                  style={{
                    fontWeight: "bold",
                    textDecoration: "underline",
                    cursor: "pointer",
                    color: "#ee365a",
                  }}
                  href={`/shop-default?categoryId=${bestSellingCategory.id}`}
                >
                  view all
                </Link>
              </div>
            </ul>
          )}
        </div>
      </div>

      {/* <div className="sidebar-item sidebar-tags">
        <div className="sidebar-title">Recent search</div>
        <div className="sidebar-content">
          <ul className="tags-lists" style={{ flexWrap: "wrap" }}>
            <li>
              <a href="#" className="tags-item">
                Bags
              </a>
            </li>
            <li>
              <a href="#" className="tags-item">
                Fashion
              </a>
            </li>
            <li>
              <a href="#" className="tags-item">
                Under wear
              </a>
            </li>
            <li>
              <a href="#" className="tags-item">
                Jeans
              </a>
            </li>
            <li>
              <a href="#" className="tags-item">
                Flower
              </a>
            </li>
            <li>
              <a href="#" className="tags-item">
                Mirror
              </a>
            </li>
            <li>
              <a href="#" className="tags-item">
                Ayna
              </a>
            </li>
            <li>
              <a href="#" className="tags-item">
                Table
              </a>
            </li>
            <li>
              <a href="#" className="tags-item">
                Chair
              </a>
            </li>
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;
