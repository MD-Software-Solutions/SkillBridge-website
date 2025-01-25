import React, { useState, useEffect, useContext } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { AuthContext } from "../../../context/AuthContext";
import "./index.scss";

const HistoryComponent = () => {
  const { user } = useContext(AuthContext);
  const [workHistoryEdit, setWorkHistory] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    duration: "",
    description: "",
  });

  // Fetch user's history data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          "https://skillbridge-fbla-server.onrender.com/user_history"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const historyDataArray = await response.json();
        const userHistoryData = historyDataArray.filter(
          (historyData) => historyData.user_id === user[0]?.user_id
        );

        const formattedHistory = userHistoryData.map((historyData) => ({
          id: historyData.id,
          company: historyData?.company_name || "",
          role: historyData?.role || "",
          duration: historyData?.duration || "",
          description: historyData?.description || "",
        }));

        setWorkHistory(formattedHistory);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user && user.length > 0) {
      fetchHistory();
    }
  }, [user]);

  // Handle input changes in the dialog
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add a new work history entry
  const handleAddWorkHistory = async () => {
    try {
      if (
        formData.company &&
        formData.role &&
        formData.duration &&
        formData.description
      ) {
        const historyDataInsert = {
          user_id: user[0]?.user_id,
          company_name: formData.company,
          role: formData.role,
          duration: formData.duration,
          description: formData.description,
        };

        const response = await fetch(
          "https://skillbridge-fbla-server.onrender.com/user_history",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(historyDataInsert),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create job posting");
        }

        setWorkHistory([...workHistoryEdit, formData]);
        setFormData({ company: "", role: "", duration: "", description: "" });
        setDialogVisible(false);
      }
    } catch (error) {
      console.error("Error adding work history:", error);
    }
  };

  // Show confirmation dialog for deleting an entry
  const handleDeleteClick = (index) => {
    setJobToDelete(index);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setJobToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (jobToDelete !== null) {
      try {
        const jobId = workHistoryEdit[jobToDelete]?.id;

        if (!jobId) throw new Error("Job ID not found.");

        const response = await fetch(
          `https://skillbridge-fbla-server.onrender.com/user_history/${jobId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete job post.");
        }

        setWorkHistory((prev) =>
          prev.filter((_, index) => index !== jobToDelete)
        );
      } catch (error) {
        console.error("Error deleting job:", error);
      } finally {
        setShowConfirmation(false);
        setJobToDelete(null);
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="history-title">History</h1>
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-button-info"
          onClick={() => setDialogVisible(true)}
          tooltip="Add Work History"
        />
      </div>

      <Dialog
        header="Add Work History"
        visible={isDialogVisible}
        style={{ width: "400px" }}
        onHide={() => setDialogVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="company">Company</label>
            <InputText
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="role">Role</label>
            <InputText
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="duration">Duration</label>
            <InputText
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="description">Description</label>
            <InputTextarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <Button
            label="Add"
            className="p-button-primary"
            onClick={handleAddWorkHistory}
          />
        </div>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        header="Confirm Deletion"
        visible={showConfirmation}
        style={{ width: "400px" }}
        onHide={handleCloseConfirmation}
        footer={
          <div>
            <Button
              label="No"
              icon="pi pi-times"
              onClick={handleCloseConfirmation}
              className="p-button-text"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              onClick={handleConfirmDelete}
              className="p-button-danger"
            />
          </div>
        }
      >
        <p>Are you sure you want to delete this job post?</p>
      </Dialog>

      <div className="work-history-list">
        {workHistoryEdit.map((item, index) => (
          <Card
            key={index}
            title={item.company}
            subTitle={`${item.role} (${item.duration})`}
            className="card"
          >
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-danger p-button-sm card-button"
              onClick={() => handleDeleteClick(index)}
              tooltip="Remove"
            />
            <p>{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryComponent;
