import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import DOMPurify from 'dompurify';
import './index.scss';
import 'quill/dist/quill.snow.css';

export default function AddPostBar({ addJobPost }) {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [chips, setChips] = useState([]);
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);

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

    const handleOpenDialog = () => {
        setIsDialogVisible(true);
    };

    const handleCloseDialog = () => {
        setIsDialogVisible(false);
        setPostTitle('');
        setPostContent('');
        setSelectedIndustries([]);
        setSelectedJobTypes([]);
    };

    const handleSavePost = () => {
        const sanitizedContent = DOMPurify.sanitize(postContent, { ALLOWED_TAGS: [], KEEP_CONTENT: true });

        const newJobPost = {
            posterAvatar: "https://via.placeholder.com/150",
            posterUsername: "@job_poster123",
            posterSchool: "Sunnyvale High School",
            jobTitle: postTitle,
            jobDescription: sanitizedContent,
            filters: selectedIndustries.concat(selectedJobTypes),
            onDelete: () => alert("Delete post"),
            onSignUp: () => alert("Sign up for post")
        };

        addJobPost(newJobPost);
        handleCloseDialog();
    };

    const onIndustryChange = (e) => {
        const selected = [...selectedIndustries];
        if (!selected.includes(e.value)) {
            selected.push(e.value);
        }
        setSelectedIndustries(selected);
    };

    const removeIndustryTag = (tag) => {
        setSelectedIndustries(selectedIndustries.filter((item) => item !== tag));
    };

    const onJobTypeChange = (e) => {
        const selected = [...selectedJobTypes];
        if (!selected.includes(e.value)) {
            selected.push(e.value);
        }
        setSelectedJobTypes(selected);
    };

    const removeJobTypeTag = (tag) => {
        setSelectedJobTypes(selectedJobTypes.filter((item) => item !== tag));
    };

    const renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
            </span>
        );
    };
    const header = renderHeader();

    return (
        <div className="add-post-bar">
            <div className="bar">
                <span className="bar-text">Add to Posts</span>
                <Button 
                    icon="pi pi-plus" 
                    className="p-button-rounded p-button-text p-button-lg" 
                    onClick={handleOpenDialog} 
                    aria-label="Add Post"
                />
            </div>

            <Dialog header="Create a Post" visible={isDialogVisible} className='addPost-Dialog' onHide={handleCloseDialog}>
                <div className="post-dialog">
                    <div className="p-inputgroup flex-1" style={{ marginBottom: '1.5rem' }}>
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)}/>
                    </div>

                    <Divider />

                    <div className="field">
                        <label htmlFor="content">Post Content</label>
                        <Editor 
                            value={postContent} 
                            onTextChange={(e) => setPostContent(e.htmlValue)}  
                            headerTemplate={header} 
                            style={{ height: '320px' }} 
                        />
                    </div>

                    <Divider />

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
                    
                    <Divider />
                    
                    <div className="dropdown-tag-container">
                        <h3>Select Job Type</h3>
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
                    
                    <Divider />
                    
                    <div className="dialog-footer">
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={handleCloseDialog} />
                        <Button label="Save" icon="pi pi-check" className="p-button" onClick={handleSavePost} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
