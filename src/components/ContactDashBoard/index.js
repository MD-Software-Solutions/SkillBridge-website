import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Routes, Route } from 'react-router-dom';
import React, { createContext } from 'react';
import DashBoardLayout from './DashBoardLayout';
import DashBoardStatstic from "./DashBoardStatistic";
import DashBoardContact from "./DashBoardContact";
import DashBoardFAQ from "./DashBoardFAQ";

export const ThemeContext = createContext('light');

const ContactDashBoard = () => {
    return (
        <ThemeContext.Provider value="dark">
            <Routes>
                <Route path="/" element={<DashBoardLayout />}>
                    <Route index element={<DashBoardStatstic />} />
                    <Route path="DashBoardContact" element={<DashBoardContact />} />
                    <Route path="DashBoardFAQ" element={<DashBoardFAQ />} />
                </Route>
            </Routes>
        </ThemeContext.Provider>
    );
};

export default ContactDashBoard;
