import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
// Buttons';
import { Button } from 'primereact/button';
import './index.scss'; // Create this file for styles
import { useNavigate } from 'react-router-dom';
import { use } from 'react';
// import { Button } from 'primereact/button';

const TeacherAppCard = ({ application }) => {
    const [studentInfo, setStudentInfo] = useState(null);
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState(null)

    

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await fetch(`http://localhost:4000/get-user/${application.user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student info');
        }
        const data = await response.json();
        setStudentInfo(data);
        setStudentId(data.user_id)
        console.log(data)
      } catch (error) {
        console.error('Error fetching student info:', error);
      }
    };

    fetchStudentInfo();
  }, [application.user_id]);

  const goToProfile = () => {
    console.log(studentId)
    navigate(`/accountpage`, { state: { userid: studentId } });
  };

    return (
    <Card
      title={`Job: ${application.job_title}`}
      subTitle={
        <>
          {studentInfo && `Submitted by ${studentInfo.real_name} on ${new Date(application.created_at).toLocaleDateString()}`}
        </>
      }
      className="teacher-app-card"
    >
      <div className="application-content">
        <div className="content-section">
          <h4 className="section-title">Why Interested</h4>
          <p className="section-text">{application.why_interested}</p>
        </div>
        <Divider />
        <div className="content-section">
          <h4 className="section-title">Relevant Skills</h4>
          <p className="section-text">{application.relevant_skills}</p>
        </div>
        <Divider />
        <div className="content-section">
          <h4 className="section-title">Hope to Gain</h4>
          <p className="section-text">{application.hope_to_gain}</p>
        </div>
        <Divider />
        <div className="button-section">
        <Button 
            label="View Profile" 
            icon="pi pi-search" 
            className="p-button-warning mr-2"
            onClick={goToProfile}
          />
          <Button 
            label="Review" 
            icon="pi pi-check"
            style={{backgroundColor: "#4caf50 !important"}}
            className="p-button-success mr-2"
          />
          <Button 
            label="Delete" 
            icon="pi pi-trash" 
            className="p-button-danger"
          />
        </div>
      </div>
    </Card>
  );
};

export default TeacherAppCard;
