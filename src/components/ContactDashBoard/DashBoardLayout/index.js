import React from 'react';
import './index.scss';
import { Outlet, useLocation } from 'react-router-dom';
import SideBarComponent from '../sideBarComp';
import MenubarLanding from '../../MenubarLanding';
import MenuInterior from '../../MenuInterior';

/**
 * The `DashBoardLayout` component serves as the main layout for the dashboard, 
 * dynamically switching between `MenuInterior` and `MenubarLanding` based on the current route. 
 * It includes a sidebar for navigation and renders different content using the `Outlet` component 
 * provided by `react-router-dom`. The layout adapts to different sections of the dashboard, 
 * ensuring a consistent and navigable user interface.
 */
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
