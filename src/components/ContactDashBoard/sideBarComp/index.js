import React, { useState, useEffect } from 'react';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

/**
 * The `SideBarComponent` is a responsive sidebar that adapts to mobile and desktop views.
 * It includes navigation buttons to different dashboard sections such as `Statistic`, 
 * `Contact`, and `FAQ`, which are styled using PrimeReact's `Button` component. 
 * The mobile view is handled using state and the window's resize event listener.
 */
export default function SideBarComponent() {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const items = [
        { icon: 'pi pi-chart-bar', command: () => navigate('/contactdashboard') },
        { icon: 'pi pi-envelope', command: () => navigate('/contactdashboard/DashBoardContact') },
        { icon: 'pi pi-info', command: () => navigate('/contactdashboard/DashBoardFAQ') }
    ];

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={isMobile ? "mobile-navbar-container" : "sidebar-container"}>
            <div className={isMobile ? "mobile-navbar" : "sidebar"}>
                {items.map((item, index) => (
                    <Button
                        key={index}
                        icon={item.icon}
                        className="menu-item"
                        onClick={item.command}
                    />
                ))}
            </div>
        </div>
    );
}
