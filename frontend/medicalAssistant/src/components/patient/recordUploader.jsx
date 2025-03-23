import { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [recordTitle, setRecordTitle] = useState('');
  const [recordType, setRecordType] = useState('');
  const [provider, setProvider] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  console.log("herbferbh")

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    // Log that the function was triggered
    console.log("handleSubmit triggered", e);
    e.preventDefault();
    console.log("Submitting form...");

    if (!file) {
      console.error("No file selected");
      setErrorMessage('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('recordTitle', recordTitle);
      formData.append('recordType', recordType);
      formData.append('provider', provider);
      formData.append('facilityName', facilityName);

      console.log("Sending request to API...");

      const response = await fetch('http://localhost:3000/api/create/upload', {
        method: 'POST',
        body: formData,
      });

      console.log("Response received:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const responseData = await response.json();
      console.log("Upload successful:", responseData);

      setSuccessMessage('Record uploaded successfully!');
      setFile(null);
      setRecordTitle('');
      setRecordType('');
      setProvider('');
      setFacilityName('');

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(`Failed to upload record: ${error.message || 'Please try again'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Added manual submit handler as a backup
  const manualSubmit = () => {
    console.log("Manual submit button clicked");
    handleSubmit({ preventDefault: () => { } });
  };

  return (
    <div className="upload-container">
      <h2>Upload Record</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="form-group">
          <label htmlFor="file-upload">Select File:</label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="record-title">Record Title:</label>
          <input
            id="record-title"
            type="text"
            placeholder="Record Title"
            value={recordTitle}
            onChange={(e) => setRecordTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="record-type">Record Type:</label>
          <input
            id="record-type"
            type="text"
            placeholder="Record Type"
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="provider">Provider:</label>
          <input
            id="provider"
            type="text"
            placeholder="Provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="facility-name">Facility Name:</label>
          <input
            id="facility-name"
            type="text"
            placeholder="Facility Name"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button
            type="submit"
            disabled={isUploading}
            onClick={(e) => {
              console.log("Submit button clicked");
              // Let the form's onSubmit handle it
            }}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>

          {/* Backup button that calls handleSubmit directly */}
          <button
            type="button"
            disabled={isUploading}
            onClick={manualSubmit}
          >
            {isUploading ? 'Uploading...' : 'Upload (Alternative)'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;