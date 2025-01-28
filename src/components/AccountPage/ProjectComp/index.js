import React, { useEffect, useState, useContext } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { AuthContext } from "../../../context/AuthContext";

import "./index.scss";

export default function ProjectComponent() {
    const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch projects from the backend
  // const fetchProjects = async () => {
  //   try {
  //     const response = await fetch("/api/projects"); // Replace with your endpoint
  //     const data = await response.json();
  //     setProjects(data);
  //   } catch (error) {
  //     console.error("Error fetching projects:", error);
  //   }
  // };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://skillbridge-fbla-server.onrender.com/user_projects"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch projects.");
        }

        const projectDataArray = await response.json();

        const userProject = projectDataArray.filter((projectData) => {
          return projectData.user_id === user[0]?.user_id;
        });

        const formattedProjects = userProject.map((projectData) => ({
          index: projectData?.user_id || "No ID",
          project_name: projectData?.project_name || "Unnamed Project",
          project_description: projectData?.project_description || "No Description",
        }));
        setProjects(formattedProjects);

      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };

    if (user && user.length > 0) {
      fetchProjects();
    }
  }, [user]);

  // Add a new project
  const addProject = async () => {
    if (formData.name && formData.description) {
      try {
        const response = await fetch("https://skillbridge-fbla-server.onrender.com/user_projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user[0].user_id,
            project_name: formData.name,
            project_description: formData.description,
          }),
        });

        if (response.ok) {
          const newProject = await response.json();
          setProjects((prevProjects) => [...prevProjects, newProject]);
          setFormData({ name: "", description: "" });
          setDialogVisible(false);

        } else {
          console.error("Failed to add project:", await response.text());
        }
      } catch (error) {
        console.error("Error adding project:", error);
      }
    }
  };

  // Delete a project
  const deleteProject = async (id) => {
    try {
      const response = await fetch(`https://skillbridge-fbla-server.onrender.com/user_projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== id)
        );
      } else {
        console.error("Failed to delete project:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle project removal
  const handleRemoveProject = (id) => {
    deleteProject(id);
  };


  return (
    <div className="container">
      <div className="header">
        <h1 className="projects-title">Projects</h1>
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-button-info"
          onClick={() => setDialogVisible(true)}
          tooltip="Add Project"
        />
      </div>

      <Dialog
        header="Add Project"
        visible={isDialogVisible}
        style={{ width: "400px" }}
        onHide={() => setDialogVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Project Name</label>
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
            onClick={addProject}
          />
        </div>
      </Dialog>

      <div className="projects-list">
        {projects.map((item, index) => (
          <Card key={item.index} title={item.project_name} className="card">
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-danger p-button-sm card-button"
              onClick={() => handleRemoveProject(item.id)}
              tooltip="Remove"
            />
            <p>{item.project_description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
