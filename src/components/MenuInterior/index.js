import React, { useContext, useState, useEffect } from 'react';
import './index.scss';
import { Menubar } from 'primereact/menubar';
import { useNavigate, useLocation } from 'react-router-dom';
import { AutoComplete } from 'primereact/autocomplete';
// import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo2.png';
import { AuthContext } from '../../context/AuthContext';
import { authUtils } from '../../utils/auth';

export default function MenuInterior() {
    const navigate = useNavigate();
    const location = useLocation();
    const [userList, setUserList] = useState([]); // Ensure it's always an array
    const [filteredUsers, setFilteredUsers] = useState([]); 
    const [selectedUser, setSelectedUser] = useState(null); 
    // const { logout } = useContext(AuthContext);

    const userData = authUtils.getStoredUserData();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:4000/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data.');
                }
                const users = await response.json();

                console.log("Fetched users:", users); // Debugging: Check API response
                
                if (Array.isArray(users)) {
                    setUserList(users); // Only set if it's an array
                } else {
                    console.error("API did not return an array:", users);
                    setUserList([]); // Fallback to an empty array
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUserList([]); // Ensure userList is never undefined
            }
        };
        fetchUsers();
    }, []);

    const isTeacher = userData.is_teacher;
    const tabLabel = (isTeacher ? 'Posts + Applications' : 'Your Applications');

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

    const searchUsers = (event) => {
        const query = event.query?.toLowerCase() || ''; 
        
        console.log("Searching for:", query); // Debugging: Check search input
        console.log("Current user list:", userList); // Debugging: Check userList

        if (!Array.isArray(userList)) {
            console.error("userList is not an array:", userList);
            return;
        }

        setFilteredUsers(
            userList.filter(userData => 
                userData?.account_username?.toLowerCase().includes(query) // Ensure user exists
            )
        );
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user.account_username); 
        navigate(`/accountpage`, { state: { userid: user.user_id } }); 
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
        },
        ...(userData.is_admin ? [{
            label: 'Admin Dashboard',
            icon: 'pi pi-fw pi-cog',
            command: () => navigate('/admin')
        }] : [])
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
