// AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // To store the logged-in user's data
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    const apiUrl = "https://skillbridge-fbla-server.onrender.com"

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
        <AuthContext.Provider value={{ user, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};
