import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import React, { createContext } from 'react';
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Interior from "./components/Interior";
import AccountPage from "./components/AccountPage";

export const ThemeContext = createContext('light');

const App = () => {
  return (
    <ThemeContext.Provider value="dark">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="Interior" element={<Interior />} />
            <Route path="AccountPage" element={<AccountPage /> } />
          </Route>
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
};

export default App;
