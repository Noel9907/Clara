import React, { useState, useEffect } from "react";
import {
  FileText, Clipboard, Stethoscope, FileCheck,
  Image, File, Download, Share, Search,
  ArrowUpDown, Loader
} from "lucide-react";
import "./MedicalRecordsList.css";

const MedicalRecordsList = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Function to transform patient data into the format expected by the component
  const transformPatientData = (patientData) => {
    if (!patientData) return [];

    const transformedRecords = [];

    // Transform medications into records
    if (patientData.medications && patientData.medications.length > 0) {
      patientData.medications.forEach((med, index) => {
        transformedRecords.push({
          id: `med-${index}`,
          title: med.name,
          type: "prescription",
          uploadDate: new Date().toISOString().slice(0, 10), // Using current date as fallback
          status: "processed",
          details: med
        });
      });
    }

    // Transform doctor notes into records
    if (patientData.doctor_notes && patientData.doctor_notes.length > 0) {
      patientData.doctor_notes.forEach((note, index) => {
        transformedRecords.push({
          id: `note-${index}`,
          title: `Doctor's Note - ${note.date}`,
          type: "doctorNote",
          uploadDate: note.date,
          status: "processed",
          details: note.note
        });
      });
    }

    // Transform lab results into records
    if (patientData.lab_results && Object.keys(patientData.lab_results).length > 0) {
      Object.entries(patientData.lab_results).forEach(([test, value], index) => {
        transformedRecords.push({
          id: `lab-${index}`,
          title: `Lab Result: ${test}`,
          type: "labReport",
          uploadDate: new Date().toISOString().slice(0, 10), // Using current date as fallback
          status: "processed",
          details: { test, value }
        });
      });
    }

    // Add conditions as doctor notes/reports
    if (patientData.conditions && patientData.conditions.length > 0) {
      transformedRecords.push({
        id: "conditions",
        title: "Medical Conditions Summary",
        type: "discharge",
        uploadDate: new Date().toISOString().slice(0, 10),
        status: "processed",
        details: patientData.conditions
      });
    }

    return transformedRecords;
  };

  // Fetch data when component mounts
  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Create a proper JSON object
        const nameObject = { name: "allen" }; // In a real app, this would come from authentication context

        // Send the JSON object in the request body
        const response = await fetch(`http://localhost:3000/api/get/getrecords`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nameObject)
        });

        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data); // Log the full response

          if (data && data.medicalHistory) {
            const transformedData = transformPatientData(data.medicalHistory);
            console.log("Transformed Data:", transformedData); // Log transformed data
            setRecords(transformedData);
          } else {
            // If we have a successful response but no medicalHistory
            setRecords([]);
            setError("No medical records found for this patient.");
          }
        } else {
          // Handle non-200 responses
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        console.error("Error fetching records:", err);
        setError("An error occurred while loading your medical records. Please try again later.");
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // Icon mapping for different record types
  const getRecordIcon = (type) => {
    switch (type) {
      case "prescription":
        return <Clipboard className="record-icon prescription" />;
      case "labReport":
        return <Stethoscope className="record-icon lab-report" />;
      case "discharge":
        return <FileCheck className="record-icon discharge" />;
      case "imaging":
        return <Image className="record-icon imaging" />;
      case "doctorNote":
        return <FileText className="record-icon doctor-note" />;
      default:
        return <File className="record-icon" />;
    }
  };

  // Map type to display names
  const getRecordTypeName = (type) => {
    switch (type) {
      case "prescription":
        return "Prescription";
      case "labReport":
        return "Lab Report";
      case "discharge":
        return "Discharge Summary";
      case "doctorNote":
        return "Doctor's Notes";
      case "imaging":
        return "Imaging Results";
      default:
        return "Other Document";
    }
  };

  // Format date properly
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Unknown Date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "Unknown Date";
    }
  };

  // Handle search and filtering
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setFilter(e.target.value);
  const handleSort = (criteria) => {
    if (sortBy === criteria) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortBy(criteria);
      setSortOrder("desc");
    }
  };

  // Apply filtering, searching, and sorting
  const filteredRecords = records
    .filter((record) => filter === "all" || record.type === filter)
    .filter((record) => record.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.uploadDate) - new Date(b.uploadDate)
          : new Date(b.uploadDate) - new Date(a.uploadDate);
      } else if (sortBy === "title") {
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      } else if (sortBy === "type") {
        return sortOrder === "asc" ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type);
      }
      return 0;
    });

  return (
    <div className="medical-records-list">
      <div className="records-header">
        <h2>Your Medical Records</h2>
        <div className="controls">
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <select className="filter-select" value={filter} onChange={handleFilterChange}>
            <option value="all">All Types</option>
            <option value="prescription">Prescriptions</option>
            <option value="labReport">Lab Reports</option>
            <option value="discharge">Discharge Summaries</option>
            <option value="doctorNote">Doctor's Notes</option>
            <option value="imaging">Imaging Results</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <Loader className="spin" />
          <p>Loading your medical records...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Error: {error}</p>
          <p>Please try refreshing the page.</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="empty-state">
          <p>No medical records found.</p>
        </div>
      ) : (
        <div className="records-table-container">
          <table className="records-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("title")} className="sortable">
                  Title {sortBy === "title" && <ArrowUpDown className={`sort-icon ${sortOrder}`} size={14} />}
                </th>
                <th onClick={() => handleSort("type")} className="sortable">
                  Type {sortBy === "type" && <ArrowUpDown className={`sort-icon ${sortOrder}`} size={14} />}
                </th>
                <th onClick={() => handleSort("date")} className="sortable">
                  Date {sortBy === "date" && <ArrowUpDown className={`sort-icon ${sortOrder}`} size={14} />}
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="record-row">
                  <td className="record-title">
                    {getRecordIcon(record.type)}
                    <span>{record.title}</span>
                  </td>
                  <td>{getRecordTypeName(record.type)}</td>
                  <td>{formatDate(record.uploadDate)}</td>
                  <td>
                    <span className={`status-badge ${record.status}`}>
                      {record.status === "processed" ? "Processed" : "Pending"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-button view" title="View Record">View</button>
                      <button className="action-button icon-only" title="Download"><Download size={16} /></button>
                      <button className="action-button icon-only" title="Share"><Share size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsList;