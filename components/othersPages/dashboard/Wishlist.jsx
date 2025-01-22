"use client";
import ProductCard from "@/components/shopCards/ProductCardWishlist";
import { useContextElement } from "@/context/Context";
import Link from "next/link";
import { connect } from "react-redux";

const Wishlist = ({ wishlist }) => {
  return (
    <div className="my-account-content account-wishlist">
      <div className="grid-layout wrapper-shop" data-grid="grid-3">
        {/* card product 1 */}
        {wishlist.map((elm, i) => (
          <ProductCard product={elm} key={i} />
        ))}
      </div>
      {wishlist.length == 0 && (
        <>
          <div
            className="row align-items-center w-100"
            style={{ rowGap: "20px" }}
          >
            <div className="col-lg-3 col-md-6 fs-18">
              Your wishlist is empty
            </div>
            <div className="col-lg-3  col-md-6">
              <Link
                href={`/shop-default`}
                className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
              >
                Explore Products!
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    wishlist: state.wishlist.wishlist,
  };
};
export default connect(mapStateToProps, {})(Wishlist);
