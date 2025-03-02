/**
 * UserPosts Component
 * 
 * This component displays and manages job posts created by the user. 
 * It fetches job postings from an API, allows users to delete their posts, 
 * and manages job-related state updates.
 */

import './index.scss';
import React, { useState, useEffect, useContext } from 'react';
import MenuInterior from '../MenuInterior';
import 'primeicons/primeicons.css';
import { AuthContext } from '../../context/AuthContext';
import JobPost from '../Interior/JobPost';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export default function UserPosts() {
    const { user } = useContext(AuthContext);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);

    // State management for job posts
    const [jobPosts, setJobPosts] = useState([]);
    
    useEffect(() => {
        /**
         * Fetches job posts from the API and filters them based on the logged-in user.
         * Updates the state with formatted job post data.
         */
        const fetchJobPost = async () => {
            try {
                const response = await fetch('http://localhost:4000/job_postings');
                if (!response.ok) {
                    throw new Error('Failed to fetch job postings.');
                }

                const jobDataArray = await response.json();

                const userJobPosts = jobDataArray.filter((jobData) => jobData.user_id === user[0]?.user_id);

                // Format the job posts
                const formattedJobPosts = userJobPosts.map((jobData) => ({
                    id: jobData.job_id, // Unique identifier for each job post
                    posterAvatar: user[0].profile_img_url || 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                    posterUsername: user[0]?.account_username || 'Unknown',
                    posterSchool: user[0]?.school_name || 'Unknown School',
                    jobTitle: jobData.job_title || 'Default Job Title',
                    jobDescription: jobData.job_description || 'Default Job Description',
                    filters: jobData.job_type_tag.concat(jobData.industry_tag),
                    googleFormLink: jobData.job_signup_form || '#',
                }));

                setJobPosts(formattedJobPosts);
            } catch (error) {
                console.error('Error fetching job postings:', error);
            }
        };

        fetchJobPost();
    }, [user]);

    /**
     * Opens the confirmation dialog for deleting a job post.
     * @param {number} jobIndex - Index of the job post to be deleted.
     */
    const handleOpenConfirmation = (jobIndex) => {
        setJobToDelete(jobIndex);
        setShowConfirmation(true);
    };

    /**
     * Closes the confirmation dialog.
     */
    const handleCloseConfirmation = () => {
        setJobToDelete(null);
        setShowConfirmation(false);
    };

    /**
     * Confirms and deletes the selected job post.
     */
    const handleConfirmDelete = async () => {
        if (jobToDelete !== null) {
            try {
                const jobId = jobPosts[jobToDelete]?.id; // Get the job ID

                if (!jobId) throw new Error("Job ID not found.");

                // API call to delete the job post
                const response = await fetch(`http://localhost:4000/job_postings/${jobId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error('Failed to delete job post.');
                }

                // Remove the job from local state
                setJobPosts((prevJobPosts) => prevJobPosts.filter((_, index) => index !== jobToDelete));
            } catch (error) {
                console.error("Error deleting job:", error);
            } finally {
                setShowConfirmation(false);
                setJobToDelete(null);
            }
        }
    };

    return (
        <div>
            <MenuInterior />
            <div className='userPosts-wrapper-primary'>
                <div className='userPosts-wrapper-secondary'>
                    <div className='userPosts-header-wrapper'>
                        <h2>Your Posts</h2>
                        <i className="pi pi-send"></i>
                    </div>
                    <div className='userPosts-content-wrapper'>
                        {jobPosts.length > 0 ? (
                            jobPosts.map((job, index) => (
                                <JobPost
                                    key={index}
                                    posterAvatar={job.posterAvatar}
                                    posterUsername={job.posterUsername}
                                    posterSchool={job.posterSchool}
                                    jobTitle={job.jobTitle}
                                    jobDescription={job.jobDescription}
                                    filters={job.filters}
                                    googleFormLink={job.googleFormLink}
                                    onDelete={() => handleOpenConfirmation(index)}
                                    showDelete={true}
                                />
                            ))
                        ) : (
                            <p>You have not made any posts.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog
                header="Confirm Deletion"
                visible={showConfirmation}
                style={{ width: '400px' }}
                onHide={handleCloseConfirmation}
                footer={
                    <div>
                        <Button label="No" icon="pi pi-times" onClick={handleCloseConfirmation} className="p-button-text" />
                        <Button label="Yes" icon="pi pi-check" onClick={handleConfirmDelete} className="p-button-danger" />
                    </div>
                }
            >
                <p>Are you sure you want to delete this job post?</p>
            </Dialog>
        </div>
    );
}
