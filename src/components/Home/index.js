import React, { useEffect, useRef } from 'react';
import './index.scss';
import heroGuy from '../../assets/img/heroGuy2.png';
import HomeCard from './HomeCard';
import MenuBarLanding from '../MenubarLanding';
import { Link } from 'react-router-dom';

/**
 * The `Home` component represents the landing page of the application. It 
 * includes a navigation menu, a hero section with promotional content and 
 * call-to-action buttons for signing up and signing in, and a `HomeCard` 
 * component. The layout is styled to provide a visually engaging user experience.
 */
const Home = () => {
    const firstLoad = useRef(true);
    useEffect(() => {
            if (firstLoad.current) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                firstLoad.current = false;
            }
    }, []);

    return (
        <div className='size-window'>
            

            <section className="background-wrapper">
            <MenuBarLanding />
                <div className='hero-wrapper-primary'>
                    <div className='hero-content'>
                        <div className='home-content-grid-wrapper'>
                            <div className='text-box-wrapper'>
                                <h1>SkillBridge</h1>
                                <p>Empowering Students, Enabling Employers</p>
                                <div className='button-switch'>
                                    <h2 className='hover-state-1'>
                                        <Link className='link-txt' to="/signUp">Join</Link>
                                    </h2>
                                    <h3 className='hover-state-2'>
                                        <Link className='link-txt' to="/signIn">Sign In</Link>
                                        <div className='switch-block'></div>
                                    </h3>
                                </div>
                            </div>

                            <div className='circle-wrapper'>
                                <div className='circle-obj'></div>
                            </div>
                        </div>
                    </div>

                    <img className='ship-img' src={heroGuy} alt='heroShip' />
                </div>
            </section>

            <HomeCard />
        </div>
    );
};

export default Home;
