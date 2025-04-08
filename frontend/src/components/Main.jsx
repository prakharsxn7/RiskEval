import React from "react";
import img from "@assets/img1.jpeg";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleContactClick = () => {
    const footerSection = document.getElementById('support-section');
    if (footerSection) {
      footerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <button className="right" onClick={handleSignupClick}> Start with RiskEval</button>
          <button className="left" onClick={handleContactClick}> Talk to our team</button>
        </div>
      </div>

      <div className="img_cont">
        <img className=" only_img " src={img} alt="man images" />
      </div>
    </div>
  );
};

export default Main;
