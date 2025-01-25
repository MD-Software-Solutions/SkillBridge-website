import './index.scss';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import React, { useState, useEffect, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import MenuInterior from '../MenuInterior';
import { Link, useNavigate } from 'react-router-dom';
import JobPost from './JobPost';
import AddPostBar from './AddPostBar';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../../context/AuthContext';

/**
 * The `Interior` component serves as the main layout for job listings and user profile details.
 */

export default function Interior() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    // State management for job posts
    const [jobPosts, setJobPosts] = useState([]);
    const addJobPost = (newJobPost) => {
        setJobPosts([...jobPosts, newJobPost]);
    };


    // Handle deletion of job posts
    const handleDeleteJob = (index) => {
        setJobPosts(prevJobPosts => prevJobPosts.filter((_, i) => i !== index));
    };

    // Job types and industry options
    const jobTypes = [
        'Full-time', 'Part-time', 'Internship', 'Contract', 
        'Freelance', 'Remote', 'On-site', 'Temporary', 'Volunteer'
    ];

    const industries = [
        'Technology', 'Finance', 'Healthcare', 'Education', 
        'Marketing', 'Retail', 'Construction', 'Government', 'Hospitality'
    ];

    // State management for selected job types, industries, and search term
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // User data state
    const [userData, setUserData] = useState(null);

    // Load user data when the component mounts
    useEffect(() => {
        const fetchFirstUserAccount = async () => {
            try {
                const response = await fetch('https://skillbridge-fbla-server.onrender.com/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data.');
                }

                const users = await response.json();
                if (users.length > 0) {
                    const firstUser = users[2]; // Get the first user from the list
                    console.log('First user:', firstUser);

                    setUserData(firstUser); // Set the fetched user data
                } else {
                    console.error('No users found in the database.');
                    navigate('/signin'); // Redirect to login if no users are found
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchFirstUserAccount(); // Call the function to fetch the first user account
    }, [navigate]);

    const [jobData, setJobData] = useState(null);
    
    useEffect(() => {
        const fetchJobPost = async () => {
            try {
                const response = await fetch('https://skillbridge-fbla-server.onrender.com/job_postings');
                if (!response.ok) {
                    throw new Error('Failed to fetch job postings.');
                }
    
                const jobDataArray = await response.json();
                console.log('Fetched job postings:', jobDataArray);
    
                // Ensure job_type_tag and industry_tag are valid for each job posting
                const formattedJobPosts = jobDataArray.map((jobData) => {

                    const filters = jobData.job_type_tag.concat(jobData.industry_tag);

                    return {
                        posterAvatar: jobData.user_avatar || 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                        posterUsername: userData?.account_username || 'Unknown',
                        posterSchool: userData?.school_name || 'Unknown School',
                        jobTitle: jobData.job_title || 'Default Job Title',
                        jobDescription: jobData.job_description || 'Default Job Description',
                        filters: filters,
                        googleFormLink: jobData.job_signup_form || '#',
                    };
                });
    
                // Update state with formatted job posts
                setJobPosts(formattedJobPosts);
            } catch (error) {
                console.error('Error fetching job postings:', error);
            }
        };
    
        fetchJobPost();
    }, [userData]);
    
    

    // Handle selection changes for job types
    const onJobTypeChange = (e) => {
        const value = e.value;
        if (!selectedJobTypes.includes(value)) {
            setSelectedJobTypes(prevSelectedJobTypes => [...prevSelectedJobTypes, value]);
        }
    };

    // Handle selection changes for industries
    const onIndustryChange = (e) => {
        const value = e.value;
        if (!selectedIndustries.includes(value)) {
            setSelectedIndustries(prevSelectedIndustries => [...prevSelectedIndustries, value]);
        }
    };

    // Remove selected job type tag
    const removeJobTypeTag = (tag) => {
        setSelectedJobTypes(prevSelectedJobTypes => prevSelectedJobTypes.filter(item => item !== tag));
    };

    // Remove selected industry tag
    const removeIndustryTag = (tag) => {
        setSelectedIndustries(prevSelectedIndustries => prevSelectedIndustries.filter(item => item !== tag));
    };

    // Handle changes in search term
    const onSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Function to check if a job post matches the current filters
    const isJobPostVisible = (jobPost) => {
        const matchesSearchTerm = jobPost.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesJobType = selectedJobTypes.length === 0 || selectedJobTypes.some(type => jobPost.filters.includes(type));
        const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.some(industry => jobPost.filters.includes(industry));

        return matchesSearchTerm && matchesJobType && matchesIndustry;
    };


    /**
     * Returns the JSX for rendering the `Interior` component, which includes the main 
     * structure with nested columns for user profile, job posts, and filter options. 
     * The user profile section displays the user's avatar, name, school, and function buttons. 
     * The job post column showcases job opportunities and a section to add new posts. 
     * The filter column allows users to filter job listings by job types and industries.
     */

    return (
        <div className='window-sizer'>
            <MenuInterior />
            <div className='interior-wrapper-grid'>
                <div className='interior-userProfile-column'>
                    {userData && (
                        <div className='userInfo-row-wrapper'>
                            <div className="flex-auto">
                                <Avatar 
                                    image={userData.profile_img_url || 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'} 
                                    className="mr-2" 
                                    size="xlarge" 
                                    shape="circle" 
                                />
                            </div>
                            <div>
                                <h1>{userData.account_username}</h1>
                                <h3 style={{fontSize: '1.8vh'}}>{userData.school_name}</h3>
                            </div>
                        </div>
                    )}
                    <Divider />
                    <div className='interior-userFunction-wrapper'>
                        <Button icon="pi pi-cog" rounded severity="secondary" aria-label="Setting" />
                        <Button icon="pi pi-user" rounded severity="info" aria-label="User" onClick={() => navigate('/accountpage')} />
                        <Button icon="pi pi-info" rounded severity="warning" aria-label="Info" onClick={() => navigate('/contactdashboard/DashBoardFAQ')} />
                    </div>
                    <Divider />
                    <div className='txt-center'>
                        <h2 className='font-3vh'>{userData ? 'Student' : 'Loading...'}</h2>
                        <p className='font-1vh'>
                            {userData && userData.bio_text ? userData.bio_text : 'Lorem ipsum odor amet, consectetuer adipiscing elit. Aliquam vestibulum ipsum iaculis aliquet fusce velit primis nec leo. Magnis magna curae maecenas tincidunt hendrerit hac. Vitae senectus torquent tristique convallis aenean mauris. '}
                        </p>
                    </div>
                    <Divider className='color-divider' />
                    <div className='logOut-Btn-wrapper'>
                        
                        <Button 
                            className='logOut-Btn' 
                            label="Log Out" 
                            severity="danger" 
                            onClick={() => {
                                logout();
                                navigate('/')
                            }}
                        />
                        
                    </div>
                </div>

                <div className='interior-post-column'>
                    <div>
                        <div className='topSection-info-wrap'>
                            <h1>Explore Job Opportunities</h1>
                            <h3>Tip: Remember, you can filter job listings based on your skills, interests, and availability.</h3>
                        </div>
                        {/* Conditionally render AddPostBar for teacher accounts only */}
                        {userData && userData.is_teacher === 1 && (
                            <AddPostBar addJobPost={addJobPost} />
                        )}
                    </div>
                    <div className='post-section-overflow'>
                        {jobPosts.filter(isJobPostVisible).map((job, index) => (
                            <JobPost
                                key={index}
                                posterAvatar={job.posterAvatar}
                                posterUsername={job.posterUsername}
                                posterSchool={job.posterSchool}
                                jobTitle={job.jobTitle}
                                jobDescription={job.jobDescription}
                                filters={job.filters}
                                googleFormLink={job.googleFormLink}
                                onDelete={() => handleDeleteJob(index)}
                            />
                        ))}
                    </div>
                </div>

                <div className='interior-filter-column'>
                    <div className='filter-title'>
                        <h1 className='text-center'>Filter</h1>
                        <div>
                            <InputText 
                                value={searchTerm} 
                                onChange={onSearchChange} 
                                placeholder="Search by job title" 
                                className="search-input w-100" 
                            />
                        </div>
                        <Divider className='color-divider' />
                        <div className="dropdown-tag-container">
                            <h3>Select Job Types</h3>
                            <Dropdown 
                                value={null} 
                                options={jobTypes} 
                                onChange={onJobTypeChange} 
                                placeholder="Select a job type" 
                                className="job-type-dropdown" 
                            />
                            <div className="selected-tags">
                                {selectedJobTypes.map((tag, index) => (
                                    <Tag 
                                        key={index} 
                                        value={tag} 
                                        onClick={() => removeJobTypeTag(tag)} 
                                        className="selected-tag" 
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="dropdown-tag-container">
                            <h3>Select Industry</h3>
                            <Dropdown 
                                value={null} 
                                options={industries} 
                                onChange={onIndustryChange} 
                                placeholder="Select an industry" 
                                className="industry-dropdown" 
                            />
                            <div className="selected-tags">
                                {selectedIndustries.map((tag, index) => (
                                    <Tag 
                                        key={index} 
                                        value={tag} 
                                        onClick={() => removeIndustryTag(tag)} 
                                        className="selected-tag" 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
