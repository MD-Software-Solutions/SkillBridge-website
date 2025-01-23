// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState();
    const [user, setUser] = useState([]);
    const [username, setUsername] = useState(null);


    const apiUrl = "https://skillbridge-fbla-server.onrender.com"
    const testUrl = "http://localhost:4000"

    // useEffect(() => {setUser(user);}, [user]);

    const get_user_account_info = async (username) => {
        try {
            const response = await fetch(`${apiUrl}/get-user?username=${username}`)

            if (!response.ok) {
                return false;
            } else {
                const result = await response.json()
                const id = result[0].user_id

                setUsername(result[0].account_username);

                const user_info = [
                    {
                        user_id: result[0].user_id,
                        real_name: result[0].real_name,
                        personal_email: result[0].personal_email,
                        phone_number: result[0].phone_number,
                        birth_date: result[0].birth_date,
                        school_name: result[0].school_name,
                        school_district: result[0].school_district,
                        school_email: result[0].school_email,
                        account_username: result[0].account_username,
                        is_teacher: result[0].is_teacher,
                        city: result[0].city,
                        state: result[0].state,
                        bio: result[0].bio,
                        profile_img_url: result[0].profile_img_url,
                        avatar_name: result[0].avatar_name,
                        created_at: result[0].created_at
                    }
                ]

                
                setUser(user_info);
                setUserId(id);
                setError(result.message);

                return user;
            }

            
        } catch (error) {
            setError(`Error: ${error.message}`)
            return false;
        }
    }

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

    const logout = () => setUser();

    return (
        <AuthContext.Provider value={{ user, userId, username, login, logout, create_job_posting, get_user_account_info, error }}>
            {children}
        </AuthContext.Provider>
    );
};
