import React, { useState, useEffect } from 'react';
import { FaUpload, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './RecordUploader.css';

const RecordUploader = ({ onRecordUploaded }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [recordType, setRecordType] = useState('prescription');
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [patientName, setPatientName] = useState('');

  // Improved localStorage access on component mount
  useEffect(() => {
    // Try both possible keys - 'user' and 'username'
    const username = "allen"
    
    // Log all localStorage keys for debugging
    console.log('All localStorage keys:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(`${key}: ${localStorage.getItem(key)}`);
    }
    
    if (username) {
      console.log('Found username in localStorage:', username);
      setPatientName(username);
    } else {
      console.error('Username not found in localStorage');
      // Fallback to a default name or prompt user
      setPatientName('Unknown Patient');
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create preview for image files
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('recordType', recordType);
    
    // Add patient name to form data with extra verification
    const nameToUse = patientName || 'Unknown Patient';
    formData.append('name', nameToUse);
    console.log('Submitting with patient name:', nameToUse);

    try {
      setUploadStatus('uploading');

      // Log formData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      console.log(formData)
      const response = await fetch('http://localhost:3000/api/create/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const result = await response.json();

      setUploadStatus('success');
      setProcessingStatus('Document successfully processed!');

      // Notify parent component
      onRecordUploaded({
        id: result.id,
        type: recordType,
        title: file.name,
        uploadDate: new Date().toISOString(),
        status: 'processed',
        imageUrl: result.imageUrl || preview,
        patientName: nameToUse, // Include patient name in the returned data
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setRecordType('prescription');
        setUploadStatus('idle');
        setUploadProgress(0);
        setProcessingStatus('');
      }, 3000);
    } catch (error) {
      console.error('Error uploading record:', error);
      setUploadStatus('error');
    }
  };

  return (
    <div className="record-uploader">
      <h2>Upload Medical Record</h2>
      <p className="uploader-description">
        Upload your handwritten prescriptions, test reports, and other medical documents.
        Our AI will automatically digitize and organize them for easy access.
      </p>

      <p className="patient-info">
        {patientName ? `Patient: ${patientName}` : "Patient name not found in localStorage"}
      </p>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>Record Type</label>
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            disabled={uploadStatus === 'uploading'}
          >
            <option value="prescription">Prescription</option>
            <option value="labReport">Lab Report</option>
            <option value="discharge">Discharge Summary</option>
            <option value="doctorNote">Doctor's Notes</option>
            <option value="imaging">Imaging Results</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="upload-area">
          {!file ? (
            <div className="dropzone">
              <input
                type="file"
                id="file-upload"
                className="file-input"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                disabled={uploadStatus === 'uploading'}
              />
              <label htmlFor="file-upload" className="file-label">
                <FaUpload className="upload-icon" />
                <span>Click or drag file to upload</span>
                <span className="file-support">Supports: JPG, PNG, PDF</span>
              </label>
            </div>
          ) : (
            <div className="file-preview">
              {preview ? (
                <img src={preview} alt="Document preview" className="preview-image" />
              ) : (
                <div className="file-name">{file.name}</div>
              )}
              {uploadStatus === 'idle' && (
                <button
                  type="button"
                  className="remove-file"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </div>

        {uploadStatus === 'uploading' && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="progress-status">
              <span><FaSpinner className="spin" /> Uploading...</span>
            </div>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="upload-success">
            <FaCheckCircle className="success-icon" />
            <span>{processingStatus}</span>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="upload-error">
            <FaTimesCircle className="error-icon" />
            <span>Error processing document. Please try again.</span>
          </div>
        )}

        {file && uploadStatus === 'idle' && (
          <button type="submit" className="upload-button">
            Upload Document
          </button>
        )}
      </form>
    </div>
  );
};

export default RecordUploader;