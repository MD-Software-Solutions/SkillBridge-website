import React, { useContext, useState, useEffect } from 'react';
import './index.scss';
import { Menubar } from 'primereact/menubar';
import { useNavigate, useLocation } from 'react-router-dom';
import { AutoComplete } from 'primereact/autocomplete';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo2.png';
import { AuthContext } from '../../context/AuthContext';
import { authUtils } from '../../utils/auth';

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

    const end = (
        <div className='menubar-end'>
            <AutoComplete 
                value={selectedUser} 
                suggestions={filteredUsers} 
                completeMethod={searchUsers} 
                field="account_username" 
                placeholder="Search users..." 
                onChange={(e) => setSelectedUser(e.value)} 
                onSelect={(e) => handleUserSelect(e.value)}
                className="search-bar"
            />
            <img alt="logo" src={logo} height="70" className="mr-2 menubar-logo" />
        </div>
    );

    return (
        <div>
            <Menubar className="border-radius-0" model={items} end={end} />
        </div>
    );
}
