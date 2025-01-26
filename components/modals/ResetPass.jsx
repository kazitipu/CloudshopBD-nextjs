"use client";
import React from "react";
import { connect } from "react-redux";
import { ClipLoader } from "react-spinners";
import { auth } from "@/firebase/firebase.utils";
import { sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";
const ResetPass = () => {
  const [formData, setData] = React.useState({ email: "" });
  const [loader, setLoader] = React.useState(false);

  const handleSubmit = async () => {
    const emailAddress = formData.email;

    console.log(emailAddress);

    try {
      // Trigger password reset email
      await sendPasswordResetEmail(auth, emailAddress);

      // Reset form data and navigate to the login screen
      setData({
        ...formData,
        email: "",
      });

      toast.success(
        "Password reset email has been sent to your email address. Please check your email."
      );
      window.document.getElementById("close-btn2").click();
    } catch (error) {
      // Reset form data and handle the error

      console.error("Error sending password reset email:", error);

      // Display a user-friendly error message
      if (error.code === "auth/invalid-email") {
        toast.error(
          "The email address is invalid. Please provide a valid email."
        );
      } else if (error.code === "auth/user-not-found") {
        toast.error("No user found with this email address.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div
      className="modal modalCentered fade form-sign-in modal-part-content"
      id="forgotPassword"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Reset your password</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
              id="close-btn2"
            />
          </div>
          <div className="tf-login-form">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoader(true);
                await handleSubmit();
                setLoader(false);
              }}
              className=""
            >
              <div>
                <p>
                  We'll send an email to the email address you enter below. your
                  registered gmail address
                </p>
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
              <div>
                <a
                  href="#login"
                  data-bs-toggle="modal"
                  className="btn-link link"
                >
                  Cancel
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
                      <span>Reset password</span>
                    )}
                  </button>
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
  return {};
};
export default connect(mapStateToProps, {})(ResetPass);
