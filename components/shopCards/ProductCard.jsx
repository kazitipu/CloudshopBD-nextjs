"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import CountdownComponent from "../common/Countdown";
import "./productCard.css";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { connect } from "react-redux";
import toast from "react-hot-toast";
import { addToWishlistRedux, removeFromWishlistRedux } from "@/actions";
const ProductCard = ({
  product,
  gridItems,
  addToWishlistRedux,
  removeFromWishlistRedux,
  wishlist,
  currentUser,
}) => {
  const router = useRouter();
  const divRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [currentImage, setCurrentImage] = useState(
    product && product.imgSrc ? product.imgSrc : ""
  );

  useEffect(() => {
    if (divRef.current) {
      // Access the width of the div
      setWidth(divRef.current.offsetWidth);

      // Optional: Add a resize listener for responsive layouts
      const handleResize = () => setWidth(divRef.current.offsetWidth);
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  useEffect(() => {
    if (divRef.current) {
      // Access the width of the div
      setWidth(divRef.current.offsetWidth);
    }
  }, [gridItems]);

  useEffect(() => {
    setCurrentImage(product && product.imgSrc ? product.imgSrc : "");
  }, [product]);

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
    <>
      {product && product.pictures ? (
        <div
          className="card-product style-skincare"
          style={{
            position: "relative",
            border: "1px solid gainsboro",
          }}
          key={product.id}
          onClick={() => {
            router.push(`/product-swatch-image-rounded/${product.id}`);
          }}
        >
          <div className="card-product-wrapper">
            <a
              className="product-img"
              ref={divRef}
              style={{ maxHeight: width, minHeight: width }}
            >
              <Image
                className="lazyload img-product"
                data-src={product.pictures[0]}
                alt="image-product"
                src={product.pictures[0]}
                width={360}
                height={384}
              />
              <Image
                className="lazyload img-hover"
                data-src={
                  product.pictures2 &&
                  product.pictures2[0] &&
                  product.pictures2[0] !=
                    "/static/media/addProduct.3dff302b.png"
                    ? product.pictures2[0]
                    : product.pictures[0]
                }
                alt="image-product"
                src={
                  product.pictures2 &&
                  product.pictures2[0] &&
                  product.pictures2[0] !=
                    "/static/media/addProduct.3dff302b.png"
                    ? product.pictures2[0]
                    : product.pictures[0]
                }
                width={360}
                height={384}
              />
            </a>
            <div className="list-product-btn">
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    wishlist &&
                    wishlist.length > 0 &&
                    wishlist.find((wish) => wish.id == product.id)
                  ) {
                    removeFromWishlistRedux(product, currentUser);
                    toast.success("Item removed from wishlist");
                  } else {
                    addToWishlistRedux(product, currentUser);
                    toast.success("Item added to Wishlist");
                  }
                }}
                className="box-icon bg_white wishlist btn-icon-action"
              >
                <span
                  className={`icon icon-heart`}
                  style={{
                    color:
                      wishlist &&
                      wishlist.length > 0 &&
                      wishlist.find((wish) => wish.id == product.id)
                        ? "red"
                        : "",
                  }}
                />
                <span className="tooltip">
                  {wishlist &&
                  wishlist.length > 0 &&
                  wishlist.find((wish) => wish.id == product.id)
                    ? "Added to Wishlist"
                    : "Add to Wishlist"}
                </span>
                <span className="icon icon-delete" />
              </a>
            </div>
          </div>
          <div
            className="card-product-info text-center"
            style={{
              padding: 10,
              paddingBottom: 5,
            }}
          >
            <Link
              href={`/product-detail/${product.id}`}
              className="title link"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                textAlign: "left",
                minHeight: "2.4em", // Minimum height to account for 2 lines
                lineHeight: "1.2em",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              {product.name}
            </Link>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              {getPrice(product)}

              <div className="tf-product-btns" style={{ marginTop: 0 }}>
                <a
                  href="#quick_add"
                  onClick={() => {}}
                  data-bs-toggle="modal"
                  className="tf-btn radius-3 btn-fill animate-hover-btn"
                  style={{ padding: "8px 10px", fontSize: 13 }}
                >
                  ADD
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="card-product style-skincare"
          style={{
            position: "relative",
            border: "1px solid gainsboro",
          }}
        >
          <div className="card-product-wrapper">
            <a
              className="product-img"
              ref={divRef}
              style={{ maxHeight: width, minHeight: width }}
            >
              {/* <Image
            className="lazyload img-product"
            data-src={product.pictures[0]}
            alt="image-product"
            src={product.pictures[0]}
            width={360}
            height={384}
          /> */}
              <Skeleton className="lazyload img-product" />
            </a>
          </div>
          <div
            className="card-product-info text-center"
            style={{
              padding: 10,
              paddingBottom: 5,
            }}
          >
            <Skeleton
              className="title link"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                textAlign: "left",
                minHeight: "2.4em", // Minimum height to account for 2 lines
                lineHeight: "1.2em",
                fontWeight: "bold",
                color: "#555",
              }}
            />

            <Skeleton
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 5,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    wishlist: state.wishlist.wishlist,
    currentUser: state.users.currentUser,
  };
};
export default connect(mapStateToProps, {
  addToWishlistRedux,
  removeFromWishlistRedux,
})(ProductCard);
