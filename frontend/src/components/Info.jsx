import React from "react";
import signup from "../assets/signup.jpeg";

const Info = () => {
  return (
    <div className="info">
      <div className="img_containor3">
        <img className="img_sig" src={signup} alt=" signup" />
      </div>
      <div className="siHea">
        <h1>Fastest Credit Risk Onboarding Solution</h1>
      </div>
      <div className="infopra">
        <p className="siPara">
        Accelerate customer onboarding, reduce fraud, and streamline loan approvals using real-time credit risk evaluation powered by advanced ML analytics.
        </p>
      </div>
    </div>
  );
};

export default Info;
