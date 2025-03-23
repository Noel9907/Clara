import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaPlus } from 'react-icons/fa';
import { AuthContext } from '../context/authContext.jsx';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="MediAssist" className="logo-image" />
          <span className="logo-text">MediAssist</span>
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/records" className="nav-link">Medical Records</Link>
              {user.role === 'doctor' && (
                <Link to="/patients" className="nav-link">Patients</Link>
              )}
              <div className="user-menu">
                <button 
                  className="profile-button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="avatar">
                    {user.profile?.firstName?.[0] || <FaUser />}
                  </div>
                  <span className="user-name">{user.profile?.firstName || 'User'}</span>
                </button>
                
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      <FaUser className="dropdown-icon" />
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item">
                      <FaSignOutAlt className="dropdown-icon" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-button">
                <FaPlus className="button-icon" />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;