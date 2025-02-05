import React from 'react';
import { Card } from 'primereact/card';
import { Link } from 'react-router-dom';
import './index.scss';
import { Divider } from 'primereact/divider';
import logo from '../../assets/img/logo2.png';
import 'primeicons/primeicons.css';

/**
 * The `Footer` component displays a footer section with navigational links,
 * contact information, and a logo. It consists of four main areas: a logo section, 
 * navigation links to 'About', 'Statistic', and 'FAQ', links for exploring the catalog 
 * and authentication routes, and contact details. The footer uses PrimeReact's 
 * `Card` and `Divider` components for styling and layout.
 */

export default function Footer() {
    return (
        // <div className="Footer-wrapper">
        //     <Card className="border-radius-0" style={{ backgroundColor: '#001f3f', color: 'white' }}>
        //         <div className="p-card-footer footer-content">
        //             <div><img src={logo} alt="logo" /></div>
        //             <div>
        //                 <Link className='foot-link' to="/contactdashboard">About</Link>
        //                 <Link className='foot-link' to="/contactdashboard/DashBoardFAQ">FAQ</Link>
        //             </div>
        //             <div>
        //                 <Link className='foot-link' to="/signin">Sign In</Link>
        //                 <Link className='foot-link' to="/signup">Sign Up</Link>
        //             </div>
        //             <div>
        //                 <p>skillbridgecorp@gmail.com</p>
        //                 <p>(557)482-2886</p>
        //             </div>

        //             <Divider className="pad-none span-4 margin-bottom-0" />
                    
        //             <p className="span-4 pad-none">© SkillBridge Corporation - 2025</p>
        //         </div>
        //     </Card>
        // </div>
        <div className='footer-wrapper-primary'>
            <div className='footer-content-wrap grid-col-4'>
                <div>
                    <h1>SkillBridge</h1>
                    <p>
                        Connecting students with opportunities! Our platform allows students to sign up for internships, jobs, and experiences while teachers and employers can post job listings. Start exploring and take the next step in your career journey today!
                    </p>
                </div>
                <div className='center-wrapper'>
                    <div className='foot-link-wrapper'>
                        <h1>Links</h1>
                        <div className='foot-link-repsonsive'>
                            <Link className='foot-link' to="/contactdashboard">About</Link>
                            <Link className='foot-link' to="/contactdashboard/DashBoardFAQ">FAQ</Link>
                            <Link className='foot-link' to="/signin">Sign In</Link>
                            <Link className='foot-link' to="/signup">Sign Up</Link>
                        </div>
                    </div>
                </div>
                <div>
                    <h1>Contacts</h1>
                    <p>5575 State Bridge Rd, Johns Creek, GA 30022</p>
                    <p>skillbridgecorp@gmail.com</p>
                    <p>(470) 939 - 2806</p>
                </div>
                <div>
                    <h1 className='center-txt-768'>Socials</h1>
                    <div className='footer-interactive-wrapper'>
                        <Link className='footer-contact-interactive' target='_blank' to="https://www.instagram.com"><i className="pi pi-instagram" style={{ fontSize: '2.3rem' }}></i></Link>
                        <Link className='footer-contact-interactive' target='_blank' to="https://www.linkedin.com"><i className="pi pi-linkedin" style={{ fontSize: '2.3rem' }}></i></Link>
                        <Link className='footer-contact-interactive' target='_blank' to="https://www.facebook.com"><i className="pi pi-facebook" style={{ fontSize: '2.3rem' }}></i></Link>
                        <Link className='footer-contact-interactive' target='_blank' to="https://twitter.com"><i className="pi pi-twitter" style={{ fontSize: '2.3rem' }}></i></Link>
                    </div>
                </div>
                <Divider className='span-4 marginTop-2rem' />
                <p className="span-4 footer-copyright">© SkillBridge Corporation - 2025</p>

            </div>
        </div>
    );
}
