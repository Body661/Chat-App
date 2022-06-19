import React from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { TailSpin } from "react-loader-spinner";

const Loading = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: " 50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <TailSpin color="#00BFFF" height={80} width={80} />
    </div>
  );
};

export default Loading;
