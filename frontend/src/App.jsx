import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from "react-router-dom";

import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Main from "./components/Main";
import Info from "./components/Info";
import Stat from "./components/Stat";
import Statistics from "./components/Statistics";
import Footer from "./components/Footer";
import Loading from "./components/Loading";

const Home = () => {
  return (
    <>
      <div id="home-section">
        <Main />
      </div>

      <div id="explore-section">
        <Info />
        <Stat />
        <Statistics />
      </div>

      <div id="support-section">
        <Footer />
      </div>
    </>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Show loading for 800ms when route changes

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="app">
      <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <main>
        {isLoading && <Loading />}
        <Routes>
          <Route
            path="/"
            element={<Home/>}
          />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/signup"
            element={<Signup setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route 
            path="/dashboard" 
            element={
              isLoggedIn ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;