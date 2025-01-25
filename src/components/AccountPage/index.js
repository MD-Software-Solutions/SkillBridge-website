import './index.scss'
import MenuInterior from '../MenuInterior';
import React, { useState, useEffect, useContext } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
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
import { Link, useAsyncError, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function AccountPage () {
    const { user } = useContext(AuthContext);
    const [AvatarVisible, setAvatarVisible] = useState(false);

    const [userInfo, setUserInfo] = useState([]);
    const [avatar, setAvatar] = useState("https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png");

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
  
        reader.onload = () => {
          setAvatar(reader.result); 
        };
  
        reader.readAsDataURL(file); 
      }
    };

    const [visible, setVisible] = useState(false);
    const [editDialog, setVisibleEdit] = useState(false);

    const [value, setValue] = useState('');

    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setUserData(user[0]);

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [navigate]);

    const workHistory = [
        {
            company: "Lorem Ipsum Corp.",
            role: "Software Engineer",
            duration: "Jan 2020 - Dec 2021",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            company: "Dolor Sit Inc.",
            role: "Frontend Developer",
            duration: "Mar 2018 - Dec 2019",
            description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
            company: "Amet LLC",
            role: "Intern",
            duration: "Jun 2017 - Aug 2017",
            description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        },
    ];

    const skills = [
        {
            name: "Problem Solving",
            description: "Able to analyze complex problems and find effective solutions.",
        },
        {
            name: "Communication",
            description: "Excellent verbal and written communication skills.",
        },
        {
            name: "Team Collaboration",
            description: "Strong ability to work collaboratively with diverse teams.",
        },
        {
            name: "Adaptability",
            description: "Quick to adapt to new environments and challenges.",
        },
    ];

    const projects = [
        {
            name: "E-Commerce Website",
            description: "Developed a full-stack e-commerce platform with React, Node.js, and MongoDB, featuring user authentication and payment integration.",
        },
        {
            name: "Personal Portfolio",
            description: "Designed and implemented a personal portfolio website to showcase projects and skills using HTML, CSS, and JavaScript.",
        },
        {
            name: "Weather App",
            description: "Built a responsive weather application using React and OpenWeather API, allowing users to search for real-time weather updates.",
        },
        {
            name: "Task Management Tool",
            description: "Created a task management application with Python and Flask, enabling users to organize tasks with priority levels and deadlines.",
        },
    ];

    const achievements = [
        {
            name: "Employee of the Month",
            description: "Recognized for exceptional performance and dedication to team goals during the month of June 2023.",
        },
        {
            name: "Hackathon Winner",
            description: "Led a team to victory in a 48-hour hackathon by developing an innovative AI-based productivity tool.",
        },
        {
            name: "Certification in Full-Stack Development",
            description: "Earned a professional certification in full-stack web development from XYZ Academy.",
        },
        {
            name: "Increased System Efficiency",
            description: "Redesigned a legacy system, increasing its processing efficiency by 30% and reducing downtime.",
        },
    ];

    const avatarChangerHeader = (
        <div className="inline-flex align-items-center justify-content-center gap-2" style={{display:'flex', gap:'20px'}}>
            <Avatar image={userData?.profile_img_url || 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'} shape="circle" />
            <span className="font-bold white-space-nowrap">{userData ? userData.account_username : 'Loading...'}</span>
        </div>
    );

    const avatarChangerFooter = (
        <div style={{marginTop:'20px'}}>
            <Button label="Save" icon="pi pi-check" onClick={() => setAvatarVisible(false)} autoFocus />
        </div>
    );
    
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
                            <Button icon="pi pi-pencil" rounded severity="info" aria-label="User" onClick={() => setVisibleEdit(true)} />
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
                                                            <img alt="logo" src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" className="h-2rem"></img>
                                                        </Button>
                                                        <Button >
                                                            <img alt="logo" src="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png" className="h-2rem"></img>
                                                        </Button>
                                                        <Button >
                                                            <img alt="logo" src='https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png' className="h-2rem"></img>
                                                        </Button>
                                                        <Button >
                                                            <img alt="logo" src='https://primefaces.org/cdn/primereact/images/avatar/annafali.png' className="h-2rem"></img>
                                                        </Button>
                                                        <Button >
                                                            <img alt="logo" src='https://primefaces.org/cdn/primereact/images/avatar/xuxuefeng.png' className="h-2rem"></img>
                                                        </Button>
                                                        <Button >
                                                            <img alt="logo" src='https://primefaces.org/cdn/primereact/images/organization/walter.jpg' className="h-2rem"></img>
                                                        </Button>
                                                        <Button >
                                                            <img alt="logo" src='https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png' className="h-2rem"></img>
                                                        </Button>
                                                    </div>
                                                </Dialog>
                                            </div>
                                            <div className='userInfo-edit-wrapper'>
                                                <h1>User Info</h1>
                                                <div className="p-inputgroup flex-1">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-user"></i>
                                                    </span>
                                                    <InputText placeholder={userData?.account_username || 'username'}  />
                                                </div>
                                                <div className='grid-2'>
                                                    <div className="p-inputgroup flex-1">
                                                        <span className="p-inputgroup-addon">
                                                            <i className="pi pi-building"></i>
                                                        </span>
                                                        <InputText placeholder={userData?.city || 'City'}  />
                                                    </div>
                                                    <div className="p-inputgroup flex-1">
                                                        <span className="p-inputgroup-addon">
                                                            <i className="pi pi-building-columns"></i>
                                                        </span>
                                                        <InputText placeholder={userData?.state || 'State'} />
                                                    </div>             
                                                </div>
                                                <div className="p-inputgroup flex-1">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-envelope"></i>
                                                    </span>
                                                    <InputText placeholder={userData?.personal_email || 'Personal Email'}  />
                                                </div>
                                            </div>
                                            <Divider />
                                            <div className='bio-edit-wrapper'>
                                                <h1>Bio</h1>
                                                <div className="card flex justify-content-center">
                                                    <InputTextarea placeholder={userData?.bio || ''}  className='textArea' autoResize value={value} onChange={(e) => setValue(e.target.value)} rows={5} cols={30} />
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
            
                                        </div>
                                    </p>
                            </Dialog>
                        </div>
                        <div className='schoolInfo-wrap'>
                            <h2>{userData ? userData.school_name: 'Loading...'}</h2>
                        </div>
                        <div className='contact-user-info'>
                        <h2>
                            {userData?.city ?? 'City'}, {userData?.state ?? 'State'}
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
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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