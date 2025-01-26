"use client";
import { connect } from "react-redux";
import { useEffect, useState } from "react";

const WishlistLength = ({ wishlist }) => {
  return <div>{wishlist.length}</div>;
};

const mapStateToProps = (state) => {
  return {
    wishlist: state.wishlist.wishlist,
  };
};

export default connect(mapStateToProps, {})(WishlistLength);
