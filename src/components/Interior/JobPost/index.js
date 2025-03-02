import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import "./index.scss";

/**
 * The `JobPost` component represents an individual job listing, displaying relevant details 
 * such as the poster's avatar, username, school, job title, and job description. It also 
 * includes a list of filters as `Chip` components. Users can sign up via a provided Google 
 * Form link or delete the post using the respective buttons. Various PrimeReact components 
 * (`Avatar`, `Button`, `Chip`) are utilized for building the UI.
 */

const JobPost = ({ posterAvatar, posterUsername, posterSchool, jobTitle, jobDescription, filters, googleFormLink, userid, onDelete, showDelete }) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (googleFormLink) {
      window.open(googleFormLink, "_blank");
    } else {
      alert("No sign-up form available for this job.");
    }
  };

  const handleAvatarClick = () => {
    navigate(`/accountpage`, { state: { userid } });
  }

  return (
    <div className="job-post-container">
      <div className="job-post-header">
        <div className="poster-info">
          <Avatar image={posterAvatar} shape="circle" size="large" className="poster-avatar"  onClick={handleAvatarClick}/>
          <div className="poster-details">
            <div className="poster-username">{posterUsername}</div>
            <div className="poster-school">{posterSchool} (Teacher)</div>
          </div>
        </div>
        {showDelete && (
          <Button icon="pi pi-times" className="p-button-rounded p-button-danger delete-button" tooltip="Delete this post" onClick={onDelete} />
        )}
      </div>
      <div className="job-title">{jobTitle}</div>
      <div className="job-description">{jobDescription}</div>
      <div className="job-filters">
        {Array.isArray(filters) && filters.map((filter, index) => (
          <Chip key={index} label={filter} className="p-mr-2" />
        ))}
      </div>
      <div className="job-signup">
        <Button label="Sign Up" icon="pi pi-check" className="p-button-success signup-button" onClick={handleSignUp} />
      </div>
    </div>
  );
};

export default JobPost;
