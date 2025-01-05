import React from 'react';
import './index.scss';
import { Outlet, useLocation } from 'react-router-dom';
import SideBarComponent from '../sideBarComp';
import MenubarLanding from '../../MenubarLanding';
import MenuInterior from '../../MenuInterior';

const DashBoardLayout = () => {
    const location = useLocation();
    const isInterior = location.pathname.includes('contactdashboard');

    return (
        <div className="dashboard-container">
            {isInterior ? <MenuInterior /> : <MenubarLanding />}
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
