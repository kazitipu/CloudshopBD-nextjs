"use client";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { connect } from "react-redux";
import { updateAttributeRedux, updateUserRedux } from "@/actions";
const AccountEdit = ({ currentUser, guest, updateUserRedux }) => {
  const [state, setData] = React.useState({
    displayName: "",
    email: "",
    mobileNumber: "",
    submited: false,
  });

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      setData({
        ...state,
        displayName: currentUser.displayName ? currentUser.displayName : "",
        email: currentUser.email ? currentUser.email : "",
        mobileNumber: currentUser.mobileNumber ? currentUser.mobileNumber : "",
      });
    } else if (guest) {
      setData({
        ...state,
        displayName: guest.displayName ? guest.displayName : "",
        email: guest.email ? guest.email : "",
        mobileNumber: guest.mobileNumber ? guest.mobileNumber : "",
      });
    }
  }, [currentUser, guest]);

  return (
    <div className="my-account-content account-edit">
      <div className="">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            let currentUser2 = null;
            if (currentUser && currentUser.uid) {
              currentUser2 = currentUser;
            } else {
              currentUser2 = guest;
            }
            await updateUserRedux({ ...currentUser2, ...state });
            toast.success("User information updated!");
          }}
          className=""
          id="form-password-change"
          action="#"
        >
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="text"
              id="fullName"
              required
              name="Enter full name"
              value={state.displayName}
              onChange={(e) => {
                setData({
                  ...state,
                  displayName: e.target.value,
                });
              }}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="fullName"
            >
              Full Name
            </label>
          </div>

          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder="Enter your email"
              type="email"
              autoComplete="abc@xyz.com"
              required
              id="email"
              name="email"
              value={state.email}
              onChange={(e) => {
                setData({
                  ...state,
                  email: e.target.value,
                });
              }}
            />
            <label className="tf-field-label fw-4 text_black-2" htmlFor="email">
              Email
            </label>
          </div>
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="text"
              id="mobileNumber"
              required
              name="Enter Mobile Number"
              value={state.mobileNumber}
              onChange={(e) => {
                setData({
                  ...state,
                  mobileNumber: e.target.value,
                });
              }}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="mobileNumber"
            >
              Mobile Number
            </label>
          </div>
          <div className="mb_20">
            <button
              type="submit"
              className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
            >
              Save Changes
            </button>
          </div>
        </form>
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
export default connect(mapStateToProps, { updateUserRedux })(AccountEdit);
