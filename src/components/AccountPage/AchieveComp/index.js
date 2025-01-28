import React, { useState, useEffect, useContext } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { AuthContext } from "../../../context/AuthContext";
import "./index.scss";

const AchieveComponent = () => {
  const { user } = useContext(AuthContext);
  const [achieveList, setAchieveList] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [achieveToDelete, setAchieveToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch achievements data
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch(
          "https://skillbridge-fbla-server.onrender.com/user_achievements"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch achievements.");
        }

        const achievementsDataArray = await response.json();

        const userAchievements = achievementsDataArray.filter((achievement) => {
          return achievement.user_id === user[0]?.user_id;
        });

        const formattedAchievements = userAchievements.map((achievement) => {
          console.log("Mapping achievement:", achievement);
          return {
            id: achievement.user_id || "No ID",
            name: achievement?.achievement_name || "Unnamed Achievement",
            description: achievement?.achievement_description || "No Description",
          };
        });

        setAchieveList(formattedAchievements);


      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };

    if (user && user.length > 0) {
      fetchAchievements();
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add new achievement
  const handleAddAchievement = async () => {
    try {
      if (formData.name && formData.description) {
        const achievementData = {
          user_id: user[0]?.user_id,
          achievement_name: formData.name,
          achievement_description: formData.description,
        };

        console.log(achievementData);

        const response = await fetch(
          "https://skillbridge-fbla-server.onrender.com/user_achievements",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(achievementData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add achievement.");
        }

        setAchieveList([...achieveList, formData]);
        setFormData({ name: "", description: "" });
        setDialogVisible(false);
      }
    } catch (error) {
      console.error("Error adding achievement:", error);
    }
  };

  // Show confirmation dialog for deletion
  const handleDeleteClick = (index) => {
    setAchieveToDelete(index);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setAchieveToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (achieveToDelete !== null) {
      try {
        const achievementId = achieveList[achieveToDelete]?.id;

        if (!achievementId) throw new Error("Achievement ID not found.");

        const response = await fetch(
          `https://skillbridge-fbla-server.onrender.com/user_achievements/${achievementId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete achievement.");
        }

        setAchieveList((prev) =>
          prev.filter((_, index) => index !== achieveToDelete)
        );
      } catch (error) {
        console.error("Error deleting achievement:", error);
      } finally {
        setShowConfirmation(false);
        setAchieveToDelete(null);
      }
    }
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
            onClick={handleAddAchievement}
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
        <p>Are you sure you want to delete this achievement?</p>
      </Dialog>

      <div className="achievements-list">
        {achieveList.map((item, index) => (
          <Card
            key={index}
            title={item.name}
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

export default AchieveComponent;