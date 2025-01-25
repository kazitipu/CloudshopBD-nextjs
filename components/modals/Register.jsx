"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import toast from "react-hot-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase.utils";
import { setAdditionalDataRedux } from "@/actions";
import { ClipLoader } from "react-spinners";
const Register = ({ setAdditionalDataRedux }) => {
  const [formData, setData] = React.useState({
    firstName: "",
    mobileNumber: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [state, setDatapassword] = React.useState({ secureEntry: true });
  const [loader, setLoader] = useState(false);
  const createAccountWithEmailAndPassword = async () => {
    const { firstName, email, mobileNumber, password, cpassword } = formData;
    if (!firstName || !email || !mobileNumber || !password || !cpassword) {
      toast.error("Please fill all missing information.");
      return;
    }
    if (password !== cpassword) {
      toast.error("Password didn't match");
      return;
    }
    setAdditionalDataRedux({
      firstName,
      mobileNumber,
      password,
      displayName: firstName,
    });
    setLoader(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userAuth) => {
        console.log(userAuth.user);
        toast.success("User account created & signed in!");
        setData({});
        setLoader(false);
        window.document.getElementById("close-btn").click();
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          toast.error("That email address is already in use!");
          setLoader(false);
        }

        if (error.code === "auth/invalid-email") {
          toast.error("That email address is invalid!");
          setLoader(false);
        }
        setLoader(false);
      });
  };

  return (
    <div
      className="modal modalCentered fade form-sign-in modal-part-content"
      id="register"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Register</div>

            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="tf-login-form">
            <form onSubmit={(e) => e.preventDefault()} className="">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  required
                  name=""
                  value={formData.firstName}
                  onChange={(e) => {
                    setData({
                      ...formData,
                      firstName: e.target.value,
                    });
                  }}
                />
                <label className="tf-field-label" htmlFor="">
                  Full Name *
                </label>
              </div>
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  required
                  name=""
                  value={formData.mobileNumber}
                  onChange={(e) => {
                    setData({
                      ...formData,
                      mobileNumber: e.target.value,
                    });
                  }}
                />
                <label className="tf-field-label" htmlFor="">
                  Mobile Number *
                </label>
              </div>

              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="email"
                  autoComplete="abc@xyz.com"
                  required
                  name=""
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
                  required
                  name=""
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
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="password"
                  required
                  name=""
                  autoComplete="current-password"
                  value={formData.cpassword}
                  onChange={(e) => {
                    setData({
                      ...formData,
                      cpassword: e.target.value,
                    });
                  }}
                />
                <label className="tf-field-label" htmlFor="">
                  Confirm Password *
                </label>
              </div>
              <div className="bottom">
                <div className="w-100">
                  <button
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                    onClick={async () => {
                      await createAccountWithEmailAndPassword();
                    }}
                  >
                    {loader ? (
                      <ClipLoader color="white" loading={loader} size={20} />
                    ) : (
                      <span>Register</span>
                    )}
                  </button>
                </div>
                <div className="w-100">
                  <a
                    href="#login"
                    data-bs-toggle="modal"
                    className="btn-link fw-6 w-100 link"
                  >
                    Already have an account? Log in here
                    <i className="icon icon-arrow1-top-left" />
                  </a>
                </div>
              </div>
            </form>
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
export default connect(mapStateToProps, { setAdditionalDataRedux })(Register);
