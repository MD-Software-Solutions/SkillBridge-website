import "./index.scss"
import React from "react"
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import MenuInterior from "../../MenuInterior";

export default function ApplicationSuccess() {
  const navigate = useNavigate();

  return (
    <div>
        <MenuInterior />
        <div className="success-container">
          <Card className="success-card">
            <div className="success-content">
              <i className="pi pi-check-circle" style={{ fontSize: '3rem', color: 'var(--green-500)' }}></i>
              <h2>Application Submitted Successfully!</h2>
              <p>Your application has been received. We will review it and get back to you soon.</p>
              <div className="button-container">
                <Button
                  label="Back to Dashboard"
                  icon="pi pi-home"
                  onClick={() => navigate('/Interior')}
                  className="p-button-primary"
                />
                <Button
                  label="View My Applications"
                  icon="pi pi-list"
                  onClick={() => navigate('/userposts')}
                  className="p-button-secondary"
                />
              </div>
            </div>
          </Card>
        </div>
    </div>
  )
}
