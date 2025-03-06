import React, { useState, useEffect, useContext, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import DOMPurify from 'dompurify';
import './index.scss';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import 'quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../../context/AuthContext';
import { authUtils } from '../../../utils/auth';

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
    const [error, setError] = useState('');
    // const { user } = useContext(AuthContext);

    const toast = useRef(null);

    // Job type and industry options (26 filtering options)
    const jobTypes = [
        'Full-time', 'Part-time', 'Internship', 'Contract', 
        'Freelance', 'Remote', 'On-site', 'Temporary', 'Volunteer', 'Seasonal', 'Apprenticeship'
    ];
    const industries = [
        'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Retail', 'Construction', 
        'Government', 'Hospitality', 'Customer Service', 'Human Resources', 'Engineering', 'Legal', 'Nonprofit', 'Other'
    ];

    const formLinkPatterns = [
        /^https:\/\/docs\.google\.com\/forms\/.*$/,  
        /^https:\/\/forms\.office\.com\/.*$/,        
        /^https:\/\/[a-zA-Z0-9-]+\.typeform\.com\/.*$/, 
        /^https:\/\/form\.jotform\.com\/.*$/,     
        /^https:\/\/[a-zA-Z0-9-]+\.wufoo\.com\/forms\/.*$/ 
    ];

    const isValidFormLink = (formLink) => {
        return formLinkPatterns.some(pattern => pattern.test(formLink));
    }

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

    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setUserData(authUtils.getStoredUserData());
                console.log(userData)
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [navigate]);

    // Handles saving of job post
    const handleSavePost = () => {
        confirmDialog({
            message: 'You are about to publish a job listing. Please ensure all information is accurate. Would you like to proceed?',
            header: 'Publish Job Listing',
            icon: 'pi pi-briefcase', // Using briefcase icon to match job context
            acceptLabel: 'Yes, Publish',
            rejectLabel: 'Review Again',
            acceptIcon: 'pi pi-check',     // Add checkmark icon for accept
            rejectIcon: 'pi pi-pencil',
            style: { 
                maxWidth: '600px' // Control dialog width
            },
            contentStyle: {
                wordWrap: 'break-word',  // Enable text wrapping
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap'
            },
            accept: () => {
                const sanitizedContent = DOMPurify.sanitize(postContent, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
            
                toast.current.show({
                    severity: 'info',
                    summary: 'Pending',
                    detail: 'Your post has been saved. An admin will approve it soon!!',
                    life: 10000,
                    position: 'top-right'
                });
    
                saveJobPost();
                handleCloseDialog();
            },
            reject: () => {
                // Optional: Add any logic you want to execute if user clicks "No"
            }
        });
    };
    
    const saveJobPost = async () => {
        try {
            const sanitizedContent = DOMPurify.sanitize(postContent, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
    
            const jobData = {
                user_id: userData.user_id,
                job_title: postTitle,
                job_description: sanitizedContent, 
                job_signup_form: "",
                job_type_tag: JSON.stringify(selectedJobTypes),
                industry_tag: JSON.stringify(selectedIndustries),
                user_avatar: userData.profile_img_url,
            };
    
            const response = await fetch('http://localhost:4000/job_postings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData),
            });
      
            if (!response.ok) {
                throw new Error('Failed to create job posting');
            }
      
            const result = await response.json();
            setError(result.message); // Success message
            return result.jobId;  // Return the jobId to handleSavePost
        } catch (error) {
            setError(`Error: ${error.message}`); // Error message
            throw error;  // Propagate error to handleSavePost
        }
    }
    

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
                        <Editor value={postContent} onTextChange={(e) => setPostContent(e.htmlValue)} headerTemplate={header} style={{ height: '320px', fontSize: '19px' }} />
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

                    {/* <div className="form-container">
                        <label className='form-label' htmlFor="googleFormLink">Link to sign-up form</label>
                        <br />
                        <InputText id="googleFormLink" value={googleFormLink} onChange={(e) => setGoogleFormLink(e.target.value)} placeholder="Paste link here" className={!isLinkValid ? 'p-invalid' : ''} />
                        <br />
                        {!isLinkValid && <small className="p-error">Invalid Google Forms link. Please use a valid link.</small>}
                    </div>

                    <Divider /> */}
                    
                    <div className="dialog-footer">
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={handleCloseDialog} />
                        <Button label="Save" icon="pi pi-check" className="p-button" onClick={handleSavePost} />
                    </div>
                </div>
            </Dialog>

            <Toast ref={toast} />
            <ConfirmDialog />
        </div>
    );
}