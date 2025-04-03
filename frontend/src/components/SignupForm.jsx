import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupForm = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bankName: "",
    employeeId: "",
    department: "",
    role: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      localStorage.setItem('userType', userType);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        userType: userType,
        ...(userType === 'bank' && {
          bankName: formData.bankName,
          employeeId: formData.employeeId,
          department: formData.department,
          role: formData.role
        })
      };
      localStorage.setItem('userData', JSON.stringify(userData));

      setIsLoggedIn(true);
      toast.success("Account created successfully");
      navigate("/dashboard");
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
      toast.error("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="user-type-toggle">
        <button 
          className={`toggle-btn ${userType === 'customer' ? 'active' : ''}`}
          onClick={() => setUserType('customer')}
          type="button"
        >
          Customer
        </button>
        <button 
          className={`toggle-btn ${userType === 'bank' ? 'active' : ''}`}
          onClick={() => setUserType('bank')}
          type="button"
        >
          Bank Associate
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>
              First Name
              <span className="required">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={changeHandler}
              required
              placeholder="Enter your first name"
            />
          </div>

          <div className="form-group">
            <label>
              Last Name
              <span className="required">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={changeHandler}
              required
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            Email Address
            <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            required
            placeholder="Enter your email"
          />
        </div>

        {userType === 'bank' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>
                  Bank Name
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={changeHandler}
                  required
                  placeholder="Enter bank name"
                />
              </div>

              <div className="form-group">
                <label>
                  Employee ID
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={changeHandler}
                  required
                  placeholder="Enter employee ID"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Department
                  <span className="required">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={changeHandler}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="risk">Risk Management</option>
                  <option value="credit">Credit Analysis</option>
                  <option value="loans">Loan Processing</option>
                  <option value="compliance">Compliance</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Role
                  <span className="required">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={changeHandler}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="analyst">Risk Analyst</option>
                  <option value="manager">Risk Manager</option>
                  <option value="officer">Loan Officer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>
              Password
              <span className="required">*</span>
            </label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={changeHandler}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="view-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>
              Confirm Password
              <span className="required">*</span>
            </label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={changeHandler}
                required
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="view-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : (userType === 'customer' ? 'Create Customer Account' : 'Create Bank Account')}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
