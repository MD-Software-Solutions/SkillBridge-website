import React, { useState, useEffect, useContext } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { AuthContext } from "../../../context/AuthContext";
import "./index.scss";

const SkillComponent = () => {
  const { user } = useContext(AuthContext);
  const [skillsEdit, setSkills] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch user's skill data
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(
          "https://skillbridge-fbla-server.onrender.com/user_skills"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const skillsDataArray = await response.json();

        const userSkillsData = skillsDataArray.filter(
          (skillData) => skillData.user_id === user[0]?.user_id
        );

        const formattedSkills = userSkillsData.map((skillData) => ({
          id: skillData.user_id,
          name: skillData?.skill_name || "",
          description: skillData?.skill_description || "",
        }));

        setSkills(formattedSkills);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user && user.length > 0) {
      fetchSkills();
    }
  }, [user]);

  // Handle input changes in the dialog
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add a new skill entry
  const handleAddSkill = async () => {
    try {
      if (formData.name && formData.description) {
        const skillDataInsert = {
          user_id: user[0]?.user_id,
          skill_name: formData.name,
          skill_description: formData.description,
        };

        const response = await fetch(
          "https://skillbridge-fbla-server.onrender.com/user_skills",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(skillDataInsert),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create skill.");
        }

        setSkills([...skillsEdit, formData]);
        setFormData({ name: "", description: "" });
        setDialogVisible(false);
      }
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  // Show confirmation dialog for deleting a skill
  const handleDeleteClick = (index) => {
    setSkillToDelete(index);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setSkillToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (skillToDelete !== null) {
      try {
        const skillId = skillsEdit[skillToDelete]?.id;

        if (!skillId) throw new Error("Skill ID not found.");

        const response = await fetch(
          `https://skillbridge-fbla-server.onrender.com/user_skills/${skillId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete skill.");
        }

        setSkills((prev) => prev.filter((_, index) => index !== skillToDelete));
      } catch (error) {
        console.error("Error deleting skill:", error);
      } finally {
        setShowConfirmation(false);
        setSkillToDelete(null);
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="skills-title">Skills</h1>
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-button-info"
          onClick={() => setDialogVisible(true)}
          tooltip="Add Skill"
        />
      </div>

      <Dialog
        header="Add Skill"
        visible={isDialogVisible}
        style={{ width: "400px" }}
        onHide={() => setDialogVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Skill Name</label>
            <InputText
              id="name"
              name="name"
              value={formData.name}
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
            onClick={handleAddSkill}
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
        <p>Are you sure you want to delete this skill?</p>
      </Dialog>

      <div className="skills-list">
        {skillsEdit.map((item, index) => (
          <Card key={index} title={item.name} className="card">
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

export default SkillComponent;
