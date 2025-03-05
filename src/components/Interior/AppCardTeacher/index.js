import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import './index.scss';
import { useNavigate } from 'react-router-dom';

const TeacherAppCard = ({ application, onApplicationUpdate }) => {
    const [studentInfo, setStudentInfo] = useState(null);
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [status, setStatus] = useState('');
    const [reviewText, setReviewText] = useState('');

    const statusOptions = [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Reviewing', value: 'reviewing' }
    ];

    const fetchApplicationDetails = async () => {
        try {
            const response = await fetch(`http://localhost:4000/applications/${application.application_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch application details');
            }
            const data = await response.json();
            setStatus(data.application_status || '');
            setReviewText(data.review_feedback || '');
        } catch (error) {
            console.error('Error fetching application details:', error);
        }
    };

    const handleOpenModal = async () => {
        await fetchApplicationDetails();
        setShowReviewModal(true);
    };

    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                const response = await fetch(`http://localhost:4000/get-user/${application.user_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch student info');
                }
                const data = await response.json();
                setStudentInfo(data);
                setStudentId(data.user_id)
                console.log(data)
            } catch (error) {
                console.error('Error fetching student info:', error);
            }
        };

        fetchStudentInfo();
    }, [application.user_id]);

    const goToProfile = () => {
        console.log(studentId)
        navigate(`/accountpage`, { state: { userid: studentId } });
    };

    const handleReviewSubmit = async () => {
      try {
          const response = await fetch(`http://localhost:4000/applications/${application.application_id}/status`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  application_status: status,
                  review_feedback: reviewText,
                  isComplete: true
              })
          });
  
          if (!response.ok) {
              throw new Error('Failed to update application');
          }
  
          console.log('Review submitted successfully');
          setShowReviewModal(false);
          setStatus('');
          setReviewText('');
          onApplicationUpdate();  // Call this to refresh the parent component
      } catch (error) {
          console.error('Error submitting review:', error);
      }
  };
    const saveDraft = async () => {
        try {
            const response = await fetch(`http://localhost:4000/applications/${application.application_id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    application_status: status,
                    review_feedback: reviewText,
                    isComplete: false  // This saves as draft
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to save draft');
            }
    
            console.log('Draft saved successfully');
            setShowReviewModal(false);
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    };
    
    const reviewModalFooter = (
        <div>
            <Button 
                label="Cancel" 
                icon="pi pi-times" 
                onClick={() => setShowReviewModal(false)} 
                className="p-button-text"
            />
            <Button 
                label="Save Draft" 
                icon="pi pi-save" 
                onClick={saveDraft} 
                className="p-button-secondary mr-2 ml-2"
            />
            <Button 
                label="Submit Review" 
                icon="pi pi-check" 
                onClick={handleReviewSubmit} 
                autoFocus 
            />
        </div>
    );

    return (
        <>
            <Card
                title={`Job: ${application.job_title}`}
                subTitle={
                    <>
                        {studentInfo && `Submitted by ${studentInfo.real_name} on ${new Date(application.created_at).toLocaleDateString()}`}
                    </>
                }
                className="teacher-app-card"
            >
                <div className="application-content">
                    <div className="content-section">
                        <h4 className="section-title">Why Interested</h4>
                        <p className="section-text">{application.why_interested}</p>
                    </div>
                    <Divider />
                    <div className="content-section">
                        <h4 className="section-title">Relevant Skills</h4>
                        <p className="section-text">{application.relevant_skills}</p>
                    </div>
                    <Divider />
                    <div className="content-section">
                        <h4 className="section-title">Hope to Gain</h4>
                        <p className="section-text">{application.hope_to_gain}</p>
                    </div>
                    <Divider />
                    <div className="button-section">
                        <Button 
                            label="View Profile" 
                            icon="pi pi-search" 
                            className="p-button-warning mr-2"
                            onClick={goToProfile}
                        />
                        <Button 
                            label="Review" 
                            icon="pi pi-check" 
                            className="p-button-success mr-2"
                            onClick={handleOpenModal}
                        />
                        <Button 
                            label="Delete" 
                            icon="pi pi-trash" 
                            className="p-button-danger"
                        />
                    </div>
                </div>
            </Card>

            <Dialog 
                header="Review Application" 
                visible={showReviewModal} 
                style={{ width: '70vw' }} 
                footer={reviewModalFooter}
                onHide={() => setShowReviewModal(false)}
            >
                <div className="review-form">
                    <div className="field">
                        <label htmlFor="status" className="font-bold">Status</label>
                        <Dropdown
                            id="status"
                            value={status}
                            options={statusOptions}
                            onChange={(e) => setStatus(e.value)}
                            placeholder="Select Status"
                            className="w-full mt-2"
                        />
                    </div>
                    
                    <div className="field mt-4">
                        <label htmlFor="review" className="font-bold">Review Comments</label>
                        <InputTextarea
                            id="review"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={8}
                            className="w-full mt-2"
                            placeholder="Enter your review comments here..."
                            autoResize
                            style={{ 
                                minHeight: '200px',
                                width: '100%',        // ensures full width
                                maxWidth: '100%'      // prevents overflow
                            }}
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default TeacherAppCard;
