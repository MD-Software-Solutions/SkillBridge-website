import {
  FileText,
  User,
  HelpCircle,
  Search,
  Check,
  Heart,
  MoreHorizontal,
  LogOut,
  MapPin,
  Bot,
  Building,
} from 'lucide-react'
import './index.scss'
import MenuInterior from '../MenuInterior'
import { Avatar } from 'primereact/avatar'
import { Divider } from 'primereact/divider'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { OverlayPanel } from 'primereact/overlaypanel'
import React, { useRef, useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { Link, useNavigate } from 'react-router-dom'
import JobPost from './JobPost'
import AddPostBar from './AddPostBar'
import { authUtils } from '../../utils/auth'
import { applyAiFilter } from './applyAiFilter'
import { Dialog } from 'primereact/dialog'
import { useLocation } from 'react-router-dom'
import ViewSwitcherSidebar from '../PreviewModule'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default function Interior() {
  const navigate = useNavigate()
  const location = useLocation()
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // State management for job posts and users
  const [jobPosts, setJobPosts] = useState([])
  const [userList, setUserList] = useState([])

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJobTypes, setSelectedJobTypes] = useState([])
  const [selectedIndustries, setSelectedIndustries] = useState([])
  const [selectedLocations, setSelectedLocations] = useState([])

  // Overlay panel states
  const overlayPanelsRef = useRef({})
  const [isHovering, setIsHovering] = useState(false)
  const [hoveredJobId, setHoveredJobId] = useState(null)

  useEffect(() => {
    const user_info_getter = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const username = user?.username

        if (!username) {
          setError('No user information found')
          navigate('/sign-in')
          return
        }

        const result = await authUtils.getUserInfo(username)
        console.log('Full result from getUserInfo:', result)

        if (result.success) {
          setUserData(result.data)
          setLoading(false)
          console.log('User admin Data:', result.data.is_admin)

          // Check if this is preview mode
          const previewMode = location.state?.previewMode
          const isAdminPreview = location.state?.isAdminPreview

          if (previewMode) {
            // In preview mode, check what type of preview
            if (previewMode === 'teacher') {
              navigate('/TeacherDashboard', {
                state: {
                  isAdminPreview: true,
                },
              })
            }
            // If previewMode === 'student', stay on current page (Interior)
          } else {
            // Normal mode - redirect based on user role
            if (result.data.is_admin) {
              navigate('/AdminDashboard')
            } else if (result.data.is_teacher) {
              navigate('/TeacherDashboard')
            }
          }
        } else if (result.error.includes('Authentication failed')) {
          navigate('/sign-in')
        }
      } catch (error) {
        if (error.message.includes('Authentication failed')) {
          navigate('/sign-in')
        }
        setLoading(false)
      }
    }
    user_info_getter()
  }, [location.state])

  // Fetch all users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authUtils.authenticatedRequest(
          'http://localhost:4000/users'
        )
        setUserList(response)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUsers()
  }, [])

  // Fetch job postings and map user information to each job post
  useEffect(() => {
    const fetchJobPost = async () => {
      try {
        const response = await authUtils.authenticatedRequest(
          'http://localhost:4000/job_postings'
        )

        if (response && Array.isArray(response)) {
          const formattedJobPosts = response
            .map((jobData) => {
              const matchingUser = userList.find(
                (user) => user.user_id === jobData.user_id
              )

              return {
                job_id: jobData.job_id,
                poster_id: jobData.user_id,
                posterAvatar:
                  matchingUser?.profile_img_url ||
                  'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                posterUsername: matchingUser?.account_username || 'Unknown',
                posterSchool: matchingUser?.school_name || 'Unknown School',
                jobTitle: jobData.job_title || 'Default Job Title',
                jobDescription:
                  jobData.job_description || 'Default Job Description',
                filters: jobData.job_type_tag.concat(jobData.industry_tag),
                googleFormLink: jobData.job_signup_form || '#',
                userid: matchingUser?.user_id || 'Unknown',
                isApproved: jobData.isApproved,
                jobTypes: jobData.job_type_tag || [],
                industries: jobData.industry_tag || [],
                locations: jobData.job_type_tag
                  ? jobData.job_type_tag.filter((tag) =>
                      ['Remote', 'On-site', 'Hybrid', 'On-Site'].includes(tag)
                    )
                  : [],
                location: matchingUser?.state || 'Unknown Location',
                date: dayjs(jobData.date_created).fromNow() || 'Unknown Date',
              }
            })
            .filter((job) => job.isApproved) // Filter only approved job postings

          console.log('Filtered Jobs:', formattedJobPosts)
          setJobPosts(formattedJobPosts)
        }
      } catch (error) {
        console.error('Error fetching job postings:', error)
      }
    }

    if (userList.length > 0) {
      fetchJobPost()
    }
  }, [userList])

  const quickActions = [
    {
      icon: FileText,
      label: !userData?.is_teacher ? 'View Applications' : 'View Posts',
      color: '#3b82f6',
      action: () => navigate('/userposts'),
    },
    {
      icon: User,
      label: 'Account',
      color: '#10b981',
      action: () => navigate('/accountpage'),
    },
    {
      icon: HelpCircle,
      label: 'Help & FAQ',
      color: '#f59e0b',
      action: () => navigate('/contactdashboard/DashBoardFAQ'),
    },
  ]
  const [applications, setApplications] = useState(0)
  const [applicationsPending, setApplicationsPending] = useState(0)
  const [applicationsAccepted, setApplicationsAccepted] = useState(0)

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

        setApplications(applicationsData.length)
        setApplicationsPending(
          applicationsData.filter((app) => app.application_status === 'pending')
            .length
        )
        setApplicationsAccepted(
          applicationsData.filter(
            (app) => app.application_status === 'accepted'
          ).length
        )
      } catch (error) {
        console.error('Error fetching applications:', error)
      }
    }

    if (userData?.user_id) {
      fetchStudentApplications()
    }
  }, [userData])

  const stats = [
    { label: 'Applications', value: applications, color: '#3b82f6' },
    { label: 'Accepted', value: applicationsAccepted, color: '#10b981' },
    { label: 'Pending', value: applicationsPending, color: '#f59e0b' },
  ]

  const handleLogout = () => {
    authUtils.logout()
    navigate('/')
  }

  // Enhanced filter function for job posts
  const isJobPostVisible = (jobPost) => {
    // Search term filter
    const matchesSearchTerm =
      jobPost.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobPost.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobPost.posterUsername.toLowerCase().includes(searchTerm.toLowerCase())

    // Job type filter
    const matchesJobType =
      selectedJobTypes.length === 0 ||
      selectedJobTypes.some((type) =>
        jobPost.jobTypes.some(
          (jobType) => jobType.toLowerCase() === type.toLowerCase()
        )
      )

    // Industry filter
    const matchesIndustry =
      selectedIndustries.length === 0 ||
      selectedIndustries.some((industry) =>
        jobPost.industries.some(
          (jobIndustry) => jobIndustry.toLowerCase() === industry.toLowerCase()
        )
      )

    // Location filter - check if job has any of the selected location types
    const matchesLocation =
      selectedLocations.length === 0 ||
      selectedLocations.some((location) =>
        jobPost.locations.some(
          (jobLocation) => jobLocation.toLowerCase() === location.toLowerCase()
        )
      )

    return (
      matchesSearchTerm && matchesJobType && matchesIndustry && matchesLocation
    )
  }

  // Filter handlers
  const handleJobTypeChange = (jobType) => {
    setSelectedJobTypes((prev) =>
      prev.includes(jobType)
        ? prev.filter((type) => type !== jobType)
        : [...prev, jobType]
    )
  }

  const handleIndustryChange = (industry) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((ind) => ind !== industry)
        : [...prev, industry]
    )
  }

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    )
  }

  const clearAllFilters = () => {
    setSelectedJobTypes([])
    setSelectedIndustries([])
    setSelectedLocations([])
    setSearchTerm('')
  }

  // Add this state
  const [showAiResults, setShowAiResults] = useState(false)
  const [aiFilteredJobs, setAiFilteredJobs] = useState([])
  const [isLoadingAi, setIsLoadingAi] = useState(false)

  // Add this function
  const handleAiFilter = async () => {
    setIsLoadingAi(true)
    try {
      // Get current user's skills, projects, achievements, and history
      const [skillsRes, projectsRes, achievementsRes, historyRes] = await Promise.all([
        authUtils.authenticatedRequest(`http://localhost:4000/user_skills?user_id=${userData.user_id}`),
        authUtils.authenticatedRequest(`http://localhost:4000/user_projects?user_id=${userData.user_id}`),
        authUtils.authenticatedRequest(`http://localhost:4000/user_achievements?user_id=${userData.user_id}`),
        authUtils.authenticatedRequest(`http://localhost:4000/user_history?user_id=${userData.user_id}`)
      ])

      const userProfile = {
        ...userData,
        skills: skillsRes || [],
        projects: projectsRes || [],
        achievements: achievementsRes || [],
        history: historyRes || []
      }

      const aiRecommendations = await applyAiFilter(jobPosts, [userProfile])
      
      // Parse AI response to extract recommended job IDs or titles
      const recommendedJobs = jobPosts.filter(job => 
        aiRecommendations.toLowerCase().includes(job.jobTitle.toLowerCase()) ||
        aiRecommendations.toLowerCase().includes(job.posterUsername.toLowerCase())
      )
      
      setAiFilteredJobs(recommendedJobs)
      setShowAiResults(true)
    } catch (error) {
      console.error('AI filtering error:', error)
      alert('Failed to get AI recommendations. Please try again.')
    } finally {
      setIsLoadingAi(false)
    }
  }

  // Get filtered job posts
  const filteredJobPosts = showAiResults ? aiFilteredJobs : jobPosts.filter(isJobPostVisible)

  // Overlay panel handlers
  const handleAvatarHover = (event, job) => {
    const overlayPanel = overlayPanelsRef.current[job.job_id]
    if (overlayPanel) {
      setHoveredJobId(job.job_id)
      setIsHovering(true)
      overlayPanel.show(event, event.currentTarget)
    }
  }

  const handleAvatarLeave = (jobId) => {
    setTimeout(() => {
      if (!isHovering) {
        const overlayPanel = overlayPanelsRef.current[jobId]
        if (overlayPanel) {
          overlayPanel.hide()
        }
        setHoveredJobId(null)
      }
    }, 100)
  }

  const handleOverlayEnter = () => {
    setIsHovering(true)
  }

  const handleOverlayLeave = (jobId) => {
    setIsHovering(false)
    const overlayPanel = overlayPanelsRef.current[jobId]
    if (overlayPanel) {
      overlayPanel.hide()
    }
    setHoveredJobId(null)
  }

  const handleAvatarClick = (job) => {
    // Navigate to user profile or handle click action
    console.log('Avatar clicked for user:', job.posterUsername)
    navigate(`/accountpage`, { state: { userid: job.poster_id } })
  }

  // Function to get job count for specific poster
  const getJobCountForPoster = (posterUsername) => {
    return jobPosts.filter((job) => job.posterUsername === posterUsername)
      .length
  }

  // Show loading state
  if (loading) {
    return (
      <div className="interior-container">
        <div className="student-dashboard">
          <MenuInterior />
          <div className="dashboard-content-int">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !userData) {
    return (
      <div className="interior-container">
        <div className="student-dashboard">
          <MenuInterior />
          <div className="dashboard-content-int">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleSignUp = (posterUsername, jobTitle, jobId) => {
    try {
      navigate('/apply', {
        state: {
          posterUsername,
          jobTitle,
          jobId,
        },
      })
    } catch (error) {
      console.error('Error navigating to apply page:', error)
      alert(
        'An error occurred while trying to apply for the job. Please try again later.'
      )
    }
  }

  

  return (
    <div className="interior-container">
      <div className="student-dashboard">
        {/* Menu Component */}
        <MenuInterior />
        {userData?.is_admin && <ViewSwitcherSidebar />}
        <div className="dashboard-content-int">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="user-profile-card">
              <Avatar
                image={
                  userData?.profile_img_url ||
                  'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
                }
                className="mr-2"
                size="xlarge"
                shape="circle"
              />
              <h3>{userData?.account_username || 'Loading...'}</h3>
              <span className="school-tag">
                {userData?.school_name || 'Loading...'}
              </span>
              <div className="user-type-badge">
                {userData
                  ? userData.is_admin
                    ? 'Admin'
                    : 'Student'
                  : 'Loading...'}
              </div>
            </div>
            <div className="quick-actions">
              <h4>Quick Actions</h4>
              {quickActions.map((action, index) => {
                const IconComponent = action.icon
                return (
                  <button
                    key={index}
                    className="action-btn"
                    style={{ borderLeft: `4px solid ${action.color}` }}
                    onClick={action.action}
                  >
                    <IconComponent className="action-icon" size={20} />
                    <span className="action-label">{action.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="user-stats">
              <h4>Your Stats</h4>
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-value" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="logout-section">
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <div className="content-header">
              <div className="header-text">
                <h2>
                  {userData && userData.is_admin
                    ? 'Approved Listings'
                    : 'Explore Job Opportunities'}
                </h2>
                <p>
                  {userData && userData.is_admin
                    ? 'Review and manage job listings in the admin panel.'
                    : 'Discover positions that match your skills and interests'}
                </p>
              </div>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button className="search-btn">
                  <Search size={20} />
                </button>
              </div>
            </div>

            <div className="job-listings">
              <div className="results-count">
                Showing {filteredJobPosts.length} of {jobPosts.length} jobs
              </div>

              {filteredJobPosts.map((job) => (
                <div key={job.job_id} className="job-card">
                  <div className="job-header">
                    <div className="employer-info">
                      <div
                        className="avatar-container"
                        onMouseEnter={(e) => handleAvatarHover(e, job)}
                        onMouseLeave={() => handleAvatarLeave(job.job_id)}
                      >
                        <img
                          src={job.posterAvatar}
                          alt="Employer"
                          className="employer-avatar"
                          style={{ cursor: 'pointer' }}
                        />
                        <OverlayPanel
                          ref={(el) => {
                            if (el) {
                              overlayPanelsRef.current[job.job_id] = el
                            }
                          }}
                          showCloseIcon={false}
                          className="avatar-overlay"
                          breakpoints={{ '960px': '75vw', '640px': '100vw' }}
                          onMouseEnter={handleOverlayEnter}
                          onMouseLeave={() => handleOverlayLeave(job.job_id)}
                        >
                          <div className="profile-preview">
                            <div className="preview-header">
                              <Avatar
                                image={job.posterAvatar}
                                shape="circle"
                                size="xlarge"
                              />
                              <div className="preview-info">
                                <h3>{job.posterUsername}</h3>
                                <p>{job.posterSchool}</p>
                                <span className="teacher-badge">Employer</span>
                              </div>
                            </div>
                            <div className="preview-stats">
                              <div className="stat-item">
                                <i className="pi pi-briefcase"></i>
                                <span>
                                  {getJobCountForPoster(job.posterUsername)}{' '}
                                  Jobs Posted
                                </span>
                              </div>
                              <div className="stat-item">
                                <i className="pi pi-users"></i>
                                <span>Active Projects</span>
                              </div>
                            </div>
                            <div className="preview-actions">
                              <Button
                                label="View Profile"
                                icon="pi pi-user"
                                className="p-button-text"
                                onClick={() => handleAvatarClick(job)}
                              />
                            </div>
                          </div>
                        </OverlayPanel>
                      </div>
                      <div>
                        <h4>{job.posterUsername}</h4>
                        <p>{job.posterSchool}</p>
                      </div>
                    </div>
                    <div className="job-type-badges">
                      {job.filters.map((filter, index) => (
                        <span
                          key={index}
                          className={`badge ${filter
                            .toLowerCase()
                            .replace(/\s+/g, '')}`}
                        >
                          {filter}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="job-meta">
                    <span className="job-meta-item">
                      <Building size={14} />
                      Posted {job.date}
                    </span>
                    <span className="job-meta-item">
                      <MapPin size={14} />
                      {job.location}
                    </span>
                  </div>
                  <br />
                  <div className="job-content">
                    <h3>{job.jobTitle}</h3>
                    <p>{job.jobDescription}</p>
                  </div>

                  <div className="job-actions">
                    <button
                      className="apply-btn"
                      onClick={() =>
                        handleSignUp(
                          job.posterUsername,
                          job.jobTitle,
                          job.job_id
                        )
                      }
                    >
                      <Check size={16} />
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}

              {filteredJobPosts.length === 0 && jobPosts.length > 0 && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p>
                    No jobs match your current filters. Try adjusting your
                    search criteria.
                  </p>
                </div>
              )}

              {jobPosts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p>No job postings available at the moment.</p>
                </div>
              )}
            </div>
          </main>

          {/* Filter Sidebar */}
          <aside className="filter-sidebar">
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="clear-filters" onClick={clearAllFilters}>
                Clear All
              </button>
            </div>

            <div className="filter-section">
              <h4>Job Type</h4>
              <div className="filter-options">
                {[
                  'Full-time',
                  'Part-time',
                  'Internship',
                  'Contract',
                  'Freelance',
                  'Temporary',
                  'Volunteer',
                  'Seasonal',
                  'Apprenticeship',
                ].map((type) => (
                  <label key={type} className="filter-option">
                    <input
                      type="checkbox"
                      checked={selectedJobTypes.includes(type)}
                      onChange={() => handleJobTypeChange(type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Industry</h4>
              <div className="filter-options">
                {[
                  'Technology',
                  'Finance',
                  'Healthcare',
                  'Education',
                  'Marketing',
                  'Retail',
                  'Construction',
                  'Government',
                  'Hospitality',
                  'Customer Service',
                  'Human Resources',
                  'Engineering',
                  'Legal',
                  'Nonprofit',
                  'Other',
                ].map((industry) => (
                  <label key={industry} className="filter-option">
                    <input
                      type="checkbox"
                      checked={selectedIndustries.includes(industry)}
                      onChange={() => handleIndustryChange(industry)}
                    />
                    <span>{industry}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Location</h4>
              <div className="filter-options">
                {['Remote', 'On-site', 'Hybrid'].map((location) => (
                  <label key={location} className="filter-option">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => handleLocationChange(location)}
                    />
                    <span>{location}</span>
                  </label>
                ))}
              </div>
            </div>
            <button 
              className="ai-filter-btn" 
              onClick={handleAiFilter}
              disabled={isLoadingAi}
            >
              <Bot size={20} />
              {isLoadingAi ? 'Getting Recommendations...' : 'AI-Powered Recommendations'}
            </button>

            {showAiResults && (
              <div className="ai-results-header">
                <p>Showing AI recommendations</p>
                <button 
                  className="clear-ai-btn" 
                  onClick={() => {
                    setShowAiResults(false)
                    setAiFilteredJobs([])
                  }}
                >
                  Show All Jobs
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
