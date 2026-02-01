import React, { useState } from 'react';
import EmergencyResponseSheet from './EmergencyResponseSheet';

const EmergencyAccessTab = () => {
    const [emergencyType, setEmergencyType] = useState('Snake Bite');
    const [message, setMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [activeEmergencyId, setActiveEmergencyId] = useState<string | null>(null);
    const [patientName, setPatientName] = useState('');
    const [isNameTouched, setIsNameTouched] = useState(false);

    const containerStyle: React.CSSProperties = {
        backgroundColor: '#fff',
        border: '2px solid #d32f2f',
        borderRadius: '8px',
        padding: '20px',
        margin: '20px auto',
        maxWidth: '600px',
        boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)',
        fontFamily: 'sans-serif',
        color: '#333',
    };

    const headerStyle: React.CSSProperties = {
        color: '#d32f2f',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderBottom: '1px solid #ffebee',
        paddingBottom: '10px',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        fontSize: '14px',
        color: '#444',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px',
        marginBottom: '20px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '16px',
        boxSizing: 'border-box',
        outline: 'none',
    };

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '16px',
        backgroundColor: '#d32f2f',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
        transition: 'background-color 0.3s',
        textTransform: 'uppercase',
    };

    const handleEmergency = async () => {
        setIsLoading(true);
        try {
            const payload = {
                type: emergencyType,
                name: patientName,
                message: message,

                location: "23.2599, 77.4126",
                timestamp: new Date().toISOString()
            };

            const response = await fetch('http://localhost:5678/webhook/emergency-trigger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Emergency response data:", data);
                if (data.id) {
                    setActiveEmergencyId(data.id);
                } else {
                    // Fallback for demo if no ID returned
                    console.warn("No ID returned from webhook, using mock ID for demo");
                    setActiveEmergencyId("demo-" + Date.now());
                }
                alert('Emergency signal sent successfully! Help is on the way.');
                setMessage(''); // Clear message on success
            } else {
                alert('Failed to send emergency signal. Please try again or call emergency services directly.');
            }
        } catch (error) {
            console.error('Error sending emergency signal:', error);
            alert('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <span>🚨</span> Emergency Access
            </div>



            <div>
                <label style={labelStyle} htmlFor="patient-name">Patient Name <span style={{ color: '#d32f2f' }}>*</span></label>
                <input
                    id="patient-name"
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    onBlur={() => setIsNameTouched(true)}
                    placeholder="Enter name of the person in need"
                    style={{
                        ...inputStyle,
                        borderColor: (isNameTouched && !patientName) ? '#d32f2f' : '#ccc',
                        backgroundColor: (isNameTouched && !patientName) ? '#fff5f5' : '#fff'
                    }}
                />
            </div>

            <div>
                <label style={labelStyle} htmlFor="emergency-type">Emergency Type</label>
                <select
                    id="emergency-type"
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    style={inputStyle}
                >
                    <option value="Snake Bite">Snake Bite</option>
                    <option value="Accident / Trauma">Accident / Trauma</option>
                    <option value="Cardiac / Chest Pain">Cardiac / Chest Pain</option>
                    <option value="Pregnancy Emergency">Pregnancy Emergency</option>
                    <option value="Severe Fever / Infection">Severe Fever / Infection</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div>
                <label style={labelStyle} htmlFor="emergency-message">Additional Message (Optional)</label>
                <textarea
                    id="emergency-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe the situation..."
                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                />
            </div>

            <button
                onClick={handleEmergency}
                style={{
                    ...buttonStyle,
                    opacity: (isLoading || !patientName) ? 0.6 : 1,
                    cursor: (isLoading || !patientName) ? 'not-allowed' : 'pointer',
                    backgroundColor: (isLoading || !patientName) ? '#e57373' : '#d32f2f'
                }}
                disabled={isLoading || !patientName}
            >
                {isLoading ? 'Sending Alert...' : 'PUSH FOR EMERGENCY'}
            </button>

            {activeEmergencyId && <EmergencyResponseSheet emergencyId={activeEmergencyId} />}
        </div>
    );
};

export default EmergencyAccessTab;
