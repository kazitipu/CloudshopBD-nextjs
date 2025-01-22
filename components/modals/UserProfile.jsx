"use client";
import React from "react";
import { connect } from "react-redux";
import { useRouter } from "next/navigation";
const Login = ({ currentUser, guest }) => {
  const router = useRouter();
  let currentUser2 = null;
  if (currentUser && currentUser.uid) {
    currentUser2 = currentUser;
  } else {
    currentUser2 = guest;
  }
  return (
    <div
      className="modal modalCentered fade form-sign-in modal-part-content"
      id="userProfile"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">
              Welcome,{" "}
              {currentUser2 && (
                <>
                  {currentUser2 && currentUser2.displayName ? (
                    <span style={{ color: "#ec345b" }}>
                      {currentUser2.displayName}
                    </span>
                  ) : currentUser2 && currentUser2.guest ? (
                    <span style={{ color: "#ec345b" }}>
                      guest{currentUser2.id}
                    </span>
                  ) : (
                    <span>user{currentUser2.id}</span>
                  )}
                </>
              )}
              !
            </div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div style={{ marginTop: -18 }}>
            You are browsing as{" "}
            {currentUser2 && (
              <>
                {currentUser2 && currentUser2.guest ? (
                  <span>guest</span>
                ) : (
                  <span>user</span>
                )}
              </>
            )}
          </div>
          <div className="tf-login-form">
            <form
              onSubmit={(e) => e.preventDefault()}
              className=""
              acceptCharset="utf-8"
            >
              <div
                style={{
                  color: "#555",
                  fontSize: 15,
                  padding: 10,
                  borderBottom: "1px solid gainsboro",
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push("/my-account-edit");
                }}
              >
                <i className="icofont-edit"></i> Edit Profile{" "}
                <i
                  class="icofont-hand-drawn-right"
                  style={{ float: "right", marginTop: 3 }}
                ></i>
              </div>
              <div
                style={{
                  color: "#555",
                  fontSize: 15,
                  padding: 10,
                  borderBottom: "1px solid gainsboro",
                  marginTop: 0,
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push("/my-account-address");
                }}
              >
                <i className="icofont-address-book"></i> Manage Address{" "}
                <i
                  class="icofont-hand-drawn-right"
                  style={{ float: "right", marginTop: 3 }}
                ></i>
              </div>
              <div
                style={{
                  color: "#555",
                  fontSize: 15,
                  padding: 10,
                  borderBottom: "1px solid gainsboro",
                  marginTop: 0,
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push("/my-account-wishlist");
                }}
              >
                <i className="icofont-ui-love"></i> Wishlist{" "}
                <i
                  class="icofont-hand-drawn-right"
                  style={{ float: "right", marginTop: 3 }}
                ></i>
              </div>
              <div
                style={{
                  color: "#555",
                  fontSize: 15,
                  padding: 10,
                  borderBottom: "1px solid gainsboro",
                  marginTop: 0,
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push("/my-account-orders");
                }}
              >
                <i className="icofont-bag"></i> My Orders{" "}
                <i
                  class="icofont-hand-drawn-right"
                  style={{ float: "right", marginTop: 3 }}
                ></i>
              </div>
              <div className="bottom" style={{ marginTop: 40 }}>
                <div className="w-100">
                  <a
                    href="#login"
                    data-bs-toggle="modal"
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                  >
                    <span>Log in</span>
                  </a>
                </div>
                <div className="w-100">
                  <a
                    href="#register"
                    data-bs-toggle="modal"
                    className="btn-link fw-6 w-100 link"
                  >
                    New customer? Create your account
                    <i className="icon icon-arrow1-top-left" />
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    currentUser: state.users.currentUser,
    guest: state.users.guest,
  };
};
export default connect(mapStateToProps, {})(Login);
