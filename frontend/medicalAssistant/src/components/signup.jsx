import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaSpinner } from 'react-icons/fa';
import { AuthContext } from '../context/authContext';
import './signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: 'sooraj',
    name: 'Sooraj',
    type: 'patient', // Default type
    gender: 'male',
    password: 'noice123',
    confirmPassword: 'noice123',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTypeToggle = (type) => {
    setFormData({ ...formData, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const userType = formData.type === 'patient' ? false : true;


      if (typeof signup !== 'function') {
        throw new Error('Signup function is undefined. Check AuthContext.');
      }

      const response = await signup(
        formData.username,
        formData.password,
        formData.gender,
        userType,  // boolean value
        formData.name
      );

      console.log('Submitting form data:', response);

      console.log('Signup successful:', response);
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.message === 'username already exists') {
        setError('Username already taken. Please choose a different username.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Fill in your details to get started</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>User Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-toggle-btn ${formData.type === 'patient' ? 'active' : ''}`}
                onClick={() => handleTypeToggle('patient')}
              >
                Patient
              </button>
              <button
                type="button"
                className={`type-toggle-btn ${formData.type === 'healthcare_provider' ? 'active' : ''}`}
                onClick={() => handleTypeToggle('healthcare_provider')}
              >
                Healthcare Provider
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                minLength="8"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                minLength="8"
              />
            </div>
          </div>

          <div className="form-options">
            <div className="terms-agreement">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">I agree to the Terms of Service</label>
            </div>
          </div>

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? <FaSpinner className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account? <Link to="/login" className="signin-link">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="signup-image-container">
        <div className="signup-image">
          <div className="signup-overlay">
            <h2>Your Health, Digitized</h2>
            <p>Securely manage all your medical records in one place</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
