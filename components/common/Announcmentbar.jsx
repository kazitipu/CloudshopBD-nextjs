"use client";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getSingleAnnouncementRedux } from "@/actions";
const Announcmentbar = ({
  bgColor = "bg_violet",
  getSingleAnnouncementRedux,
  announcement,
}) => {
  useEffect(() => {
    var closeAnnouncement = function () {
      getSingleAnnouncementRedux();
      document
        .querySelectorAll(".close-announcement-bar")
        .forEach(function (btn) {
          btn.addEventListener("click", function (e) {
            e.preventDefault();
            var announcementBar = this.closest(".announcement-bar");
            var height = announcementBar.offsetHeight + "px";

            announcementBar.style.marginTop = `-${height}`;

            setTimeout(function () {
              announcementBar.style.display = "none";
              announcementBar.remove();
            }, 600); // Simulating fadeOut with a timeout
          });
        });
    };
    closeAnnouncement();
  }, []);
  return (
    <div className={`announcement-bar ${bgColor}`}>
      <div className="wrap-announcement-bar">
        <div className="box-sw-announcement-bar speed-1">
          {announcement && (
            <div className="announcement-bar-item" style={{ paddingLeft: 100 }}>
              <p>{announcement.name}</p>
            </div>
          )}
        </div>
      </div>
      <span className="icon-close close-announcement-bar" />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    announcement: state.users.announcement,
  };
};
export default connect(mapStateToProps, { getSingleAnnouncementRedux })(
  Announcmentbar
);
