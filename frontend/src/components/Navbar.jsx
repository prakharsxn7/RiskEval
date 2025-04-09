import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo2.png';

// Navigation configuration
const navLinks = [
    { path: "/", label: "Home" },
    { path: "/explore", label: "Explore" },
    { path: "/support", label: "Support" }
];

const authButtons = [
    { path: "/login", label: "Login", className: "nav-btn login-btn" },
    { path: "/signup", label: "Sign Up", className: "nav-btn signup-btn" }
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="nav-main">
            <div className="nav-left">
                <Link to="/" className="logo-link">
                    <img src={logo} alt="RiskEval Logo" className="nav-logo" />
                </Link>
            </div>

            <button 
                className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`nav-center ${isMenuOpen ? 'active' : ''}`}>
                <ul className="nav-ul">
                    {navLinks.map((link, index) => (
                        <li key={index}>
                            <Link 
                                to={link.path} 
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="nav-right">
                {authButtons.map((button, index) => (
                    <Link 
                        key={index}
                        to={button.path}
                        className={button.className}
                    >
                        {button.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default Navbar; 