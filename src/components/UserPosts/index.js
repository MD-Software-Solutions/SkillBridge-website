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
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { authUtils } from '../../utils/auth';
import ApplicationCard from '../Interior/ApplicationCard';
import axios from 'axios';
import TeacherAppCard from '../Interior/AppCardTeacher';

export default function UserPosts() {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(authUtils.getStoredUserData())
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [applications, setApplications] = useState([]);
    // const [teacherApps, setTeacherApps] = useState(null);
    const [teacherApps, setTeacherApps] = useState([]);


    // State management for job posts
    const [jobPosts, setJobPosts] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
          try {
            // First get all job postings by this user
            const jobsResponse = await axios.get(`http://localhost:4000/job_postings`);
            const userJobs = jobsResponse.data.filter(job => job.user_id === userData.user_id);
            
            // Get applications for each job
            const allApplications = [];
            for (const job of userJobs) {
              const applicationsResponse = await axios.get(`http://localhost:4000/applications/job/${job.job_id}`);
              // Add job title to each application for context
              const applicationsWithJobInfo = applicationsResponse.data.map(app => ({
                ...app,
                job_title: job.job_title
              }));
              allApplications.push(...applicationsWithJobInfo);
            }
            
            setTeacherApps(allApplications);
            // setLoading(false);
            console.log('Teacher applications loaded:', allApplications);
          } catch (err) {
            console.log(err)
          }
        };
        
        if (userData.is_teacher) {
            fetchApplications();
        }
        
      }, [userData.user_id]);


    
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

                const userJobPosts = jobDataArray.filter((jobData) => jobData.user_id === userData?.user_id);

                // Format the job posts
                const formattedJobPosts = userJobPosts.map((jobData) => ({
                    id: jobData.job_id,
                    posterAvatar: userData.profile_img_url || 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                    posterUsername: userData?.account_username || 'Unknown',
                    posterSchool: userData?.school_name || 'Unknown School',
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

        if (userData.is_teacher) {
            fetchJobPost();
        }
    }, [userData]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch(`http://localhost:4000/applications/user/${userData.user_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch applications');
                }
                const applicationsData = await response.json();
                setApplications(applicationsData);
                console.log('Applications loaded:', applicationsData);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        if (!userData.is_teacher) {
            fetchApplications();
        }
    }, [userData]);

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
                const jobId = jobPosts[jobToDelete]?.id;

                if (!jobId) throw new Error("Job ID not found.");

                const response = await fetch(`http://localhost:4000/job_postings/${jobId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error('Failed to delete job post.');
                }

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
                        <h2>
                            {userData.is_teacher ? 'Posts' : 'My Job Applications'}
                        </h2>
                        <i className="pi pi-send"></i>
                    </div>
                    <div className='content-wrap'>
                        <div className='userPosts-content-wrapper'>
                            {userData.is_teacher ? (
                                jobPosts.length > 0 ? (
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
                                    <p>No posts yet.</p>
                                )
                            ) : (
                                applications.length > 0 ? (
                                   (applications.map((application, index) => (
                                        <ApplicationCard
                                            application={application}
                                        />
                                    )))
                        
                                ) : (
                                    <p>No applications yet. Go to the home page to view listings and apply!</p>
                                )
                            )}
                        </div>
                    </div>
                    
                    {userData.is_teacher && (
                        <div>
                            <div className='userPosts-header-wrapper'>
                                <h2>
                                    Received applications
                                </h2>
                                <i className="pi pi-send"></i>
                            </div>
                            <div className='content-wrap'>
                                <div className='userPosts-content-wrapper'>
                                    {teacherApps.map(application => (
                                        <TeacherAppCard
                                            application={application}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
            </div>

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
