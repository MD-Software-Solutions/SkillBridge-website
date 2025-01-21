// AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // To store the logged-in user's data
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    const apiUrl = "https://skillbridge-fbla-server.onrender.com"
    const testUrl = "http://localhost:4000"

    const create_job_posting = async (jobData) => {         
      
          try {
            // Send POST request to the API
            const response = await fetch('http://localhost:4000/job_postings', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(jobData),
            });
      
            if (!response.ok) {
              throw new Error('Failed to create job posting');
            }
      
            const result = await response.json();
            setError(result.message); // Success message
          } catch (error) {
            setError(`Error: ${error.message}`); // Error message
          }
    }

    const login = async (username, password) => {
        try {
            const response = await fetch(
                `${apiUrl}/sign-in?username=${username}&password=${password}`
            );
            const data = await response.json();

            if (response.ok) {
                setUser(data);
                setError(null);
                return true; // Indicate successful login
            } else {
                setError(data.error || 'Login failed.');
                console.log("You messed up")
                return false; // Indicate failed login
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Internal server error.');
            return false;
        }
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout, create_job_posting, error }}>
            {children}
        </AuthContext.Provider>
    );
};
