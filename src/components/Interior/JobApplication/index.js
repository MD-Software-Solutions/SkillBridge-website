import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import './index.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuInterior from '../../MenuInterior';
import { authUtils } from '../../../utils/auth';

const JobApplication = ({ posterUsername, posterSchool, jobTitle, userid, jobId }) => {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(`lovely : ${location.state.jobId}`);
    const posterUserName = location.state.posterUsername
    const jobtitle = location.state.jobTitle

    const [formData, setFormData] = useState({
        whyInterested: '',
        relevantSkills: '',
        hopeToGain: '',
        userId: authUtils.getStoredUserData().user_id,
        jobId: location.state.jobId
    });

    const handleSubmit = () => {
        confirmDialog({
            message: 'Are you sure you want to submit this application?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    // Create application data object using the existing formData state
                    const applicationData = {
                        job_id: location.state.jobId,
                        user_id: authUtils.getStoredUserData().user_id,
                        why_interested: formData.whyInterested,
                        relevant_skills: formData.relevantSkills,
                        hope_to_gain: formData.hopeToGain
                    };
            
                    console.log('Sending application data:', applicationData);
            
                    const response = await fetch('http://localhost:4000/applications', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(applicationData)
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Server error:', errorData);
                        throw new Error(`Failed to submit application: ${errorData.error}`);
                    }
            
                    const result = await response.json();
                    console.log('Application submitted successfully:', result);
                    navigate('/application-success');
                    
                } catch (error) {
                    console.error('Error submitting application:', error);
                }
            },
            acceptIcon: 'pi pi-check',
            acceptClassName: 'p-button-secondary',
            rejectIcon: 'pi pi-times',
            rejectClassName: 'p-button-outlined',
            acceptLabel: 'Yes, submit',
            rejectLabel: 'No, cancel'
        });
    };

    return (
        <div>
            <MenuInterior />
            <div className="job-application">
                <div className="form-container">
                    <div className="form-header">
                        <h2>Application for {jobtitle}</h2>
                    </div>
                    <div className="job-details">
                        <p>Posted by: {posterUserName}</p>
                    </div>

                    <div className="form-field">
                        <label className="field-label">
                            Why are you interested in this position?
                        </label>
                        <InputTextarea
                            value={formData.whyInterested}
                            onChange={(e) => setFormData({...formData, whyInterested: e.target.value})}
                            rows={3}
                            className="w-full"
                        />
                    </div>

                    <div className="form-field">
                        <label className="field-label">
                            What are your relevant skills and how do you feel that you can contribute?
                        </label>
                        <InputTextarea
                            value={formData.relevantSkills}
                            onChange={(e) => setFormData({...formData, relevantSkills: e.target.value})}
                            rows={3}
                            className="w-full"
                        />
                    </div>

                    <div className="form-field">
                        <label className="field-label">
                            What do you hope to gain from this experience?
                        </label>
                        <InputTextarea
                            value={formData.hopeToGain}
                            onChange={(e) => setFormData({...formData, hopeToGain: e.target.value})}
                            rows={3}
                            className="w-full"
                        />
                    </div>

                    <div className="form-field button-container">
                        <Button 
                            label="Submit Application" 
                            icon="pi pi-check" 
                            onClick={handleSubmit}
                            className="w-full"
                            severity='info'
                        />
                    </div>
                </div>
            </div>
            <ConfirmDialog />
        </div>
    );
};

export default JobApplication;
