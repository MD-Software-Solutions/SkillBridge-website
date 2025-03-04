import React, { useContext, useState, useEffect } from 'react';
import './index.scss';
import { Menubar } from 'primereact/menubar';
import { AutoComplete } from 'primereact/autocomplete';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo2.png';
import { AuthContext } from '../../context/AuthContext';

export default function MenuInterior() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [userList, setUserList] = useState([]); // Ensure it's always an array
    const [filteredUsers, setFilteredUsers] = useState([]); 
    const [selectedUser, setSelectedUser] = useState(null); 

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

    const searchUsers = (event) => {
        const query = event.query?.toLowerCase() || ''; 
        
        console.log("Searching for:", query); // Debugging: Check search input
        console.log("Current user list:", userList); // Debugging: Check userList

        if (!Array.isArray(userList)) {
            console.error("userList is not an array:", userList);
            return;
        }

        setFilteredUsers(
            userList.filter(user => 
                user?.account_username?.toLowerCase().includes(query) // Ensure user exists
            )
        );
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user.account_username); 
        navigate(`/accountpage`, { state: { userid: user.user_id } }); 
    };

    const searchBar = (
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
    );

    const items = [
        { label: 'Home', icon: 'pi pi-fw pi-home', command: () => navigate('/Interior') },
        { 
            label: 'User', icon: 'pi pi-fw pi-user',
            items: [
                { label: 'Account', icon: 'pi pi-fw pi-user', command: () => navigate('/AccountPage') },
                { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => { logout(); navigate('/'); } }
            ]
        },
        { label: 'About', icon: 'pi pi-fw pi-info-circle', command: () => navigate('/contactdashboard') },
        { label: 'Posts', icon: 'pi pi-fw pi-briefcase', command: () => navigate('/userposts') }
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
