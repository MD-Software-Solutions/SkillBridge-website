// AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // To store the logged-in user's data
    const [error, setError] = useState(null);

    const login = async (username, password) => {
        try {
            const response = await fetch(
                `http://localhost:4000/sign-in?username=${username}&password=${password}`
            );
            const data = await response.json();

            if (response.ok) {
                setUser(data); // Save user data (e.g., user ID, roles, etc.)
                setError(null);
                return true; // Indicate successful login
            } else {
                setError(data.error || 'Login failed.');
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
