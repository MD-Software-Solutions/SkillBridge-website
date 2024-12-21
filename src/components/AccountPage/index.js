import './index.scss'
import MenuInterior from '../MenuInterior';
import React, { useState, useEffect } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import accBg from '../../assets/img/accBg.png';
import { Avatar } from 'primereact/avatar';

export default function AccountPage () {
    const [visible, setVisible] = useState(false);
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
                            <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" className="mr-2" size="xlarge" shape="circle" />
                        </Divider>
                        <div className='topRow-user-info'>
                            <h1>UserName</h1>
                            <Button icon="pi pi-pencil" rounded severity="info" aria-label="User" />
                        </div>
                        <div className='schoolInfo-wrap'>
                            <h2>School</h2>
                        </div>
                        <div className='contact-user-info'>
                            <h2>Location</h2>
                            <div className="card flex justify-content-center">
                                <Button label="Contacts" icon="pi pi-external-link" onClick={() => setVisible(true)} />
                                <Dialog header="Header" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                                    <p className="m-0">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
                                    <h3 style={{ margin: '0.5rem 0', color: '#333' }}>{job.company}</h3>
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
                                <div
                                    key={index}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        minHeight: '10px',
                                        borderRadius: '20px',
                                        backgroundColor: '#f4f2ee',
                                        padding: '1rem',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <h3 style={{ margin: '0.5rem 0', color: '#333' }}>{skill.name}</h3>
                                    <p style={{ margin: '0.5rem 0', color: '#666' }}>{skill.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}