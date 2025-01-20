import React from 'react';
import './index.scss';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo2.png';
// Import theme CSS locally here

export default function MenubarLanding() {
    const navigate = useNavigate();

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            command: () => navigate('/')
        },
        {
            label: 'User',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Log In',
                    icon: 'pi pi-fw pi-user-plus',
                    command: () => navigate('/signin')
                },
                {
                    label: 'Sign Up',
                    icon: 'pi pi-fw pi-user-minus',
                    command: () => navigate('/signup')
                }
            ]
        },
        {
            label: 'About',
            icon: 'pi pi-fw pi-info-circle',
            command: () => navigate('/ContactDashBoard')
        }
    ];

    const end = <img alt="logo" src={logo} height="70" className="mr-2"></img>;

    return (
        <div className='menubar-height'>
            <div className='menubar-landing'>
                {/* Use Menubar component */}
                <Menubar className="border-radius-0" model={items} end={end} />
            </div>
        </div>
    );
}
