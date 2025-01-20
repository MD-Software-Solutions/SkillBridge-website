import "primereact/resources/themes/viva-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Changed from BrowserRouter to HashRouter
import Layout from './components/Layout';
import React, { createContext } from 'react';
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Interior from "./components/Interior";
import AccountPage from "./components/AccountPage";
import ContactDashBoard from "./components/ContactDashBoard";

/**
 * Main application component.
 * 
 * This file sets up the React app's routing and context management.
 * 
 * Key Features:
 * - ThemeContext: A simple context to manage theme state across the app (default value: "light").
 * - HashRouter: Enables routing using hash-based URLs, suitable for environments without server-side routing support.
 * - Routes: Configures the app's navigation structure.
 * 
 * Dependencies:
 * - PrimeReact: Used for UI components and themes.
 * - React Router: Provides client-side routing.
 */

export const ThemeContext = createContext('light');

const App = () => {
  return (
    <ThemeContext.Provider value="dark">
      <Router>  {/* Now using HashRouter */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="interior" element={<Interior />} />
            <Route path="accountpage" element={<AccountPage />} />
            <Route path="contactdashboard/*" element={<ContactDashBoard />} />
          </Route>
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
};

export default App;