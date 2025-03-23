import React, { useState, useEffect } from 'react';
import { FaHistory, FaPills, FaHeart, FaUserMd, FaFilePrescription, FaFileMedical, FaFileUpload, FaTrash } from 'react-icons/fa';
import MedicalRecordsList from './medicalRecordsList';
import MedicationsTab from './patient/medicationsTab';
import ChatBot from './patient/chatbot';
import LifestyleTab from './patient/lifestyleTab';
import './PatientDashboard.css';

const PatientDashboard = ({ user, recentRecords, isLoading }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [records, setRecords] = useState(recentRecords || []);
  const [activeUploadType, setActiveUploadType] = useState('prescription');
  const [chatMinimized, setChatMinimized] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);

  useEffect(() => {
    if (recentRecords) {
      setRecords(recentRecords);
    }
  }, [recentRecords]);

  const handleRecordUpload = (newRecord) => {
    setRecords([newRecord, ...records]);
  };

  const handleChatMinimize = (isMinimized) => {
    setChatMinimized(isMinimized);
  };

  const handleChatExpand = (isExpanded) => {
    setChatExpanded(isExpanded);
  };

  const PrescriptionUploader = () => {
    const [file, setFile] = useState(null);
    const [prescriptionDetails, setPrescriptionDetails] = useState({
      date: new Date().toISOString().split('T')[0],
      doctorName: 'kinnankuty',
      patientName: ''
    });
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Get patient name from localStorage when component mounts
    useEffect(() => {
      // Try different possible storage keys
      const username = 'allen';

      console.log('Retrieved patient name from storage:', username);

      setPrescriptionDetails(prev => ({
        ...prev,
        patientName: username  // Fixed: changed 'name' to 'patientName'
      }));
    }, []);

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setPrescriptionDetails({
        ...prescriptionDetails,
        [name]: value
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Submitting form...");

      if (!file) {
        setErrorMessage('Please select a file to upload');
        return;
      }

      setUploading(true);
      setErrorMessage('');

      // Add artificial delay before making the actual upload request
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay

      try {
        // Create FormData and verify field names
        const formData = new FormData();

        // This is critical - "image" must match the field name expected by multer
        formData.append('image', file);
        formData.append('doctorName', prescriptionDetails.doctorName);
        formData.append('date', prescriptionDetails.date);

        // IMPORTANT: Send the patient name with BOTH keys to ensure compatibility
        formData.append('name', prescriptionDetails.patientName); // Use 'name' as expected by backend
        formData.append('patientName', prescriptionDetails.patientName); // Keep this for backward compatibility

        // Log the form data entries to verify what's being sent
        for (let [key, value] of formData.entries()) {
          console.log(`FormData contains: ${key}: ${value instanceof File ? value.name : value}`);
        }

        const response = await fetch('http://localhost:3000/api/create/notes', {
          method: 'POST',
          body: formData,
          // Don't set Content-Type header - let the browser set it with the boundary
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const responseData = await response.json();
        console.log("Upload successful:", responseData);

        // Add to records
        handleRecordUpload({
          ...responseData.data,
          type: 'prescription',
          uploadDate: new Date().toISOString().split('T')[0],
          patientName: prescriptionDetails.patientName // Include patient name in the record
        });

        setUploadSuccess(true);
        setFile(null);
        setPrescriptionDetails({
          date: new Date().toISOString().split('T')[0],
          doctorName: 'kinnankuty',
          patientName: prescriptionDetails.patientName // Keep the patient name
        });

        setTimeout(() => setUploadSuccess(false), 3000);
      } catch (error) {
        console.error("Upload error:", error);
        setErrorMessage(`Failed to upload: ${error.message || 'Please try again'}`);
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="prescription-uploader">
        <h2><FaFilePrescription /> Upload Prescription</h2>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        {uploadSuccess && (
          <div className="success-message">
            Prescription uploaded successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={prescriptionDetails.patientName}
              onChange={handleInputChange}
              placeholder="Patient name"
              required
            />
          </div>

          <div className="form-group">
            <label>Doctor's Name</label>
            <input
              type="text"
              name="doctorName"
              value={prescriptionDetails.doctorName}
              onChange={handleInputChange}
              placeholder="Doctor's name"
              required
            />
          </div>

          <div className="form-group">
            <label>Prescription Date</label>
            <input
              type="date"
              name="date"
              value={prescriptionDetails.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="file-upload-container">
            <div className="file-upload-box">
              <label htmlFor="prescription-files">
                <FaFileUpload />
                <span>Upload Prescription Image/PDF</span>
                <input
                  type="file"
                  id="prescription-files"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  required
                />
              </label>
            </div>

            {file && (
              <div className="file-list">
                <h4>Selected File:</h4>
                <ul>
                  <li>
                    {file.name}
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="remove-file-btn"
                    >
                      <FaTrash />
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="upload-button"
            disabled={uploading || !file}
          >
            {uploading ? 'Uploading...' : 'Upload Prescription'}
          </button>
        </form>
      </div>
    );
  };

  // Rest of your component (LabReportUploader, etc.) remains the same
  const LabReportUploader = () => {
    // Your existing code for LabReportUploader
    // ...
  };

  return (
    <div className="patient-dashboard">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name || 'Patient'}</h1>
          <p>Manage your medical records and health information</p>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <FaFileUpload className="tab-icon" />
            <span>Upload Records</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FaHistory className="tab-icon" />
            <span>Medical History</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'medications' ? 'active' : ''}`}
            onClick={() => setActiveTab('medications')}
          >
            <FaPills className="tab-icon" />
            <span>Medications</span>
          </button>

          <button
            className={`tab-button ${activeTab === 'lifestyle' ? 'active' : ''}`}
            onClick={() => setActiveTab('lifestyle')}
          >
            <FaHeart className="tab-icon" />
            <span>Lifestyle</span>
          </button>
        </div>

        <div className="dashboard-main">
          {activeTab === 'upload' && (
            <div>
              <div className="upload-type-tabs">
                <button
                  className={`upload-type-button ${activeUploadType === 'prescription' ? 'active' : ''}`}
                  onClick={() => setActiveUploadType('prescription')}
                >
                  Prescriptions
                </button>
                <button
                  className={`upload-type-button ${activeUploadType === 'labReport' ? 'active' : ''}`}
                  onClick={() => setActiveUploadType('labReport')}
                >
                  Lab Reports
                </button>
              </div>

              {activeUploadType === 'prescription' && (
                <PrescriptionUploader />
              )}

              {activeUploadType === 'labReport' && (
                <LabReportUploader />
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <MedicalRecordsList records={records} isLoading={isLoading} />
          )}

          {activeTab === 'medications' && (
            <MedicationsTab user={user} />
          )}

          {activeTab === 'doctors' && (
            <div className="placeholder-content">
              <h2>My Doctors</h2>
              <p>Your healthcare providers will appear here.</p>
            </div>
          )}

          {activeTab === 'lifestyle' && <LifestyleTab user={user} />}
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <ChatBot
          onMinimize={handleChatMinimize}
          onExpand={handleChatExpand}
        />
      </div>
    </div>
  );
};

export default PatientDashboard;