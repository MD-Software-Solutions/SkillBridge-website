import './index.scss';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import React, { useRef, useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import MenuInterior from '../MenuInterior';
import { Link, useNavigate } from 'react-router-dom';
import JobPost from './JobPost';
import AddPostBar from './AddPostBar';
import { authUtils } from '../../utils/auth';
import { applyAiFilter } from './applyAiFilter';
import { Dialog } from 'primereact/dialog';

export default function Interior() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    // const [shuffledPosts, setShuffledPosts] = useState([]);


    // Get user data on component mount
    useEffect(() => {
        const user_info_getter = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const username = user?.username;

                if (!username) {
                    setError('No user information found');
                    navigate('/sign-in');
                    return;
                }

                const result = await authUtils.getUserInfo(username);
                
                if (result.success) {
                    setUserData(result.data);
                } else {
                    if (result.error.includes('Authentication failed')) {
                        navigate('/sign-in');
                    }
                }
            } catch (error) {
                if (error.message.includes('Authentication failed')) {
                    navigate('/sign-in');
                }
            }
        };
        user_info_getter();
    }, []);

    // State management for job posts
    const [jobPosts, setJobPosts] = useState([]);
    const addJobPost = (newJobPost) => {
        setJobPosts([...jobPosts, newJobPost]);
    };

    // Job types and industry options
    const jobTypes = [
        'Full-time', 'Part-time', 'Internship', 'Contract', 
        'Freelance', 'Remote', 'On-site', 'Temporary', 'Volunteer', 'Seasonal', 'Apprenticeship'
    ];

    const industries = [
        'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Retail', 'Construction', 
        'Government', 'Hospitality', 'Customer Service', 'Human Resources', 'Engineering', 'Legal', 'Nonprofit', 'Other'
    ];

    // State management for selected job types, industries, and search term
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedPosterSchools, setSelectedPosterSchools] = useState([]);
    const uniqueSchools = [...new Set(jobPosts.map(post => post.posterSchool))];
    
    // User data state
    // const [userData, setUserData] = useState(null);

    // useEffect(() => {
    //     const user_info_getter = async () => {
    //         setUserData(use[0]);
    //     };
    //     user_info_getter();
    // }, [user]);

    
    // State management for job posts
    const [userList, setUserList] = useState([]);

    // Fetch all users when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await authUtils.authenticatedRequest('http://localhost:4000/users');
                setUserList(response);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUsers();
    }, []);

    // Fetch job postings and map user information to each job post
    useEffect(() => {
        const fetchJobPost = async () => {
            try {
                const response = await authUtils.authenticatedRequest('http://localhost:4000/job_postings');
                
                if (response && Array.isArray(response)) {
                    const formattedJobPosts = response
                        .map((jobData) => {
                            const matchingUser = userList.find((user) => user.user_id === jobData.user_id);

                            return {
                                job_id: jobData.job_id,
                                poster_id: jobData.user_id,
                                posterAvatar: matchingUser?.profile_img_url || 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                                posterUsername: matchingUser?.account_username || 'Unknown',
                                posterSchool: matchingUser?.school_name || 'Unknown School',
                                jobTitle: jobData.job_title || 'Default Job Title',
                                jobDescription: jobData.job_description || 'Default Job Description',
                                filters: jobData.job_type_tag.concat(jobData.industry_tag),
                                googleFormLink: jobData.job_signup_form || '#',
                                userid: matchingUser?.user_id || 'Unknown',
                                isApproved: jobData.isApproved
                            };
                        })
                        .filter((job) => job.isApproved); // Filter only approved job postings

                    console.log("Filtered Jobs:", formattedJobPosts);
                    setJobPosts(formattedJobPosts);
                }
            } catch (error) {
                console.error('Error fetching job postings:', error);
            }
        };

        if (userList.length > 0) {
            fetchJobPost();
        }
    }, [userList]);

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

    const isJobPostVisible = (jobPost) => {
        const matchesSearchTerm = jobPost.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesJobType = selectedJobTypes.length === 0 || selectedJobTypes.some(type => jobPost.filters.includes(type));
        const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.some(industry => jobPost.filters.includes(industry));
        const matchesPosterSchool = selectedPosterSchools.length === 0 || selectedPosterSchools.includes(jobPost.posterSchool);
    
        return matchesSearchTerm && matchesJobType && matchesIndustry && matchesPosterSchool;
    };

    const [visible, setVisible] = useState(false);
    const [aiResponse, setAiResponse] = useState("");

    const handleAiFilter = async () => {
        try {
            const filteredResults = await applyAiFilter(jobPosts, userData);
            console.log("AI Filtered Results:", filteredResults);
            setAiResponse(filteredResults);


        } catch (error) {
            console.error("Error applying AI filter:", error);
        }
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
                                <h3 style={{fontSize: '1.8vh', fontWeight:"unset"}}>{userData.school_name} </h3>
                            </div>
                        </div>
                    )}
                    <Divider />
                    <div className='interior-userFunction-wrapper'>
                        <Button 
                            icon="pi pi-briefcase" 
                            rounded 
                            severity="secondary" 
                            aria-label="Posts" 
                            onClick={() => navigate('/userposts')}
                            tooltip="View Posts"
                            tooltipOptions={{ position: 'bottom', showDelay: 100 }}
                        />
                        <Button 
                            icon="pi pi-user" 
                            rounded 
                            severity="info" 
                            aria-label="User" 
                            onClick={() => navigate('/accountpage')}
                            tooltip="Account Settings"
                            tooltipOptions={{ position: 'bottom', showDelay: 100 }}
                        />
                        <Button 
                            icon="pi pi-info" 
                            rounded 
                            severity="warning" 
                            aria-label="Info" 
                            onClick={() => navigate('/contactdashboard/DashBoardFAQ')}
                            tooltip="Help & FAQ"
                            tooltipOptions={{ position: 'bottom', showDelay: 100 }}
                        />
                    </div>
                    
                    <Divider />
                    <div className='txt-center'>
                        <h2 className='font-3vh'>
                        {userData 
                            ? (userData.is_admin 
                                ? 'Admin' 
                                : userData.is_teacher 
                                    ? 'Teacher' 
                                    : 'Student') 
                            : 'Loading...'}
                        </h2>

                        <p className='font-1vh'>
                            {userData && (
                                userData.is_admin ? (
                                    'As an administrator, you have access to manage users, approve job postings, and maintain the platform. Use the admin dashboard to oversee all platform activities.'
                                ) : userData.is_teacher ? (
                                    userData.bio 
                                        ? userData.bio.split(' ').slice(0, 50).join(' ') + (userData.bio.split(' ').length > 50 ? '...' : '') 
                                        : 'Share your professional experience and expertise here. Add your bio to help students understand your background and the opportunities you offer.'
                                ) : (
                                    userData.bio 
                                        ? userData.bio.split(' ').slice(0, 50).join(' ') + (userData.bio.split(' ').length > 50 ? '...' : '') 
                                        : 'To modify your bio, please visit the account page and make the necessary updates.'
                                )
                            )}
                            
                        </p>
                    </div>
                    <Divider className='color-divider' />
                    <div className='logOut-Btn-wrapper'>
                        <Button 
                            className='logOut-Btn' 
                            label="Log Out" 
                            severity="danger" 
                            onClick={() => {
                                authUtils.logout();
                                navigate('/');
                            }}
                        />
                    </div>
                </div>

                <div className='interior-post-column'>
                    <div>
                        <div className='topSection-info-wrap'>
                            {userData && (
                                userData.is_admin ? (
                                    <h1>Approved Listings</h1>
                                ) : userData.is_teacher ? (
                                    <h1>All Listings</h1>
                                ) : (
                                    <h1>Explore Job Opportunities</h1>
                                )
                            )}
                            
                            
                            {userData && (
                                userData.is_admin ? (
                                    <h3>Review and manage job listings in the admin panel.</h3>
                                ) : userData.is_teacher ? (
                                    <h3>Your listings will pop up here when an admin has approved them.</h3>
                                ) : (
                                    <h3>Tip: Remember, you can filter job listings based on your skills, interests, and availability.</h3>
                                )
                            )}
                            
                            
                            <h1></h1>
                        </div>
                        {userData && userData.is_teacher === 1 && (
                            <AddPostBar addJobPost={addJobPost} />
                        )}
                    </div>
                    <div className='post-section-overflow'>
                        {jobPosts
                            .filter(isJobPostVisible)
                            .sort((a, b) => {
                                // If user is a teacher, sort their posts first
                                if (userData?.is_teacher) {
                                    if (a.posterUsername === userData.account_username) return -1;
                                    if (b.posterUsername === userData.account_username) return 1;
                                }
                                return 0;
                            })
                            .map((job, index) => (
                                <JobPost
                                    key={index}
                                    posterId={job.poster_id}
                                    posterAvatar={job.posterAvatar}
                                    posterUsername={job.posterUsername}
                                    posterSchool={job.posterSchool}
                                    jobTitle={job.jobTitle}
                                    jobDescription={job.jobDescription}
                                    filters={job.filters}
                                    googleFormLink={job.googleFormLink}
                                    userid={job.userid}
                                    jobId={job.job_id}
                                    showDelete={false}
                                    isTeacher={userData.is_teacher}
                                />
                            ))
                        }
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
                        <Divider className='color-divider' />
                        <div className="dropdown-tag-container">
                            <h3>Select School/Company</h3>
                            <Dropdown 
                                value={null} 
                                options={uniqueSchools} 
                                onChange={(e) => {
                                    if (!selectedPosterSchools.includes(e.value)) {
                                        setSelectedPosterSchools(prev => [...prev, e.value]);
                                    }
                                }} 
                                placeholder="Select a school" 
                                className="poster-school-dropdown" 
                            />
                            <div className="selected-tags">
                                {selectedPosterSchools.map((school, index) => (
                                    <Tag 
                                        key={index} 
                                        value={school} 
                                        onClick={() => setSelectedPosterSchools(prev => prev.filter(s => s !== school))}
                                        className="selected-tag" 
                                    />
                                ))}
                            </div>
                        </div>
                        <Divider className='color-divider' />
                        <Button label="AI-Powered Filter" icon="pi pi-filter" severity="info" onClick={() => {setVisible(true);handleAiFilter();}}/>
                        <Dialog header="AI Suggestion" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                            <Divider />
                            <p className="m-0">
                                {aiResponse}
                            </p>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>    
    );
}