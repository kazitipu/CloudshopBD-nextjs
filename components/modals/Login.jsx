"use client";
import React, { useState } from "react";
import { connect } from "react-redux";
import { auth } from "@/firebase/firebase.utils";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
const Login = () => {
  const [formData, setData] = React.useState({ email: "", password: "" });
  const [loader, setLoader] = useState(false);
  const { email, password } = formData;

  const signIn = async () => {
    if (email && password) {
      setLoader(true);
      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          toast.success("Signed in successfully!");
          setData({ email: "", password: "" });
          window.document.getElementById("close-btn").click();
          setLoader(false);
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            toast.error("That email address is already in use!");
          }

          if (error.code === "auth/invalid-email") {
            toast.error("That email address is invalid!");
          }
          setLoader(false);
          toast.error("Something went wrong,Please try again later.");
        });
    } else {
      toast.error("Please fill all missing information");
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider(); // Create Google provider instance

    try {
      // Sign in with Google using a popup
      const result = await signInWithPopup(auth, provider);

      // User information
      const user = result.user;
      console.log("User signed in:", user);

      // Display success notification
      toast.success("Signed in successfully with Google!");
      window.document.getElementById("close-btn").click();
      return user; // Return the user object for further processing if needed
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      // Handle specific error codes
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-In canceled by user.");
        window.document.getElementById("close-btn").click();
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      throw error; // Re-throw the error if needed
    }
  };

  return (
    <div
      className="modal modalCentered fade form-sign-in modal-part-content"
      id="login"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Log in</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="tf-login-form">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await signIn();
              }}
              className=""
              acceptCharset="utf-8"
            >
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="email"
                  name=""
                  required
                  autoComplete="abc@xyz.com"
                  value={formData.email}
                  onChange={(e) => {
                    setData({
                      ...formData,
                      email: e.target.value,
                    });
                  }}
                />
                <label className="tf-field-label" htmlFor="">
                  Email *
                </label>
              </div>
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="password"
                  name=""
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => {
                    setData({
                      ...formData,
                      password: e.target.value,
                    });
                  }}
                />
                <label className="tf-field-label" htmlFor="">
                  Password *
                </label>
              </div>
              <div>
                <a
                  href="#forgotPassword"
                  data-bs-toggle="modal"
                  className="btn-link link"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="bottom">
                <div className="w-100">
                  <button
                    type="submit"
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                  >
                    {loader ? (
                      <ClipLoader size={19} color="white" />
                    ) : (
                      <span>Log in</span>
                    )}
                  </button>
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                borderBottom: "1px solid gainsboro",
                marginTop: 20,
              }}
            >
              Or
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <img
                src="/images/google.png"
                width={250}
                style={{
                  borderRadius: 5,
                  cursor: "pointer",
                  border: "1px solid gainsboro",
                }}
                onClick={async () => {
                  await signInWithGoogle();
                }}
              />
            </div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
              id="close-btn"
              style={{ color: "white" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps, {})(Login);
