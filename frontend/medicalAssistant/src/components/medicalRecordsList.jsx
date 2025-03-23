import React, { useState } from 'react';
import { 
  FileText, Clipboard, Stethoscope, FileCheck, 
  Image, File, Download, Share, Search, 
  ArrowUpDown, Loader
} from 'lucide-react';
import './MedicalRecordsList.css';

const MedicalRecordsList = ({ records, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const getRecordIcon = (type) => {
    switch(type) {
      case 'prescription':
        return <Clipboard className="record-icon prescription" />;
      case 'labReport':
        return <Stethoscope className="record-icon lab-report" />;
      case 'discharge':
        return <FileCheck className="record-icon discharge" />;
      case 'imaging':
        return <Image className="record-icon imaging" />;
      case 'doctorNote':
        return <FileText className="record-icon doctor-note" />;
      default:
        return <File className="record-icon" />;
    }
  };

  const getRecordTypeName = (type) => {
    switch(type) {
      case 'prescription':
        return 'Prescription';
      case 'labReport':
        return 'Lab Report';
      case 'discharge':
        return 'Discharge Summary';
      case 'doctorNote':
        return 'Doctor\'s Notes';
      case 'imaging':
        return 'Imaging Results';
      default:
        return 'Other Document';
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      // Toggle order if clicking the same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter and sort records
  const filteredRecords = records
    .filter(record => filter === 'all' || record.type === filter)
    .filter(record => 
      record.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.uploadDate);
        const dateB = new Date(b.uploadDate);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'title') {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'type') {
        return sortOrder === 'asc' 
          ? a.type.localeCompare(b.type) 
          : b.type.localeCompare(a.type);
      }
      return 0;
    });

  return (
    <div className="medical-records-list">
      <div className="records-header">
        <h2>Medical Records</h2>
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
          <select 
            className="filter-select"
            value={filter}
            onChange={handleFilterChange}
          >
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
      ) : filteredRecords.length === 0 ? (
        <div className="empty-state">
          <p>No medical records found. Upload your first record to get started!</p>
        </div>
      ) : (
        <div className="records-table-container">
          <table className="records-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('title')} className="sortable">
                  Title
                  {sortBy === 'title' && (
                    <ArrowUpDown className={`sort-icon ${sortOrder}`} size={14} />
                  )}
                </th>
                <th onClick={() => handleSort('type')} className="sortable">
                  Type
                  {sortBy === 'type' && (
                    <ArrowUpDown className={`sort-icon ${sortOrder}`} size={14} />
                  )}
                </th>
                <th onClick={() => handleSort('date')} className="sortable">
                  Date
                  {sortBy === 'date' && (
                    <ArrowUpDown className={`sort-icon ${sortOrder}`} size={14} />
                  )}
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id} className="record-row">
                  <td className="record-title">
                    {getRecordIcon(record.type)}
                    <span>{record.title}</span>
                  </td>
                  <td>{getRecordTypeName(record.type)}</td>
                  <td>{formatDate(record.uploadDate)}</td>
                  <td>
                    <span className={`status-badge ${record.status}`}>
                      {record.status === 'processed' ? 'Processed' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-button view" title="View Record">
                        View
                      </button>
                      <button className="action-button icon-only" title="Download">
                        <Download size={16} />
                      </button>
                      <button className="action-button icon-only" title="Share">
                        <Share size={16} />
                      </button>
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