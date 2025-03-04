import React, { useState, useEffect } from "react";
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog'; // Add this import
import "./index.scss"

const ApplicationCard = ({ application }) => {
    const [jobTitle, setJobTitle] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);


    useEffect(() => {
        const fetchJobTitle = async () => {
            try {
                const response = await fetch('http://localhost:4000/job_postings');
                if (!response.ok) {
                    throw new Error('Failed to fetch job postings');
                }
                const jobPostings = await response.json();
                const matchingJob = jobPostings.find(job => job.job_id === application.job_id);
                if (matchingJob) {
                    setJobTitle(matchingJob.job_title);
                }
            } catch (error) {
                console.error('Error fetching job title:', error);
            }
        };

        fetchJobTitle();
    }, [application.job_id]);

    const getStatusSeverity = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'warning';
            case 'accepted':
                return 'success';
            case 'rejected':
                return 'danger';
            default:
                return 'info';
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:4000/applications/${application.application_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 404) {
                console.error('Application not found');
                return;
            }
    
            if (!response.ok) {
                throw new Error('Failed to delete application');
            }
    
            const data = await response.json();
            console.log(data.message);
            setIsDeleted(true); // Add this line to hide the component
    
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    const deleteDialogFooter = (
        <>
            <Button 
                label="No" 
                icon="pi pi-times" 
                outlined 
                onClick={() => setShowDeleteDialog(false)} 
            />
            <Button 
                label="Yes" 
                icon="pi pi-check" 
                severity="danger" 
                onClick={() => {
                    setShowDeleteDialog(false);
                    handleDelete();
                }} 
            />
        </>
    );

    if (isDeleted) { 
        return null;
    }

    return (
        <div className="application-card-container">
            <div className="application-card-header">
                <div className="status-info">
                    <div className="header-content">
                        <h3 className="job-title">{jobTitle}</h3>
                        <Tag 
                            value={application.application_status || 'pending'} 
                            severity={getStatusSeverity(application.application_status)}
                        />
                    </div>
                    <div className="application-details">
                        <div className="application-date">
                            Applied: {new Date(application.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="application-content">
                <div className="content-section">
                    <div className="section-title">Why Interested</div>
                    <div className="section-text">{application.why_interested}</div>
                </div>

                <div className="content-section">
                    <div className="section-title">Relevant Skills</div>
                    <div className="section-text">{application.relevant_skills}</div>
                </div>

                <div className="content-section">
                    <div className="section-title">Hope to Gain</div>
                    <div className="section-text">{application.hope_to_gain}</div>
                </div>

                <div className="content-section feedback-section">
                    <div className="section-title">Feedback</div>
                    <div className="section-text">
                        {application.review_feedback ? application.review_feedback :  'No feedback provided.'}
                    </div>
                </div>

                <div className="action-section">
                    <Button 
                        label="Delete Application" 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={() => setShowDeleteDialog(true)} // Changed this to open dialog
                    />
                </div>
            </div>

            <Dialog 
                visible={showDeleteDialog} 
                style={{ width: '450px' }} 
                header="Confirm Delete" 
                modal 
                footer={deleteDialogFooter} 
                onHide={() => setShowDeleteDialog(false)}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>Are you sure you want to delete this application?</span>
                </div>
            </Dialog>
        </div>
    );
};

export default ApplicationCard;
