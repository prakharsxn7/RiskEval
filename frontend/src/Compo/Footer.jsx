import React from 'react';
import { Link } from 'react-router-dom';
import logo from "@assets/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo-container">
            <Link to="/" className="footer-logo-link">
              <img 
                src={logo} 
                alt="RiskEval Logo" 
                className="footer-logo"
              />
            </Link>
          </div>
          <h3>About Us</h3>
          <p>We are dedicated to providing the best risk evaluation services to help businesses make informed decisions.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/explore">Explore</Link></li>
            <li><Link to="/support">Support</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li>Email: support@riskeval.com</li>
            <li>Phone: (555) 123-4567</li>
            <li>Address: 123 Business Ave, Suite 100</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe to our newsletter for updates and insights.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} RiskEval. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;