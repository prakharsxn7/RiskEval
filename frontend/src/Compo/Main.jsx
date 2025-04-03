import React from "react";
import img from "@assets/img1.jpeg";

const Main = () => {
  return (
    <div className="part1">
      <div className="content">
        <div className="heading">
          <h3> Make data-driven accurate Credit risk prediction </h3>
        </div>
        <div className="paragraph">
          <p>
            {" "}
            Gain real time insight into credit risk , streamlining loan approval 
            and enhance financial decision making with Ai-powered analytics
          </p>
        </div>

        <div className="button">
          <button className="right"> Start with RiskEval</button>
          <button className="left"> Talk to our team</button>
        </div>
      </div>

      <div className="img_cont">
        <img className=" only_img " src={img} alt="man images" />
      </div>
    </div>
  );
};

export default Main;
