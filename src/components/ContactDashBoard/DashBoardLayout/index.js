import React from 'react';
import './index.scss';
import { Outlet } from 'react-router-dom';
import SideBarComponent from '../sideBarComp';
import MenubarLanding from '../../MenubarLanding';

const DashBoardLayout = () => {
    return (
        <div className="dashboard-container">
            <MenubarLanding />
            <div className="dashboard-layout">
                <SideBarComponent />
                <div className="dashboard-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashBoardLayout;

