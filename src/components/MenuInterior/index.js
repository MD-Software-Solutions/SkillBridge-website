import React from 'react';
import './index.scss';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';

export default function MenuInterior() {
    const navigate = useNavigate();

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            command: () => navigate('/Interior')
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
                    command: () => navigate('/')
                }
            ]
        },
        {
            label: 'About',
            icon: 'pi pi-fw pi-info-circle',
            command: () => navigate('/contactdashboard')
        },
        {
            label: 'Setting',
            icon: 'pi pi-fw pi-cog',
            command: () => navigate('/Interior')
        }
    ];

    const end = <img alt="logo" src={logo} height="70" className="mr-2"></img>;

    return (
        <div>
            <Menubar className="border-radius-0" model={items} end={end} />
        </div>
    );
}
