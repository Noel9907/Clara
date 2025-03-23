import React, { useState, useEffect } from 'react';
import { FaPills, FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';
import './medicationsTab.css';

const MedicationsTab = ({ user }) => {
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMedications = async () => {
        setLoading(true);
        setError(null);

        try {
            const name = "allen"
            const response = await fetch('http://localhost:3000/api/get/meds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch medications');
            }

            const data = await response.json();
            setMedications(data.medications || []);
        } catch (error) {
            console.error('Error fetching medications:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedications();
    }, []);

    const handleRefresh = () => {
        fetchMedications();
    };

    return (
        <div className="medications-tab">
            <div className="medications-header">
                <h2><FaPills /> Your Medications</h2>
                <button
                    onClick={handleRefresh}
                    className="refresh-button"
                    disabled={loading}
                >
                    <FaSyncAlt className={loading ? 'rotating' : ''} />
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    <FaExclamationTriangle /> {error}
                </div>
            )}

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your medications...</p>
                </div>
            ) : medications.length > 0 ? (
                <div className="medications-list">
                    {medications.map((medication, index) => (
                        <div className="medication-card" key={index}>
                            <div className="medication-name">{medication.name}</div>
                            <div className="medication-details">
                                <div className="detail-item">
                                    <span className="detail-label">Dosage:</span>
                                    <span className="detail-value">{medication.dosage}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Frequency:</span>
                                    <span className="detail-value">{medication.frequency}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <FaPills className="empty-icon" />
                    <h3>No medications found</h3>
                    <p>You don't have any medications recorded in your profile.</p>
                </div>
            )}
        </div>
    );
};

export default MedicationsTab;