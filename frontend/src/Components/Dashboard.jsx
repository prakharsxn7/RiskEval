import React, { useState, useEffect } from 'react';
import CustomerDashboard from '../Components/CustomerDashboard';
import BankDashboard from './BankDashboard';

const Dashboard = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Get user type from localStorage
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
    } else {
      // If no user type is stored, redirect to login
      window.location.href = '/login';
    }
  }, []);

  if (!userType) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {userType === 'customer' ? <CustomerDashboard /> : <BankDashboard />}
    </div>
  );
};

export default Dashboard;