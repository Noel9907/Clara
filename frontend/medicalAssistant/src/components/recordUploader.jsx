import React, { useState } from 'react';
import { FaUpload, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './RecordUploader.css';

const RecordUploader = ({ onRecordUploaded }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [recordType, setRecordType] = useState('prescription');
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState(''); // OCR processing status message

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
    
    try {
      setUploadStatus('uploading');
      
      // Simulate file upload with progress
      const uploadSimulation = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            simulateProcessing();
          }
        }, 300);
      };
      
      // Simulate AI processing
      const simulateProcessing = () => {
        setProcessingStatus('Performing OCR on document...');
        
        setTimeout(() => {
          setProcessingStatus('Extracting medical information...');
          
          setTimeout(() => {
            setProcessingStatus('Structuring data...');
            
            setTimeout(() => {
              // Mock successful upload
              const mockNewRecord = {
                id: Date.now(),
                type: recordType,
                title: file.name,
                uploadDate: new Date().toISOString(),
                status: 'processed',
                imageUrl: preview
              };
              
              onRecordUploaded(mockNewRecord);
              setUploadStatus('success');
              setProcessingStatus('Document successfully processed!');
              
              // Reset form after 3 seconds
              setTimeout(() => {
                setFile(null);
                setPreview(null);
                setRecordType('prescription');
                setUploadStatus('idle');
                setUploadProgress(0);
                setProcessingStatus('');
              }, 3000);
            }, 1000);
          }, 1000);
        }, 1000);
      };
      
      uploadSimulation();
      
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
              {uploadProgress < 100 ? (
                <span><FaSpinner className="spin" /> Uploading... {uploadProgress}%</span>
              ) : (
                <span><FaSpinner className="spin" /> {processingStatus}</span>
              )}
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
          <button 
            type="submit" 
            className="upload-button"
          >
            Process Document
          </button>
        )}
      </form>
    </div>
  );
};

export default RecordUploader;