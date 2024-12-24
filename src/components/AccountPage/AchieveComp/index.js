import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import "./index.scss";

export default function AchieveComponent() {
  const [achievements, setAchievements] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddAchievement = () => {
    if (formData.name && formData.description) {
      setAchievements([...achievements, formData]);
      setFormData({ name: "", description: "" });
      setDialogVisible(false);
    }
  };

  const handleRemoveAchievement = (index) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="achievements-title">Achievements</h1>
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-button-info"
          onClick={() => setDialogVisible(true)}
          tooltip="Add Achievement"
        />
      </div>
      <Dialog
        header="Add Achievement"
        visible={isDialogVisible}
        style={{ width: "400px" }}
        onHide={() => setDialogVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Achievement Name</label>
            <InputText
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="description">Description</label>
            <InputText
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <Button
            label="Add"
            className="p-button-primary"
            onClick={handleAddAchievement}
          />
        </div>
      </Dialog>
      <div className="achievements-list">
        {achievements.map((item, index) => (
          <Card key={index} title={item.name} className="card">
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-danger p-button-sm card-button"
              onClick={() => handleRemoveAchievement(index)}
              tooltip="Remove"
            />
            <p>{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};