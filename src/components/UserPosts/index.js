import './index.scss'
import React, { useState, useEffect, useContext } from 'react'
import MenuInterior from '../MenuInterior'
import 'primeicons/primeicons.css'
import { AuthContext } from '../../context/AuthContext'
import JobPost from '../Interior/JobPost'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import { authUtils } from '../../utils/auth'
import ApplicationCard from '../Interior/ApplicationCard'
import axios from 'axios'
import TeacherAppCard from '../Interior/AppCardTeacher'
import PendingPost from '../UserPosts/pendingPost'

export default function UserPosts() {
  // const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(authUtils.getStoredUserData())
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [jobToDelete, setJobToDelete] = useState(null)
  const [applications, setApplications] = useState([])
  const [pendingJobPost, setPendingJobPost] = useState([])
  const [teacherApps, setTeacherApps] = useState([])
  const [jobPosts, setJobPosts] = useState([])
  const [userList, setUserList] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authUtils.authenticatedRequest(
          'http://localhost:4000/users'
        )
        setUserList(response)
        console.log('User List:', response)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUsers()
  }, [])

  const fetchApplications = async () => {
    try {
      // First get all job postings by this user
      const jobsResponse = await axios.get(`http://localhost:4000/job_postings`)
      const userJobs = jobsResponse.data.filter(
        (job) => job.user_id === userData.user_id
      )

      // Get applications for each job
      const allApplications = []
      for (const job of userJobs) {
        const applicationsResponse = await axios.get(
          `http://localhost:4000/applications/job/${job.job_id}`
        )
        
        // For each application, fetch the applicant's user info
        const applicationsWithJobAndUserInfo = await Promise.all(
          applicationsResponse.data.map(async (app) => {
            try {
              const userResponse = await fetch(`http://localhost:4000/get-user/${app.user_id}`)
              if (userResponse.ok) {
                const userData = await userResponse.json()
                return {
                  ...app,
                  job_title: job.job_title,
                  applicant_name: userData.account_username || userData.first_name + ' ' + userData.last_name || 'Unknown User',
                  applicant_email: userData.email || 'No email provided',
                  applicant_school: userData.school_name || 'Unknown School'
                }
              } else {
                return {
                  ...app,
                  job_title: job.job_title,
                  applicant_name: 'Unknown User',
                  applicant_email: 'No email provided',
                  applicant_school: 'Unknown School'
                }
              }
            } catch (error) {
              console.error('Error fetching user info for application:', error)
              return {
                ...app,
                job_title: job.job_title,
                applicant_name: 'Unknown User',
                applicant_email: 'No email provided',
                applicant_school: 'Unknown School'
              }
            }
          })
        )
        
        allApplications.push(...applicationsWithJobAndUserInfo)
      }

      setTeacherApps(allApplications)
      console.log('Teacher applications loaded:', allApplications)
    } catch (err) {
      console.log(err)
    }
  }

  const unapprovedPosts = async () => {
    try {
      const response = await fetch(`http://localhost:4000/job_postings/pending`)
      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }
      const pendingData = await response.json()

      const formattedPendingPosts = pendingData.map((job) => {
        const user = userList.find((u) => u.user_id === job.user_id) || {} // Find user or default to an empty object
        console.log('PENDING User:', user)
        return {
          id: job.job_id,
          posterAvatar:
            user.profile_img_url ||
            'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
          posterUsername: user.account_username || 'Unknown User',
          posterSchool: user.school_name || 'Unknown School',
          jobTitle: job.job_title,
          jobDescription: job.job_description,
          filters: job.job_type_tag.concat(job.industry_tag),
          googleFormLink: job.job_signup_form || '#',
        }
      })

      setPendingJobPost(formattedPendingPosts)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  useEffect(() => {
    if (userData.is_teacher) {
      fetchApplications()
    }
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/users/${userData.user_id}/admin-status`
        )
        if (response.data.isAdmin) {
          setUserData((prevData) => ({ ...prevData, isAdmin: true }))
          unapprovedPosts() // Call this only if the user is an admin
        }
      } catch (error) {
        console.error('Error fetching admin status:', error)
      }
    }

    if (userData.user_id) {
      fetchAdminStatus()
    }
  }, [userList, userData.user_id])

  useEffect(() => {
    const fetchJobPost = async () => {
      try {
        const response = await fetch('http://localhost:4000/job_postings')

        if (!response.ok) {
          throw new Error('Failed to fetch job postings.')
        }

        const jobDataArray = await response.json()
        const userJobPosts = jobDataArray.filter(
          (jobData) => jobData.user_id === userData?.user_id
        )

        const formattedJobPosts = userJobPosts.map((jobData) => ({
          id: jobData.job_id,
          posterAvatar:
            userData.profile_img_url ||
            'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
          posterUsername: userData?.account_username || 'Unknown',
          posterSchool: userData?.school_name || 'Unknown School',
          jobTitle: jobData.job_title || 'Default Job Title',
          jobDescription: jobData.job_description || 'Default Job Description',
          filters: jobData.job_type_tag.concat(jobData.industry_tag),
          googleFormLink: jobData.job_signup_form || '#',
        }))

        setJobPosts(formattedJobPosts)
      } catch (error) {
        console.error('Error fetching job postings:', error)
      }
    }

    if (userData.is_teacher) {
      fetchJobPost()
    }
  }, [userData])

  useEffect(() => {
    const fetchStudentApplications = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/applications/user/${userData.user_id}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch applications')
        }
        const applicationsData = await response.json()
        setApplications(applicationsData)
        console.log('Applications loaded:', applicationsData)
      } catch (error) {
        console.error('Error fetching applications:', error)
      }
    }

    if (!userData.is_teacher) {
      fetchStudentApplications()
    }
  }, [userData])

  const handleOpenConfirmation = (jobIndex) => {
    setJobToDelete(jobIndex)
    setShowConfirmation(true)
  }

  const handleCloseConfirmation = () => {
    setJobToDelete(null)
    setShowConfirmation(false)
  }

  const handleConfirmDelete = async () => {
    if (jobToDelete !== null) {
      try {
        const jobId = jobPosts[jobToDelete]?.id

        if (!jobId) throw new Error('Job ID not found.')

        const response = await fetch(
          `http://localhost:4000/job_postings/${jobId}`,
          {
            method: 'DELETE',
          }
        )

        if (!response.ok) {
          throw new Error('Failed to delete job post.')
        }

        setJobPosts((prevJobPosts) =>
          prevJobPosts.filter((_, index) => index !== jobToDelete)
        )
      } catch (error) {
        console.error('Error deleting job:', error)
      } finally {
        setShowConfirmation(false)
        setJobToDelete(null)
      }
    }
  }

  // Helper function to format interview date
  const formatInterviewDate = (dateString) => {
    if (!dateString) return 'Not specified'
    
    try {
      const date = new Date(dateString)
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
      return date.toLocaleDateString('en-US', options)
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  // Filter applications by status
  const pendingApplications = teacherApps.filter(app => !app.isComplete && app.application_status !== 'interview')
  const interviewApplications = teacherApps.filter(app => app.application_status === 'interview')

  // Determine grid columns based on whether there are interview applications
  const getGridColumns = () => {
    if (!userData.is_teacher) return '1fr'
    if (interviewApplications.length > 0) return '1fr 1fr 1fr'
    return '1fr 1fr'
  }

  return (
    <div>
      <MenuInterior />
      <div className="userPosts-wrapper-primary">
        <div
          className="userPosts-wrapper-secondary"
          style={{
            gridTemplateColumns: getGridColumns(),
            display: 'grid', 
            padding: !userData.is_teacher ? '5% 18%' : '2%',
          }}
        >
          <div>
            <div className="userPosts-header-wrapper">
              <h2>{userData.is_teacher ? 'Posts' : 'My Job Applications'}</h2>
              <i className="pi pi-send"></i>
            </div>
            <div className="content-wrap">
              <div className="userPosts-content-wrapper">
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
                        isTeacher={userData.is_teacher}
                      />
                    ))
                  ) : (
                    <p>No posts yet.</p>
                  )
                ) : applications.length > 0 ? (
                  applications.map((application, index) => (
                    <ApplicationCard key={index} application={application} />
                  ))
                ) : (
                  <p>
                    No applications yet. Go to the home page to view listings
                    and apply!
                  </p>
                )}
              </div>
            </div>
          </div>

          {userData.is_teacher && (
            <div>
              <div className="userPosts-header-wrapper">
                <h2>Received applications</h2>
                <i className="pi pi-send"></i>
              </div>
              <div className="content-wrap">
                <div className="userPosts-content-wrapper">
                  {pendingApplications.length > 0 ? (
                    pendingApplications.map((application) => (
                      <TeacherAppCard
                        key={application.id}
                        application={application}
                        onApplicationUpdate={fetchApplications}
                      />
                    ))
                  ) : (
                    <p>No pending applications.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {userData.is_teacher && interviewApplications.length > 0 && (
            <div>
              <div className="userPosts-header-wrapper">
                <h2>Scheduled Interviews</h2>
                <i className="pi pi-calendar"></i>
              </div>
              <div className="content-wrap">
                <div className="userPosts-content-wrapper">
                  {interviewApplications.map((application) => (
                    <Card 
                      key={application.id}
                      className="interview-card"
                      style={{ marginBottom: '1rem' }}
                    >
                      <div className="interview-header">
                        <h4>{application.job_title}</h4>
                        <Tag value="Interview Scheduled" severity="info" />
                      </div>
                      <div className="interview-content">
                        <div className="field">
                          <label><strong>Applicant:</strong></label>
                          <p>{application.applicant_name}</p>
                        </div>
                        <div className="field">
                          <label><strong>School:</strong></label>
                          <p>{application.applicant_school}</p>
                        </div>
                        <div className="field">
                          <label><strong>Interview Date & Time:</strong></label>
                          <p>{formatInterviewDate(application.interviewDate)}</p>
                        </div>
                        <div className="field">
                          <label><strong>Interview Location:</strong></label>
                          <p>{application.interviewLocation || 'Not specified'}</p>
                        </div>
                      </div>
                    </Card>
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
            <Button
              label="No"
              icon="pi pi-times"
              onClick={handleCloseConfirmation}
              className="p-button-text"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              onClick={handleConfirmDelete}
              className="p-button-danger"
            />
          </div>
        }
      >
        <p>Are you sure you want to delete this job post?</p>
      </Dialog>
    </div>
  )
}