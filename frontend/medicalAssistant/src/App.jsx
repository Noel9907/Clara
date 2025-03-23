import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './components/login';
import Signup from './components/signup';
import PatientDashboard from './components/patientDashboard';
import RecordUploader from './components/recordUploader';
import MedicalRecordsList from './components/medicalRecordsList';
import './App.css';

const App = () => {
  // State management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate authentication
  // In your handleLogin function, modify it to include navigation after state changes
  const handleLogin = (credentials) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock successful login
      const userData = {
        id: '12345',
        name: 'John Doe',
        email: credentials.email,
        patientId: 'P-2023-002',
        dateOfBirth: '1985-06-15'
      };

      // Set all states at once to avoid race conditions
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('medicalAppUser', JSON.stringify(userData));

      // Load user's records
      fetchMedicalRecords();
      setIsLoading(false);
    }, 1000);
  };

  // Handle signup
  const handleSignup = (userData) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock successful signup
      const newUser = {
        id: `user-${Date.now()}`,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        patientId: `P-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        dateOfBirth: userData.dateOfBirth || '2000-01-01'
      };
      setUser(newUser);
      setIsAuthenticated(true);
      setIsLoading(false);
      // Initialize with empty records for new user
      setRecords([]);
    }, 1500);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setRecords([]);
  };

  // Simulate fetching medical records
  const fetchMedicalRecords = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockRecords = [
        {
          id: 'rec1',
          title: 'Annual Physical Examination',
          type: 'doctorNote',
          uploadDate: '2025-01-15',
          status: 'processed',
          provider: 'Dr. Sarah Johnson',
          facilityName: 'General Hospital'
        },
        {
          id: 'rec2',
          title: 'Blood Test Results',
          type: 'labReport',
          uploadDate: '2025-02-20',
          status: 'processed',
          provider: 'Quest Diagnostics',
          facilityName: 'Medical Lab Services'
        },
        {
          id: 'rec3',
          title: 'Amoxicillin 500mg',
          type: 'prescription',
          uploadDate: '2025-03-01',
          status: 'processed',
          provider: 'Dr. Michael Chen',
          facilityName: 'Urgent Care Clinic'
        },
        {
          id: 'rec4',
          title: 'Chest X-Ray',
          type: 'imaging',
          uploadDate: '2025-03-10',
          status: 'pending',
          provider: 'Dr. Lisa Wong',
          facilityName: 'Radiology Center'
        },
        {
          id: 'rec5',
          title: 'Emergency Room Visit',
          type: 'discharge',
          uploadDate: '2025-03-18',
          status: 'processed',
          provider: 'Dr. James Wilson',
          facilityName: 'Metro Hospital'
        }
      ];
      setRecords(mockRecords);
      setIsLoading(false);
    }, 1500);
  };

  // Handle record upload
  const handleRecordUpload = (newRecord) => {
    const recordWithId = {
      ...newRecord,
      id: `rec${records.length + 1}`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setRecords([recordWithId, ...records]);
    // Show a success message or notification here
  };

  // Load initial data
  useEffect(() => {
    // Check for existing session
    const checkSession = () => {
      const savedUser = localStorage.getItem('medicalAppUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
        fetchMedicalRecords();
      } else {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Save user data when authenticated
  useEffect(() => {
    if (user) {
      localStorage.setItem('medicalAppUser', JSON.stringify(user));
    }
  }, [user]);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="app">
        <Navbar
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />

        <main className="app-content">
          <Routes>
            <Route path="/login" element={
              !isAuthenticated ? (
                <Login
                  onLogin={handleLogin}
                  isLoading={isLoading}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } />

            <Route path="/signup" element={
              !isAuthenticated ? (
                <Signup
                  onSignup={handleSignup}
                  isLoading={isLoading}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <PatientDashboard
                  user={user}
                  recentRecords={records.slice(0, 3)}
                  isLoading={isLoading}
                />
              </ProtectedRoute>
            } />

            <Route path="/upload" element={
              <ProtectedRoute>
                <RecordUploader
                  onUploadComplete={handleRecordUpload}
                  user={user}
                />
              </ProtectedRoute>
            } />

            <Route path="/records" element={
              <ProtectedRoute>
                <MedicalRecordsList
                  records={records}
                  isLoading={isLoading}
                />
              </ProtectedRoute>
            } />

            <Route path="/" element={
              isAuthenticated ?
                <Navigate to="/dashboard" replace /> :
                <Navigate to="/login" replace />
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>© 2025 Medical Records Portal. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;