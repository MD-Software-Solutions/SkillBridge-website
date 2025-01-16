import React, { useEffect } from 'react';
import './index.scss';
import heroGuy from '../../assets/img/heroGuy.png';
import shape1 from '../../assets/img/shape1.png';
import HomeCard from './HomeCard';
import { AnimatedOnScroll } from 'react-animated-css-onscroll';
import MenuBarLanding from '../MenubarLanding';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className='size-window'>
            <MenuBarLanding />

            <section className="background-wrapper">
                <div className='hero-wrapper-primary'>
                    <div className='cloud-wrapper'>
                        {/* <div>
                            <AnimatedOnScroll animationIn="fadeInUp" animationInDuration={1500}>
                                <img className="shape-obj-1" src={shape1} alt='shape1' />
                            </AnimatedOnScroll>
                        </div> */}
                        {/* <div>
                            <AnimatedOnScroll animationIn="fadeInUp" animationInDuration={1500}>
                                <img className="cld-obj-2" src={cloud2} alt='cloud2' />
                            </AnimatedOnScroll>
                        </div> */}
                    </div>

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
