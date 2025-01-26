import React from "react";
import { ClipLoader } from "react-spinners";
const loading = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <ClipLoader color="#ec345b" size={55} />
    </div>
  );
};

export default loading;
