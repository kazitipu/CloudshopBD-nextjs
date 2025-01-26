"use client";
import React, { useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase.utils";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import "./UserProfile.css";
import { ClipLoader } from "react-spinners";
const Login = ({ currentUser, guest }) => {
  const [loader, setLoader] = useState(false);
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
                      guest{currentUser2.id.slice(0, 10)}...
                    </span>
                  ) : (
                    <span style={{ color: "#ec345b" }}>
                      user{currentUser2.id.slice(0, 10)}...
                    </span>
                  )}
                </>
              )}
            </div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
              id="close-btn3"
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
                onClick={() => {
                  router.push("/my-account-edit");
                }}
                className="each-profile-option"
              >
                <i className="icofont-edit"></i> Edit Profile{" "}
                <i
                  className="icofont-hand-drawn-right"
                  style={{ float: "right", marginTop: 3 }}
                ></i>
              </div>
              <div
                onClick={() => {
                  router.push("/my-account-address");
                }}
                className="each-profile-option"
              >
                <i className="icofont-address-book"></i> Manage Address{" "}
                <i
                  className="icofont-hand-drawn-right"
                  style={{ float: "right", marginTop: 3 }}
                ></i>
              </div>
              <div
                onClick={() => {
                  router.push("/my-account-wishlist");
                }}
                className="each-profile-option"
              >
                <i className="icofont-ui-love"></i> Wishlist{" "}
                <i
                  className="icofont-hand-drawn-right"
                  style={{ float: "right", marginTop: 3 }}
                ></i>
              </div>
              <div
                style={{}}
                onClick={() => {
                  router.push("/my-account-orders");
                }}
                className="each-profile-option"
              >
                <i className="icofont-bag"></i> My Orders{" "}
                <i
                  className="icofont-hand-drawn-right"
                  style={{ float: "right", marginTop: 3 }}
                ></i>
              </div>
              <div className="bottom" style={{ marginTop: 40 }}>
                {currentUser && currentUser.uid ? (
                  <div className="w-100">
                    <a
                      className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                      onClick={async () => {
                        try {
                          setLoader(true);

                          await signOut(auth);
                          toast.success("User signed out successfully");

                          window.document.getElementById("close-btn3").click();
                          setLoader(false);
                        } catch (error) {
                          toast.error(
                            "Error signing out. Please try again later. "
                          );
                          setLoader(false);
                        }
                      }}
                    >
                      {loader ? (
                        <ClipLoader size={19} color="white" />
                      ) : (
                        <span>Log out</span>
                      )}
                    </a>
                  </div>
                ) : (
                  <div className="w-100">
                    <a
                      href="#login"
                      data-bs-toggle="modal"
                      className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                    >
                      <span>Log in</span>
                    </a>
                  </div>
                )}
                {(!currentUser || !currentUser.uid) && (
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
                )}
              </div>
            </form>

            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
              id="close-btn3"
              style={{ color: "white" }}
            />
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
