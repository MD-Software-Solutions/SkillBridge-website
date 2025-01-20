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

/**
 * The `AddPostBar` component allows users to create and add job posts.
 */
export default function AddPostBar({ addJobPost }) {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [googleFormLink, setGoogleFormLink] = useState('');
    const [isLinkValid, setIsLinkValid] = useState(true);

    // Job type and industry options
    const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance', 'Remote', 'On-site', 'Temporary', 'Volunteer'];
    const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Retail', 'Construction', 'Government', 'Hospitality'];

    // Handles opening of the dialog
    const handleOpenDialog = () => setIsDialogVisible(true);

    // Handles closing of the dialog and resets form state
    const handleCloseDialog = () => { 
        setIsDialogVisible(false); 
        setPostTitle(''); 
        setPostContent(''); 
        setSelectedIndustries([]); 
        setSelectedJobTypes([]); 
        setGoogleFormLink(''); 
        setIsLinkValid(true); 
    };

    // Handles saving of job post
    const handleSavePost = () => {
        const sanitizedContent = DOMPurify.sanitize(postContent, { ALLOWED_TAGS: [], KEEP_CONTENT: true });

        if (!googleFormLink.match(/^https:\/\/docs\.google\.com\/forms\/.*$/)) { 
            setIsLinkValid(false); 
            return; 
        }
        
        const newJobPost = {
            posterAvatar: "https://via.placeholder.com/150",
            posterUsername: "@job_poster123",
            posterSchool: "Sunnyvale High School",
            jobTitle: postTitle,
            jobDescription: sanitizedContent,
            filters: selectedIndustries.concat(selectedJobTypes),
            googleFormLink: googleFormLink,
            onDelete: () => alert("Delete post"),
            onSignUp: () => alert("Sign up for post")
        };
        
        addJobPost(newJobPost);
        handleCloseDialog();
    };

    // Handles selection of industries
    const onIndustryChange = (e) => { 
        const selected = [...selectedIndustries]; 
        if (!selected.includes(e.value)) selected.push(e.value); 
        setSelectedIndustries(selected); 
    };

    // Removes selected industry tag
    const removeIndustryTag = (tag) => setSelectedIndustries(selectedIndustries.filter((item) => item !== tag));

    // Handles selection of job types
    const onJobTypeChange = (e) => { 
        const selected = [...selectedJobTypes]; 
        if (!selected.includes(e.value)) selected.push(e.value); 
        setSelectedJobTypes(selected); 
    };

    // Removes selected job type tag
    const removeJobTypeTag = (tag) => setSelectedJobTypes(selectedJobTypes.filter((item) => item !== tag));

    // Renders header for the editor
    const renderHeader = () => (
        <span className="ql-formats">
            <button className="ql-bold" aria-label="Bold"></button>
            <button className="ql-italic" aria-label="Italic"></button>
            <button className="ql-underline" aria-label="Underline"></button>
        </span>
    );

    const header = renderHeader();
    
    /**
     * Returns the JSX for rendering the `AddPostBar` component. It includes a button 
     * to open a dialog for creating a post, a `Dialog` component that contains input 
     * fields for the post title and content, dropdowns for selecting industries 
     * and job types, and an input for a Google Forms link. Renders all PrimeReact 
     * components and handles job post creation and validation within the dialog.
     */
    return (
        <div className="add-post-bar">
            <div className="bar">
                <span className="bar-text">Add to Posts</span>
                <Button icon="pi pi-plus" className="p-button-rounded p-button-text p-button-lg" onClick={handleOpenDialog} aria-label="Add Post" />
            </div>

            <Dialog header="Create a Post" visible={isDialogVisible} className="addPost-Dialog" onHide={handleCloseDialog}>
                <div className="post-dialog">
                    <div className="p-inputgroup flex-1" style={{ marginBottom: '1.5rem' }}>
                        <span className="p-inputgroup-addon"><i className="pi pi-user"></i></span>
                        <InputText placeholder="Title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
                    </div>

                    <Divider />

                    <div className="field">
                        <label htmlFor="content">Post Content</label>
                        <Editor value={postContent} onTextChange={(e) => setPostContent(e.htmlValue)} headerTemplate={header} style={{ height: '320px' }} />
                    </div>

                    <Divider />

                    <div className="dropdown-tag-container">
                        <h3>Select Industry</h3>
                        <Dropdown value={null} options={industries} onChange={onIndustryChange} placeholder="Select an industry" className="industry-dropdown" />
                        <div className="selected-tags">
                            {selectedIndustries.map((tag, index) => <Tag key={index} value={tag} onClick={() => removeIndustryTag(tag)} className="selected-tag" />)}
                        </div>
                    </div>
                    
                    <Divider />
                    
                    <div className="dropdown-tag-container">
                        <h3>Select Job Type</h3>
                        <Dropdown value={null} options={jobTypes} onChange={onJobTypeChange} placeholder="Select a job type" className="job-type-dropdown" />
                        <div className="selected-tags">
                            {selectedJobTypes.map((tag, index) => <Tag key={index} value={tag} onClick={() => removeJobTypeTag(tag)} className="selected-tag" />)}
                        </div>
                    </div>
                    
                    <Divider />

                    <div className="form-container">
                        <label className='form-label' htmlFor="googleFormLink">Google Forms Link</label>
                        <br />
                        <InputText id="googleFormLink" value={googleFormLink} onChange={(e) => setGoogleFormLink(e.target.value)} placeholder="Paste Google Forms link here" className={!isLinkValid ? 'p-invalid' : ''} />
                        <br />
                        {!isLinkValid && <small className="p-error">Invalid Google Forms link. Please use a valid link.</small>}
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