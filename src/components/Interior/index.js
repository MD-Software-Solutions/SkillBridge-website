import './index.scss';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import MenuInterior from '../MenuInterior';
import { Link, useNavigate } from 'react-router-dom';

export default function Interior() {
    const navigate = useNavigate();
    const jobTypes = [
        'Full-time',
        'Part-time',
        'Internship',
        'Contract',
        'Freelance',
        'Remote',
        'On-site',
        'Temporary',
        'Volunteer'
    ];

    const industries = [
        'Technology',
        'Finance',
        'Healthcare',
        'Education',
        'Marketing',
        'Retail',
        'Construction',
        'Government',
        'Hospitality'
    ];

    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [selectedIndustries, setSelectedIndustries] = useState([]);

    const onJobTypeChange = (e) => {
        const value = e.value;
        if (!selectedJobTypes.includes(value)) {
            setSelectedJobTypes(prevSelectedJobTypes => [...prevSelectedJobTypes, value]);
        }
    };

    const onIndustryChange = (e) => {
        const value = e.value;
        if (!selectedIndustries.includes(value)) {
            setSelectedIndustries(prevSelectedIndustries => [...prevSelectedIndustries, value]);
        }
    };

    const removeJobTypeTag = (tag) => {
        console.log('Removing job type tag:', tag);
        setSelectedJobTypes(prevSelectedJobTypes => prevSelectedJobTypes.filter(item => item !== tag));
    };

    const removeIndustryTag = (tag) => {
        console.log('Removing industry tag:', tag);
        setSelectedIndustries(prevSelectedIndustries => prevSelectedIndustries.filter(item => item !== tag));
    };

    const [searchTerm, setSearchTerm] = useState('');

    const onSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className='window-sizer'>
            <MenuInterior />
            <div className='interior-wrapper-grid'>
                <div className='interior-userProfile-column'>
                    <div className='userInfo-row-wrapper'>
                        <div className="flex-auto">
                            <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" className="mr-2" size="xlarge" shape="circle" />
                        </div>
                        <div>
                            <h1>UserName</h1>
                            <h3>School Name</h3>
                        </div>
                    </div>
                    <Divider/>
                    <div className='interior-userFunction-wrapper'>
                        <Button icon="pi pi-cog" rounded severity="secondary" aria-label="Setting" />
                        <Button icon="pi pi-user" rounded severity="info" aria-label="User" onClick={() => (window.location.href = '/AccountPage')} />
                        <Button icon="pi pi-info" rounded severity="warning" aria-label="Info" onClick={() => navigate('/contactdashboard/DashBoardFAQ')} />
                    </div>
                    <Divider/>
                    <div className='text-center'>
                        <h2 className='font-3vh'>Student</h2>
                        <p className='font-2vh'>
                            Lorem ipsum odor amet, consectetuer adipiscing elit. Auctor placerat ut scelerisque feugiat phasellus. Sit taciti magnis ligula sit mollis feugiat ad montes aliquam. 
                        </p>
                    </div>
                    <Divider className='color-divider' />
                    <div className='logOut-Btn-wrapper'>
                        <Link to="/">
                            <Button className='logOut-Btn' label="Log Out" severity="danger" />
                        </Link>
                    </div>
                </div>

                <div className='interior-post-column'>
                    <div className='topSection-info-wrap'>
                        <h1>Explore Job Opportunities</h1>
                        <h3>Tip: Remember, you can filter job listings based on your skills, interests, and availability.</h3>
                    </div>
                    <div className='post-section-overflow'>

                        <div className='post-card-wrap'>
                            <div className='post-user-wrap'>
                                <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                <div className='user-info-grid'>
                                    <Skeleton width="10rem" className="mb-2"></Skeleton>
                                    <Skeleton width="5rem" className="mb-2"></Skeleton>
                                    <Skeleton height=".5rem"></Skeleton>
                                </div>
                            </div>
                            <Skeleton width="100%" height="150px"></Skeleton>
                            <div className="flex">
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                            </div>
                        </div>

                        <div className='post-card-wrap'>
                            <div className='post-user-wrap'>
                                <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                <div className='user-info-grid'>
                                    <Skeleton width="10rem" className="mb-2"></Skeleton>
                                    <Skeleton width="5rem" className="mb-2"></Skeleton>
                                    <Skeleton height=".5rem"></Skeleton>
                                </div>
                            </div>
                            <Skeleton width="100%" height="150px"></Skeleton>
                            <div className="flex">
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                            </div>
                        </div>

                        <div className='post-card-wrap'>
                            <div className='post-user-wrap'>
                                <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                <div className='user-info-grid'>
                                    <Skeleton width="10rem" className="mb-2"></Skeleton>
                                    <Skeleton width="5rem" className="mb-2"></Skeleton>
                                    <Skeleton height=".5rem"></Skeleton>
                                </div>
                            </div>
                            <Skeleton width="100%" height="150px"></Skeleton>
                            <div className="flex">
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                            </div>
                        </div>

                        <div className='post-card-wrap'>
                            <div className='post-user-wrap'>
                                <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                <div className='user-info-grid'>
                                    <Skeleton width="10rem" className="mb-2"></Skeleton>
                                    <Skeleton width="5rem" className="mb-2"></Skeleton>
                                    <Skeleton height=".5rem"></Skeleton>
                                </div>
                            </div>
                            <Skeleton width="100%" height="150px"></Skeleton>
                            <div className="flex">
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                            </div>
                        </div>

                        <div className='post-card-wrap'>
                            <div className='post-user-wrap'>
                                <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                <div className='user-info-grid'>
                                    <Skeleton width="10rem" className="mb-2"></Skeleton>
                                    <Skeleton width="5rem" className="mb-2"></Skeleton>
                                    <Skeleton height=".5rem"></Skeleton>
                                </div>
                            </div>
                            <Skeleton width="100%" height="150px"></Skeleton>
                            <div className="flex">
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                            </div>
                        </div>

                        <div className='post-card-wrap'>
                            <div className='post-user-wrap'>
                                <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                <div className='user-info-grid'>
                                    <Skeleton width="10rem" className="mb-2"></Skeleton>
                                    <Skeleton width="5rem" className="mb-2"></Skeleton>
                                    <Skeleton height=".5rem"></Skeleton>
                                </div>
                            </div>
                            <Skeleton width="100%" height="150px"></Skeleton>
                            <div className="flex">
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                            </div>
                        </div>

                        <div className='post-card-wrap'>
                            <div className='post-user-wrap'>
                                <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                <div className='user-info-grid'>
                                    <Skeleton width="10rem" className="mb-2"></Skeleton>
                                    <Skeleton width="5rem" className="mb-2"></Skeleton>
                                    <Skeleton height=".5rem"></Skeleton>
                                </div>
                            </div>
                            <Skeleton width="100%" height="150px"></Skeleton>
                            <div className="flex">
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='interior-filter-column'>
                    <div className='filter-title'>
                        <h1 className='text-center'>Filter</h1>
                        <div className="">
                            <InputText 
                                value={searchTerm} 
                                onChange={onSearchChange} 
                                placeholder="Search by job title or company" 
                                className="search-input" 
                            />
                        </div>
                        <Divider className='color-divider'/>
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
    )
}
