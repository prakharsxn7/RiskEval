import React, { useState, useEffect } from 'react'
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import { useNavigate } from 'react-router-dom';

const Template = ({title, desc1, desc2, formtype, setIsLoggedIn}) => {
  const navigate = useNavigate();
  const [isRightPanelActive, setIsRightPanelActive] = useState(formtype === "Login");

  useEffect(() => {
    setIsRightPanelActive(formtype === "Login");
  }, [formtype]);

  const handleSwitchForm = () => {
    setIsRightPanelActive(!isRightPanelActive);
    setTimeout(() => {
      if (formtype === "Signup") {
        navigate('/login');
      } else {
        navigate('/signup');
      }
    }, 400); // Delay navigation until animation is mostly complete
  };

  return (
    <div className={`template-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
      <div className="welcome-section">
        <div className="welcome-content">
          <h2>{formtype === "Signup" ? "Welcome!" : "Welcome Back!"}</h2>
          <p>{formtype === "Signup" 
            ? "Create your account to get started" 
            : "To keep connected with us please login with your personal info"}
          </p>
          <button className="welcome-btn" onClick={handleSwitchForm}>
            {formtype === "Signup" ? "SIGN IN" : "SIGN UP"}
          </button>
        </div>
      </div>

      <div className="form-section">
        <div className="form-container">
          <h1>{formtype === "Signup" ? "Create Account" : "Sign In"}</h1>
          
          {formtype === "Signup" ? 
            (<SignupForm setIsLoggedIn={setIsLoggedIn}/>) : 
            (<LoginForm setIsLoggedIn={setIsLoggedIn}/>)
          }
        </div>
      </div>
    </div>
  )
}

export default Template