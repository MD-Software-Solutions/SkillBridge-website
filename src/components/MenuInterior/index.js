import React, { useContext } from 'react';
import './index.scss';
import { Menubar } from 'primereact/menubar';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/img/logo2.png';
import { AuthContext } from '../../context/AuthContext';
import { authUtils } from '../../utils/auth';

/**
 * The `MenuInterior` component renders a navigation menu using the `Menubar` 
 * from PrimeReact. It includes menu items for 'Home', 'User' (with sub-items 
 * 'Account' and 'LogOut'), 'About', and 'Setting'. Each menu item has an icon 
 * and an associated command to navigate to different routes using React Router. 
 * The `logo` is displayed at the end of the menubar.
 */

export default function MenuInterior() {
    const navigate = useNavigate();
    const location = useLocation();
    // const { logout } = useContext(AuthContext);

    

    const isTeacher = authUtils.getStoredUserData().is_teacher;
    const tabLabel = isTeacher ? 'Posts + Applications' : 'Your Applications';

    const handleHomeNavigation = () => {
        if (location.pathname !== '/Interior') {
            console.log('Navigating to Interior');
            navigate('/Interior');
        } else {
            // If already on Interior, refresh the page or reset the state
            window.location.reload();
            // Or alternatively, you could implement a state reset function
            // resetInteriorState();
        }
    };

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            command: () => handleHomeNavigation()
        },
        {
            label: 'User',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Account',
                    icon: 'pi pi-fw pi-user',
                    command: () => navigate('/AccountPage')
                },
                {
                    label: 'LogOut',
                    icon: 'pi pi-fw pi-sign-out',
                    command: () => {
                        authUtils.logout();
                        navigate('/');
                    }
                }
            ]
        },
        {
            label: 'About',
            icon: 'pi pi-fw pi-info-circle',
            command: () => navigate('/contactdashboard')
        },
        {
            label: tabLabel,
            icon: 'pi pi-fw pi-briefcase',
            command: () => navigate('/userposts')
        }
    ];

    const end = <img alt="logo" src={logo} height="70" className="mr-2"></img>;

    return (
        <div>
            <Menubar className="border-radius-0" model={items} end={end} />
        </div>
    );
}
