import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { AuthContext } from '../context/authContext';
import './Login.css';
import { Turtle, X } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    console.log("Form submission started");
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call the login function from context
      await login(formData.username, formData.password);

      // Navigate to dashboard after login
      navigate('/dashboard');
      console.log("Login successful");
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Enter your credentials to access your account</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-container">
              <FaEnvelope className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" name="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
          </div>
          
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? <FaSpinner className="spinner" /> : 'Login'}
          </button>
        </form>
        
        <div className="signup-link">
          <p>Don't have an account? <Link to="/signup">Create one now</Link></p>
        </div>
      </div>
      
      <div className="login-image-container">
        <div className="login-image-content">
          <Turtle size={48} />
          <h2>Your Health, Digitized</h2>
          <p>Securely manage all your medical records in one place</p>
        </div>
      </div>
    </div>
  );
};

export default Login;