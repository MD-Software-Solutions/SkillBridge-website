import React, { useContext, useEffect, useState } from 'react';
import './index.scss';
import { Outlet, useLocation } from 'react-router-dom';
import SideBarComponent from '../sideBarComp';
import MenubarLanding from '../../MenubarLanding';
import MenuInterior from '../../MenuInterior';
import { AuthContext } from '../../../context/AuthContext';

/**
 * The `DashBoardLayout` component serves as the main layout for the dashboard, 
 * dynamically switching between `MenuInterior` and `MenubarLanding` based on the current route. 
 * It includes a sidebar for navigation and renders different content using the `Outlet` component 
 * provided by `react-router-dom`. The layout adapts to different sections of the dashboard, 
 * ensuring a consistent and navigable user interface.
 */
const DashBoardLayout = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [bool, setBool] = useState(false);
    
    // Check if the user is inside the dashboard by verifying the path starts with '/dashboard'
    const isDashboard = location.pathname.startsWith('/Interior');

    useEffect (() => {
        const checkBool = () => {
            console.log("test")

            setBool(true);
            console.log("bool 1:", bool)
        }

        console.log("bool:", bool)
        console.log("user:", user)


        if (user.length > 0){
            checkBool()
        }
    },(user))

    return (
        <div className="dashboard-container">
            {bool ? <MenuInterior /> : <MenubarLanding />}
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
