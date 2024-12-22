import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import './index.scss';

const HistoryCompnent = () => {
  const [workHistoryEdit, setWorkHistory] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    duration: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddWorkHistory = () => {
    if (formData.company && formData.role && formData.duration && formData.description) {
      setWorkHistory([...workHistoryEdit, formData]);
      setFormData({ company: "", role: "", duration: "", description: "" });
      setDialogVisible(false);
    }
  };

  const handleRemoveWorkHistory = (index) => {
    setWorkHistory(workHistoryEdit.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="history-title">History</h1>
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-button-info" // severity="info" changes the color to blue
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
              onClick={() => handleRemoveWorkHistory(index)}
              tooltip="Remove"
            />
            <p>{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryCompnent;
