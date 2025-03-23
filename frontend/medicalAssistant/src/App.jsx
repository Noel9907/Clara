import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './components/login';
import Signup from './components/signup';
import PatientDashboard from './components/patientDashboard';
import RecordUploader from './components/recordUploader';
import MedicalRecordsList from './components/medicalRecordsList';
import { useNavigate } from 'react-router-dom';
import { loginUser, signupUser, fetchMedicalRecords, uploadRecord } from "./api";
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      fetchRecords(parsedUser.id);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // const handleLogin = async (credentials) => {
  //   setIsLoading(true);
  //   try {
  //     const userData = await loginUser(credentials);
  //     setUser(userData);
  //     setIsAuthenticated(true);
  //     localStorage.setItem("user", JSON.stringify(userData));
  //     fetchRecords(userData.id);
  //   } catch (error) {
  //     console.error("Login failed:", error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleSignup = async (userData) => {
  //   setIsLoading(true);
  //   try {
  //     const newUser = await signupUser(userData);
  //     setUser(newUser);
  //     setIsAuthenticated(true);
  //     setRecords([]);
  //     localStorage.setItem("medicalAppUser", JSON.stringify(newUser));
  //   } catch (error) {
  //     console.error("Signup failed:", error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setRecords([]);
    navigate("/login", { replace: true });
    localStorage.removeItem('medicalAppUser');
  };

  const fetchRecords = async (userId) => {
    setIsLoading(true);
    try {
      const fetchedRecords = await fetchMedicalRecords(userId);
      setRecords(fetchedRecords);
    } catch (error) {
      console.error("Failed to fetch records:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordUpload = async (newRecord) => {
    setIsLoading(true);
    try {
      const uploadedRecord = await uploadRecord({ ...newRecord, userId: user.id });
      setRecords((prevRecords) => [uploadedRecord, ...prevRecords]);
    } catch (error) {
      console.error("Error uploading record:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <div className="app">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      <main className="app-content">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login isLoading={isLoading} /> : <Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup isLoading={isLoading} /> : <Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><PatientDashboard user={user} recentRecords={records.slice(0, 3)} isLoading={isLoading} /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><RecordUploader onUploadComplete={handleRecordUpload} user={user} /></ProtectedRoute>} />
          <Route path="/records" element={<ProtectedRoute><MedicalRecordsList records={records} isLoading={isLoading} /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>© 2025 Medical Records Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
