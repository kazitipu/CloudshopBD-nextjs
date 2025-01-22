"use client";
import React from "react";
import Link from "next/link";
import { connect } from "react-redux";
const MyAccount = ({ guest, currentUser }) => {
  let currentUser2 = null;
  if (currentUser && currentUser.uid) {
    currentUser2 = currentUser;
  } else {
    currentUser2 = guest;
  }
  return (
    <div className="my-account-content account-dashboard">
      <div className="mb_60">
        <h5 className="fw-5 mb_20">
          Hello{" "}
          {currentUser2 && (
            <>
              {currentUser2 && currentUser2.displayName ? (
                <span style={{ color: "#ec345b" }}>
                  {currentUser2.displayName}
                </span>
              ) : currentUser2 && currentUser2.guest ? (
                <span style={{ color: "#ec345b" }}>guest{currentUser2.id}</span>
              ) : (
                <span>user{currentUser2.id}</span>
              )}
            </>
          )}
        </h5>
        <p>
          From your account dashboard you can view your{" "}
          <Link className="text_primary" href={`/my-account-orders`}>
            recent orders
          </Link>
          , manage your{" "}
          <Link className="text_primary" href={`/my-account-address`}>
            delivery addresses
          </Link>
          , edit{" "}
          <Link className="text_primary" href={`/my-account-edit`}>
            your account details
          </Link>
          , and{" "}
          <Link className="text_primary" href={`/my-account-wishlist`}>
            wishlist
          </Link>
          .
        </p>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    guest: state.users.guest,
    currentUser: state.users.currentUser,
  };
};
export default connect(mapStateToProps, {})(MyAccount);
