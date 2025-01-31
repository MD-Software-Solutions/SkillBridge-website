import React from 'react';
import { Card } from 'primereact/card';
import { Link } from 'react-router-dom';
import './index.scss';
import { Divider } from 'primereact/divider';
import logo from '../../assets/img/logo2.png';

/**
 * The `Footer` component displays a footer section with navigational links,
 * contact information, and a logo. It consists of four main areas: a logo section, 
 * navigation links to 'About', 'Statistic', and 'FAQ', links for exploring the catalog 
 * and authentication routes, and contact details. The footer uses PrimeReact's 
 * `Card` and `Divider` components for styling and layout.
 */

export default function Footer() {
    return (
        <div className="Footer-wrapper">
            <Card className="border-radius-0" style={{ backgroundColor: '#001f3f', color: 'white' }}>
                <div className="p-card-footer footer-content">
                    <div><img src={logo} alt="logo" /></div>
                    <div>
                        <Link className='foot-link' to="/contactdashboard">About</Link>
                        <Link className='foot-link' to="/contactdashboard/DashBoardFAQ">FAQ</Link>
                    </div>
                    <div>
                        <Link className='foot-link' to="/signin">Sign In</Link>
                        <Link className='foot-link' to="/signup">Sign Up</Link>
                    </div>
                    <div>
                        <p>skillbridgecorp@gmail.com</p>
                        <p>(557)482-2886</p>
                    </div>

                    <Divider className="pad-none span-4 margin-bottom-0" />
                    
                    <p className="span-4 pad-none">© SkillBridge Corporation - 2025</p>
                </div>
            </Card>
        </div>
    );
}
