import './index.scss'
import MenuInterior from '../MenuInterior';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import accBg from '../../assets/img/accBg.png';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from "primereact/inputtextarea";
import HistoryCompnent from './HistoryComp';
import SkillComponent from './SkillComp';
import ProjectComponent from './ProjectComp';
import AchieveComponent from './AchieveComp';
import { Link, useAsyncError, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { authUtils } from '../../utils/auth';
import { OverlayPanel } from 'primereact/overlaypanel';
import { getAISuggestedBio } from './openaiBio';

export default function AccountPage () {

    // This block of code instantiates a variety of variables using either useContext or useState to be used later in the component.
    const { user } = useContext(AuthContext);
    const [AvatarVisible, setAvatarVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const location = useLocation();

    const [visible, setVisible] = useState(false);
    const [editDialog, setVisibleEdit] = useState(false);

    const [userBioValue, setUserBioValue] = useState('');
    const [userNameValue, setUserNameValue] = useState('');
    const [userCityValue, setUserCityValue] = useState('');
    const [userStateValue, setUserStateValue] = useState('');
    const [userEmailValue, setUserEmailValue] = useState('');
    

    const [userData, setUserData] = useState(null);
    const [workHistory, setWorkHistory] = useState([]);
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [achievements, setAchievements] = useState([]);

    const refreshUserData = async () => {
        try {
            // Check if we're viewing another user's profile or our own
            const targetUserId = location.state?.userid || authUtils.getStoredUserData().user_id;
            
            // Get fresh user data
            const result = await authUtils.getUserById(targetUserId);
            
            if (result.success) {
                setUserData(result.data);
                
                // Also refresh related data
                await fetchHistory(targetUserId);
                await fetchSkills(targetUserId);
                await fetchProjects(targetUserId);
                await fetchAchievements(targetUserId);
                
                console.log('User data refreshed successfully');
            } else {
                console.error("Failed to refresh user data:", result.error);
            }
        } catch (error) {
            console.error("Error refreshing user data:", error);
        }
    };
    

    const initializeUserData = async () => {
        try {
            // Check if userId is passed in the location state
            if (location.state?.userid) {
                console.log(`Fetching user data for ID: ${location.state.userid}`);
                setSelectedUserId(location.state.userid);

                // Replace the direct fetch with the new authUtils method
                const result = await authUtils.getUserById(location.state.userid);
                
                if (result.success) {
                    setUserData(result.data);
                } else {
                    console.error("Failed to fetch user data:", result.error);
                }
            } else {
                // If no userid in location state, use stored user data
                setUserData(authUtils.getStoredUserData());
                setSelectedUserId(authUtils.getStoredUserData().user_id);
            }
        } catch (error) {
            console.error("Error initializing user data:", error);
        }
    };

    // This block of code fetches the user data from the server and sets the userData state variable to the user data.
    useEffect(() => {
        initializeUserData();
    }, [location.state?.userid]);
    
    // Fetch data whenever selectedUserId changes
    useEffect(() => {

        // This block of code fetches the user's history, skills, projects, and achievements from the server and sets the respective state variables to the data.
        const fetchData = async (userId) => {
            try {

                await fetchHistory(userId);
                await fetchSkills(userId);
                await fetchProjects(userId);
                await fetchAchievements(userId);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (selectedUserId) {
            fetchData(selectedUserId);
        }
    }, [selectedUserId]);

    // This block of code fetches the user's work history from the server and sets the workHistory state variable to the data.
    const fetchHistory = async (userId) => {

        // This block of code fetches the user's work history from the server and sets the workHistory state variable to the data.
        try {
            const response = await fetch(
                "http://localhost:4000/user_history"
            );
            console.log(response)
            if (!response.ok) {
                throw new Error("Failed to fetch user data.");
            }

            const historyDataArray = await response.json();
            const userHistoryData = historyDataArray.filter(
                (historyData) => historyData.user_id === userId
            );

            const workHistory = userHistoryData.map((historyData) => ({
                id: historyData.id,
                company: historyData?.company_name || "",
                role: historyData?.role || "",
                duration: historyData?.duration || "",
                description: historyData?.description || "",
            }));

            setWorkHistory(workHistory);
        } catch (error) {
            console.error(error);
        }
    };

    // This block of code fetches the user's skills from the server and sets the skills state variable to the data.
    const fetchSkills = async (userId) => {
        try {
            const response = await fetch(
                "http://localhost:4000/user_skills"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch user data.");
            }

            const skillsDataArray = await response.json();
            const userSkillsData = skillsDataArray.filter(
                (skillData) => skillData.user_id === userId
            );

            // This block of code formats the skills data and sets the skills state variable to the formatted data.
            const formattedSkills = userSkillsData.map((skillData) => ({
                id: skillData.user_id,
                name: skillData?.skill_name || "",
                description: skillData?.skill_description || "",
            }));

            setSkills(formattedSkills);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // This block of code fetches the user's projects from the server and sets the projects state variable to the data.
    const fetchProjects = async (userId) => {
        try {
            const response = await fetch(
                "http://localhost:4000/user_projects"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch projects.");
            }

            const projectDataArray = await response.json();
            const userProject = projectDataArray.filter(
                (projectData) => projectData.user_id === userId
            );

            // This block of code formats the projects data and sets the projects state variable to the formatted data.
            const formattedProjects = userProject.map((projectData) => ({
                index: projectData?.user_id || "No ID",
                name: projectData?.project_name || "Unnamed Project",
                description: projectData?.project_description || "No Description",
            }));

            setProjects(formattedProjects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    // This block of code fetches the user's achievements from the server and sets the achievements state variable to the data.
    const fetchAchievements = async (userId) => {

        try {
            const response = await fetch(
                "http://localhost:4000/user_achievements"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch achievements.");
            }

            const achievementsDataArray = await response.json();
            const userAchievements = achievementsDataArray.filter(
                (achievement) => achievement.user_id === userId
            );

            //The variable formattedAchievements is created to store the formatted achievements data.
            const formattedAchievements = userAchievements.map((achievement) => ({
                id: achievement.user_id || "No ID",
                name: achievement?.achievement_name || "Unnamed Achievement",
                description: achievement?.achievement_description || "No Description",
            }));

            setAchievements(formattedAchievements);
        } catch (error) {
            console.error("Error fetching achievements:", error);
        }
    };

    // This block of code creates the header and footer for the avatar changer dialog.
    const avatarChangerHeader = (
        <div className="inline-flex align-items-center justify-content-center gap-2" style={{display:'flex', gap:'20px'}}>
            <Avatar image={userData?.profile_img_url || 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'} shape="circle" />
            <span className="font-bold white-space-nowrap">{userData ? userData.account_username : 'Loading...'}</span>
        </div>
    );

    const avatarChangerFooter = (
        <div style={{marginTop:'20px'}}>
        </div>
    );

    const handleAvatarChange = (url) => {
        setUserData((prev) => ({ ...prev, profile_img_url: url }));
        setAvatarVisible(false);
    };

    // This block of code saves the user's information to the server.
    const saveUserInfo = async () => {
        const updatedUserInfo = {
            real_name: userData.real_name,
            personal_email: userEmailValue || userData.personal_email,
            phone_number: userData.phone_number,
            birth_date: userData.birth_date ? new Date(userData.birth_date).toISOString().split('T')[0] : null,
            school_name: userData.school_name,
            school_district: userData.school_district,
            school_email: userData.school_email,
            account_username: userNameValue || userData.account_username,
            is_teacher: userData.is_teacher,
            city: userCityValue || userData.city,
            state: userStateValue || userData.state,
            bio: userBioValue || userData.bio,
            profile_img_url: userData.profile_img_url,
        };
        
        // This block of code sends a PUT request to the server to update the user's information.
        try {
            console.log('Updating user information:', updatedUserInfo);
            const response = await fetch(`http://localhost:4000/users/${userData.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserInfo),
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log('User information updated successfully:', result);
                await refreshUserData();
            } else {
                console.error('Failed to update user information:', response.status, response.statusText, response);
            }
        } catch (error) {
            console.error('Error occurred while updating user information:', error);
        }
    };
    
    // This block of code returns the JSX for the AccountPage component.
    return (
        <div>
            <MenuInterior />
            <div className='accountPage-wrapper-primary'>
                <div className='accPage-content-wrap'>
                    <div className='userInfo-row-wrap'>
                        <div className='profile-bg-wrap'>
                            <img className='bg-img' src={accBg} />  
                        </div>
                        <Divider  align="left">
                            <Avatar image={userData?.profile_img_url || 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'} className="mr-2 userAvatar-Obj" size="xlarge" shape="circle" />
                        </Divider>
                        <div className='topRow-user-info'>
                            <h1>{userData ? userData.account_username : 'Loading...'}</h1>
                            {!location.state?.userid && (
                                <Button icon="pi pi-pencil" rounded severity="info" aria-label="User" onClick={() => setVisibleEdit(true)} />
                            )}

                            {/* This block of code creates the edit dialog for the user's information. */}
                            <Dialog maximizable className='dialog-media-screen' header="Edit Page" visible={editDialog} style={{ width: '50vw' }} onHide={() => {if (!editDialog) return; setVisibleEdit(false); }}>
                                    <p className="m-0">
                                        <Divider />
                                        <div className='edit-content-wrapper'>
                                            <div className="avatar-edit-wrap" style={{ textAlign: "center" }}>
                                                <Avatar image={userData?.profile_img_url || 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'} className="mr-2 avatar-edit-size" size="xlarge" shape="circle" style={{ marginBottom: "10px" }} />
                                                <Button icon="pi pi-user-edit" rounded severity="info" onClick={() => setAvatarVisible(true)} />
                                                <Dialog visible={AvatarVisible} modal header={avatarChangerHeader} footer={avatarChangerFooter} style={{ width: '50rem' }} onHide={() => {if (!AvatarVisible) return; setAvatarVisible(false); }}>
                                                    <h1 className='text-center'>User Avatar Selection</h1>
                                                    <div className='avatar-editor-wrapper'>
                                                        <Button >
                                                            <img alt="logo" src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" className="h-2rem" onClick={() => handleAvatarChange("https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png")}></img>
                                                        </Button>
                                                        <Button >
                                                            <img alt="logo" src="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png" className="h-2rem" onClick={() => handleAvatarChange("https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png")}></img>
                                                        </Button>
                                                        <Button >
                                                            <img alt="logo" src='https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png' className="h-2rem" onClick={() => handleAvatarChange('https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png')}></img>
                                                        </Button>
                                                        <Button >
                                                            <img alt="logo" src='https://primefaces.org/cdn/primereact/images/avatar/annafali.png' className="h-2rem" onClick={() => handleAvatarChange('https://primefaces.org/cdn/primereact/images/avatar/annafali.png')}></img>
                                                        </Button>
                                                        <Button >
                                                            <img alt="logo" src='https://primefaces.org/cdn/primereact/images/avatar/xuxuefeng.png' className="h-2rem" onClick={() => handleAvatarChange('https://primefaces.org/cdn/primereact/images/avatar/xuxuefeng.png')}></img>
                                                        </Button>
                                                        <Button >
                                                            <img alt="logo" src='https://primefaces.org/cdn/primereact/images/organization/walter.jpg' className="h-2rem" onClick={() => handleAvatarChange('https://primefaces.org/cdn/primereact/images/organization/walter.jpg')}></img>
                                                        </Button>
                                                        <Button >
                                                            <img alt="logo" src='https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png' className="h-2rem" onClick={() => handleAvatarChange('https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png')}></img>
                                                        </Button>
                                                    </div>
                                                </Dialog>
                                            </div>

                                            {/*  This block of code creates the user information form for the user's information.  */}
                                            <div className='userInfo-edit-wrapper'>
                                                <h1>User Info</h1>
                                                <div className="p-inputgroup flex-1">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-user"></i>
                                                    </span>
                                                    <InputText placeholder={userData?.account_username || 'username'}  value={userNameValue} onChange={(e) => setUserNameValue(e.target.value)}/>
                                                </div>
                                                <div className='grid-2'>
                                                    <div className="p-inputgroup flex-1">
                                                        <span className="p-inputgroup-addon">
                                                            <i className="pi pi-building"></i>
                                                        </span>
                                                        <InputText placeholder={userData?.city || 'City'}  value={userCityValue} onChange={(e) => setUserCityValue(e.target.value)}/>
                                                    </div>
                                                    <div className="p-inputgroup flex-1">
                                                        <span className="p-inputgroup-addon">
                                                            <i className="pi pi-building-columns"></i>
                                                        </span>
                                                        <InputText placeholder={userData?.state || 'State'} value={userStateValue} onChange={(e) => setUserStateValue(e.target.value)}/>
                                                    </div>             
                                                </div>
                                                <div className="p-inputgroup flex-1">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-envelope"></i>
                                                    </span>
                                                    <InputText placeholder={userData?.personal_email || 'Personal Email'} value={userEmailValue} onChange={(e) => setUserEmailValue(e.target.value)}/>
                                                </div>
                                            </div>
                                            <Divider />
                                            <div className="bio-edit-wrapper">
                                                <div className="bio-header-wrapper">
                                                    <h1>Bio</h1>
                                                    <Button label="AI Suggestion" severity="info" icon="pi pi-pencil" onClick={(e) => {op.current.toggle(e);setAISuggestion(userBioValue); }} className="p-button-text"/>

                                                    <OverlayPanel ref={op} style={{ width: '40%', height: 'fit-content' }}>
                                                        <div className="ai-BioSuggestion-wrapper">
                                                            <InputTextarea placeholder="Edit your bio..." className="textArea" autoResize rows={5} cols={30}value={aiSuggestion} onChange={(e) => setAISuggestion(e.target.value)}/>
                                                            <Button label={loading ? "Generating..." : "Generate Bio"} className="p-button-sm  mt-2" severity="info" onClick={handleAISuggestion} disabled={loading}/>
                                                            <Button label="Use this Bio" className="p-button-sm p-button-primary mt-2 ml-2" onClick={() => setUserBioValue(aiSuggestion)}/>
                                                        </div>
                                                    </OverlayPanel>
                                                </div>
                                                <div>
                                                    <InputTextarea placeholder="Enter your bio..." className="textArea" autoResize rows={5} cols={30} value={userBioValue} onChange={(e) => setUserBioValue(e.target.value)}/>
                                                </div>
                                            </div>
                                            <Divider />
                                            <div className='history-edit-wrapper'>
                                                <HistoryCompnent />
                                            </div>
                                            <Divider />
                                            <div className='Skill-edit-wrapper'>
                                                <SkillComponent />
                                            </div>
                                            <Divider />
                                            <div className='project-edit-wrapper'>
                                                <ProjectComponent />
                                            </div>
                                            <Divider />
                                            <div className='achievement-edit-wrapper'>
                                                <AchieveComponent />
                                            </div>
                                            <div className='edit-submit-wrapper'>
                                                <Button severity="info" label="Save" icon="pi pi-check" onClick={() => saveUserInfo()}/>
                                            </div>          
                                        </div>
                                    </p>
                            </Dialog>
                        </div>
                        <div className='schoolInfo-wrap'>
                            <h2>{userData ? (userData.is_teacher ? 'Teacher' : 'Student') : 'Loading...'}</h2>
                        </div>
                        <div className='contact-user-info'>
                            <h2>
                                {userData ? userData.school_name: 'Loading...'} <br /> {userData?.city ?? 'City'}, {userData?.state ?? 'State'}
                            </h2>
                            <div className="card flex justify-content-center">
                                <Button label="Contact" icon="pi pi-external-link" rounded severity="info" onClick={() => setVisible(true)} />
                                <Dialog className='dialog-media-screen' header="Contact" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                                    <p className="m-0">
                                        Email: {userData? userData.personal_email : 'Loading...'}
                                    </p>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                    <div className='acc-bio-wrapper'>
                        <div className='bio-card'>
                            <h1>Bio</h1>
                            <Divider />
                            <p>
                                {userData && userData.bio ? userData.bio : 'Empty bio'}
                            </p>
                        </div>
                        <div className='hist-card'>
                            <h1>History</h1>
                            <Divider />
                            <div className="card" style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ textAlign: 'center' }}>Work History</h2>
                            {workHistory.map((job, index) => (
                                <div key={index} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
                                    <h3 className='h3-card-text'>{job.company}</h3>
                                    <p style={{ margin: '0.3rem 0', fontWeight: 'bold', color: '#555' }}>{job.role}</p>
                                    <p style={{ margin: '0.3rem 0', fontStyle: 'italic', color: '#777' }}>{job.duration}</p>
                                    <p style={{ margin: '0.3rem 0', color: '#666' }}>{job.description}</p>
                                </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    <div className='skill-content-wrapper'>
                        <h1>Skills</h1>
                        <Divider />
                        <div className='skill-info-wrap'>
                            {skills.map((skill, index) => (
                                <div key={index} className='content-card'>
                                    <h3 className='h3-card-text'>{skill.name}</h3>
                                    <p className='p-card-text'>{skill.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='project-content-wrapper'>
                        <h1>Projects</h1>
                        <Divider />
                        <div className='project-info-wrap'>
                            {projects.map((project, index) => (
                                <div key={index} className='content-card'>
                                    <h3 className='h3-card-text'>{project.name}</h3>
                                    <p className='p-card-text'>{project.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='achievement-content-wrapper'>
                        <h1>Achievement</h1>
                        <Divider />
                        <div className='achievement-info-wrap'>
                            {achievements.map((achievement, index) => (
                                <div key={index} className='content-card'>
                                    <h3 className='h3-card-text'>{achievement.name}</h3>
                                    <p className='p-card-text'>{achievement.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}