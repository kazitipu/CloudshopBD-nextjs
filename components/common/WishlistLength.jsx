"use client";
import { connect } from "react-redux";
const WishlistLength = ({ wishlist }) => {
  return <>{wishlist.length}</>;
};
const mapStateToProps = (state) => {
  return {
    wishlist: state.wishlist.wishlist,
  };
};
export default connect(mapStateToProps, {})(WishlistLength);
