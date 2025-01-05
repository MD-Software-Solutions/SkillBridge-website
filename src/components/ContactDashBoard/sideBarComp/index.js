import React from 'react';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

export default function SideBarComponent() {
    const navigate = useNavigate();
    
    const items = [
        {  icon: 'pi pi-chart-bar', command: () => navigate('/contactdashboard') },
        { icon: 'pi pi-envelope', command: () => navigate('/contactdashboard/DashBoardContact') },
        { icon: 'pi pi-info', command: () => navigate('/contactdashboard/DashBoardFAQ')}
    ];

    return (
        <div className="sidebar-container">
            <div className="sidebar">
                {items.map((item, index) => (
                    <Button
                        key={index}
                        label={item.label}
                        icon={item.icon}
                        className="sidebar-item"
                        onClick={item.command}
                    />
                ))}
            </div>
        </div>
    );
}
