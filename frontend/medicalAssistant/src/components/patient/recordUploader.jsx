import React, { useState } from 'react';
import { FaFileUpload, FaSpinner } from 'react-icons/fa';
import './recordUploader.css';

const RecordUploader = ({ onRecordUploaded }) => {
  const [file, setFile] = useState(null);
  const [recordTitle, setRecordTitle] = useState('');
  const [recordType, setRecordType] = useState('doctorNote');
  const [provider, setProvider] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-fill title with file name if empty
      if (!recordTitle) {
        const fileName = selectedFile.name.split('.')[0];
        setRecordTitle(fileName);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!file) {
      setErrorMessage('Please select a file to upload');
      return;
    }
    
    if (!recordTitle.trim()) {
      setErrorMessage('Please enter a title for this record');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    
    try {
      // Simulating upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new record object
      const newRecord = {
        id: `rec-${Date.now()}`,
        title: recordTitle,
        type: recordType,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        provider: provider,
        facilityName: facilityName,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      };
      
      // Call the parent component's handler
      if (onRecordUploaded) {
        onRecordUploaded(newRecord);
      }
      
      // Reset form
      setSuccessMessage('Record uploaded successfully!');
      setFile(null);
      setRecordTitle('');
      setProvider('');
      setFacilityName('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading record:', error);
      setErrorMessage('Failed to upload record. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="record-uploader">
      <h2>Upload Medical Record</h2>
      <p className="uploader-instructions">
        Upload your medical documents, lab results, prescriptions, or imaging reports.
      </p>
      
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group file-upload-area">
          <label htmlFor="file-upload" className="file-upload-label">
            {file ? file.name : 'Choose a file'}
            <FaFileUpload className="upload-icon" />
          </label>
          <input 
            id="file-upload" 
            type="file" 
            onChange={handleFileChange}
            className="file-input"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          {file && (
            <div className="file-info">
              <span>Size: {(file.size / 1024).toFixed(1)} KB</span>
              <span>Type: {file.type}</span>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="record-title">Record Title *</label>
          <input
            id="record-title"
            type="text"
            value={recordTitle}
            onChange={(e) => setRecordTitle(e.target.value)}
            placeholder="e.g., Annual Physical, Blood Test Results"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="record-type">Record Type *</label>
          <select 
            id="record-type" 
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            required
          >
            <option value="doctorNote">Doctor's Note</option>
            <option value="labReport">Lab Report</option>
            <option value="prescription">Prescription</option>
            <option value="imaging">Imaging (X-Ray, MRI, etc.)</option>
            <option value="discharge">Discharge Summary</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="provider">Healthcare Provider</label>
          <input
            id="provider"
            type="text"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="e.g., Dr. Smith"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="facility">Facility Name</label>
          <input
            id="facility"
            type="text"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            placeholder="e.g., Memorial Hospital"
          />
        </div>
        
        <button 
          type="submit" 
          className="upload-button"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <FaSpinner className="spinner-icon" />
              Uploading...
            </>
          ) : (
            <>
              <FaFileUpload className="upload-button-icon" />
              Upload Record
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RecordUploader;