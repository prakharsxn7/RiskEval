import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

const Navigation = ({ isLoggedIn, setIsLoggedIn }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    }
  }, [isLoggedIn]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="nav-main">
      <div className="nav-left">
        <Link to="/" className="logo-link">
          <img 
            src={logo} 
            alt="RiskEval Logo" 
            className="nav-logo"
            loading="eager"
          />
        </Link>
      </div>

      <div className="nav-center">
        <ul className="nav-ul">
          <li>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              scrollToSection('home-section');
            }}>Home</a>
          </li>
          <li>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              scrollToSection('explore-section');
            }}>Explore</a>
          </li>
          <li>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              scrollToSection('support-section');
            }}>Support</a>
          </li>
        </ul>
      </div>

      <div className="nav-right">
        {!isLoggedIn ? (
          <>
            <Link to="/login">
              <button className="nav-btn login-btn">Login</button>
            </Link>
            <Link to="/signup">
              <button className="nav-btn signup-btn">Sign Up</button>
            </Link>
          </>
        ) : (
          <>
            <div className="user-info">
              <span className="username">{userData?.name || 'User'}</span>
            </div>
            <Link to="/dashboard">
              <button className="nav-btn dashboard-btn">Dashboard</button>
            </Link>
            <button 
              className="nav-btn logout-btn"
              onClick={() => {
                setIsLoggedIn(false);
                localStorage.removeItem('userData');
                toast.success("Logged out successfully");
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
