import React, { useState, useEffect } from 'react';
import { FaHistory, FaPills, FaHeart, FaUserMd, FaFilePrescription, FaFileMedical, FaFileUpload, FaTrash } from 'react-icons/fa';
import MedicalRecordsList from './medicalRecordsList';
import './PatientDashboard.css';

const PatientDashboard = ({ user, recentRecords, isLoading }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [records, setRecords] = useState(recentRecords || []);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [activeUploadType, setActiveUploadType] = useState('prescription');

  // Update records when props change
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

  // Simplified Prescription Upload Component
  const PrescriptionUploader = () => {
    const [files, setFiles] = useState([]);
    const [prescriptionDetails, setPrescriptionDetails] = useState({
      date: new Date().toISOString().split('T')[0],
      doctorName: '',
    });
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (e) => {
      const selectedFiles = Array.from(e.target.files);
      setFiles([...files, ...selectedFiles]);
    };

    const handleRemoveFile = (index) => {
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
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
      setUploading(true);

      try {
        // Mock successful upload
        setTimeout(() => {
          setUploadSuccess(true);

          // Create a mock response for demo purposes
          const mockResult = {
            id: `prescription-${Date.now()}`,
            status: 'pending'
          };

          // Add to records
          handleRecordUpload({
            ...mockResult,
            type: 'prescription',
            date: prescriptionDetails.date,
            title: `Prescription from Dr. ${prescriptionDetails.doctorName || 'Unknown'}`,
            uploadDate: new Date().toISOString().split('T')[0],
            provider: prescriptionDetails.doctorName || 'Unknown'
          });

          // Reset form
          setFiles([]);
          setPrescriptionDetails({
            date: new Date().toISOString().split('T')[0],
            doctorName: '',
          });

          // Hide success message after 3 seconds
          setTimeout(() => {
            setUploadSuccess(false);
          }, 3000);
          
          setUploading(false);
        }, 1500);
      } catch (error) {
        console.error('Error uploading prescription:', error);
        setUploading(false);
      }
    };

    return (
      <div className="prescription-uploader">
        <h2><FaFilePrescription /> Upload Prescription</h2>

        {uploadSuccess && (
          <div className="success-message">
            Prescription uploaded successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
                  multiple
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  required
                />
              </label>
            </div>

            {files.length > 0 && (
              <div className="file-list">
                <h4>Selected Files:</h4>
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>
                      {file.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="remove-file-btn"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="upload-button"
            disabled={uploading || files.length === 0}
          >
            {uploading ? 'Uploading...' : 'Upload Prescription'}
          </button>
        </form>
      </div>
    );
  };

  // Simplified Lab Report Upload Component
  const LabReportUploader = () => {
    const [files, setFiles] = useState([]);
    const [labReportDetails, setLabReportDetails] = useState({
      testDate: new Date().toISOString().split('T')[0],
      testType: ''
    });
    const [testTypes] = useState([
      'Blood Panel', 'Urinalysis', 'Lipid Panel', 'Liver Function Test',
      'Kidney Function Test', 'Thyroid Panel', 'COVID-19 Test',
      'Genetic Test', 'Imaging', 'Other'
    ]);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (e) => {
      const selectedFiles = Array.from(e.target.files);
      setFiles([...files, ...selectedFiles]);
    };

    const handleRemoveFile = (index) => {
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setLabReportDetails({
        ...labReportDetails,
        [name]: value
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setUploading(true);

      try {
        // Mock successful upload
        setTimeout(() => {
          setUploadSuccess(true);

          // Create a mock response for demo purposes
          const mockResult = {
            id: `lab-${Date.now()}`,
            status: 'pending'
          };

          // Add to records
          handleRecordUpload({
            ...mockResult,
            type: 'labReport',
            date: labReportDetails.testDate,
            title: `Lab Report - ${labReportDetails.testType}`,
            uploadDate: new Date().toISOString().split('T')[0],
            provider: labReportDetails.testType
          });

          // Reset form
          setFiles([]);
          setLabReportDetails({
            testDate: new Date().toISOString().split('T')[0],
            testType: ''
          });

          // Hide success message after 3 seconds
          setTimeout(() => {
            setUploadSuccess(false);
          }, 3000);
          
          setUploading(false);
        }, 1500);
      } catch (error) {
        console.error('Error uploading lab report:', error);
        setUploading(false);
      }
    };

    return (
      <div className="lab-report-uploader">
        <h2><FaFileMedical /> Upload Lab Report</h2>

        {uploadSuccess && (
          <div className="success-message">
            Lab report uploaded successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Test Type</label>
            <select
              name="testType"
              value={labReportDetails.testType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select test type</option>
              {testTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Test Date</label>
            <input
              type="date"
              name="testDate"
              value={labReportDetails.testDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="file-upload-container">
            <div className="file-upload-box">
              <label htmlFor="lab-report-files">
                <FaFileUpload />
                <span>Upload Lab Report Files</span>
                <input
                  type="file"
                  id="lab-report-files"
                  multiple
                  accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  required
                />
              </label>
            </div>

            {files.length > 0 && (
              <div className="file-list">
                <h4>Selected Files:</h4>
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>
                      {file.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="remove-file-btn"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="upload-button"
            disabled={uploading || files.length === 0}
          >
            {uploading ? 'Uploading...' : 'Upload Lab Report'}
          </button>
        </form>
      </div>
    );
  };

  // Basic ChatBot component stub (simplified from your original)
  const ChatBot = ({ onMinimize, onExpand }) => {
    return (
      <div className="chat-bot-container">
        <div className="chat-bot-header">
          <h3>Health Assistant</h3>
          <div>
            <button onClick={() => onMinimize(true)}>-</button>
            <button onClick={() => onExpand(true)}>[]</button>
          </div>
        </div>
        <div className="chat-bot-body">
          <p>How can I help you with your health today?</p>
        </div>
      </div>
    );
  };

  // Basic LifestyleTab component stub
  const LifestyleTab = () => {
    return (
      <div className="lifestyle-tab">
        <h2>Your Lifestyle Insights</h2>
        <p>Track your health metrics and lifestyle choices here.</p>
      </div>
    );
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
            className={`tab-button ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <FaUserMd className="tab-icon" />
            <span>My Doctors</span>
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
            <div className="placeholder-content">
              <h2>Medications</h2>
              <p>Your current medications and prescriptions will appear here.</p>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="placeholder-content">
              <h2>My Doctors</h2>
              <p>Your healthcare providers will appear here.</p>
            </div>
          )}

          {activeTab === 'lifestyle' && <LifestyleTab />}
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          maxWidth: chatExpanded ? '90%' : '400px',
          width: chatMinimized ? 'auto' : (chatExpanded ? '90%' : '350px'),
          height: chatExpanded ? '80vh' : 'auto',
          transition: 'all 0.3s ease'
        }}
      >
        <ChatBot
          onMinimize={handleChatMinimize}
          onExpand={handleChatExpand}
        />
      </div>
    </div>
  );
};

export default PatientDashboard;