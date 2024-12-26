"use client";
import { connect } from "react-redux";

const CartLength = ({ cartData }) => {
  return <>{cartData.length}</>;
};

const mapStateToProps = (state) => {
  return {
    cartData: state.cart.cartData,
  };
};
export default connect(mapStateToProps, {})(CartLength);
