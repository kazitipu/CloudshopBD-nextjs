"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "./productCard.css";
import { useRouter } from "next/navigation";
import { connect } from "react-redux";
import { removeFromWishlistRedux } from "@/actions";
import toast from "react-hot-toast";
const ProductCard = ({
  product,
  gridItems = 6,
  removeFromWishlistRedux,
  currentUser,
  guest,
}) => {
  const router = useRouter();
  const divRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [currentImage, setCurrentImage] = useState(product.imgSrc);

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
    setCurrentImage(product.imgSrc);
  }, [product]);

  return (
    <>
      {product && product.pictures && (
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
              }}
            >
              <div style={{ fontWeight: "bold" }}>
                ৳{product.price ? product.price : product.salePrice}
              </div>
              <div style={{ fontWeight: "bold" }}>
                <i
                  class="icofont-trash"
                  style={{
                    float: "right",
                    marginTop: 3,
                    cursor: "pointer",
                    color: "gray",
                    fontSize: 18,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlistRedux(product, currentUser);
                    toast.success("Item removed from wishlist.");
                  }}
                ></i>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.users.currentUser,
    guest: state.users.guest,
  };
};
export default connect(mapStateToProps, { removeFromWishlistRedux })(
  ProductCard
);
