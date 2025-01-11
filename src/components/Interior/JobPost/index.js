import React from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import "./index.scss";

const JobPost = ({ posterAvatar, posterUsername, posterSchool, jobTitle, jobDescription, filters, googleFormLink, onDelete }) => {
  const handleSignUp = () => {
    if (googleFormLink) {
      window.open(googleFormLink, "_blank");
    } else {
      alert("No sign-up form available for this job.");
    }
  };

  return (
    <div className="job-post-container">
      <div className="job-post-header">
        <div className="poster-info">
          <Avatar image={posterAvatar} shape="circle" size="large" className="poster-avatar" />
          <div className="poster-details">
            <div className="poster-username">{posterUsername}</div>
            <div className="poster-school">{posterSchool}</div>
          </div>
        </div>
        <Button icon="pi pi-times" className="p-button-rounded p-button-danger delete-button" tooltip="Delete this post" onClick={onDelete} />
      </div>
      <div className="job-title">{jobTitle}</div>
      <div className="job-description">{jobDescription}</div>
      <div className="job-filters">
        {filters.map((filter, index) => <Chip key={index} label={filter} className="p-mr-2" />)}
      </div>
      <div className="job-signup">
        <Button label="Sign Up" icon="pi pi-check" className="p-button-success signup-button" onClick={handleSignUp} />
      </div>
    </div>
  );
};

export default JobPost;
