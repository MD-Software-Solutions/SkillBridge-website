import './index.scss';
import { Divider } from 'primereact/divider';
import React, { useState } from 'react';
import ChartActiveUser from '../../../assets/img/ChartActiveUser.png';
import DrawnLine from '../../../assets/img/DrawnLine.png';
import PieIndustry from '../../../assets/img/PieIndustry.png';
import { Card } from 'primereact/card';
import img1 from "../../../assets/img/ChartActiveUser.png"



/**
 * The `CardSection` component presents a section of the home page, with three key areas.
 * It displays informational cards with text content, a logo, and a carousel showcasing
 * statistics and success stories related to `SkillBridge`. PrimeReact's `Divider` and `Carousel`
 * are used for layout and interactive display. Images pulled from the local assets. 
 */
const CardSection = () => {
  return (
    <section className="index-2">
      <div className="page-content-wrapper-primary">

          <div className='sec1-wrapper-primary'>

            <div className='sec1-column-wrap'>
              <h1>1.</h1>
              <h2>Connecting Students with Opportunities, One Job Posting at a Time.</h2>
              <p>  
                At SkillBridge, we believe in the power of connection. Our platform is designed to bridge the gap between eager students and prospective employers by providing a seamless job posting service tailored specifically for students. Whether you're an employer looking to find fresh talent or a student ready to kickstart your career, SkillBridge is your ultimate destination. Tailored to the unique needs of students and entry-level roles, we make job searching and recruitment as simple and effective as possible. Join SkillBridge and take the first step toward building a brighter future together.
              </p>
            </div>

            <div className='sec1-column2-wrap'>
              <div className='card bg-grey'>
                <h1>2.</h1>
                <h2>Exclusive Opportunities</h2>
                <p>
                  By targeting student job postings, SkillBridge offers unique opportunities that are often missed by broader job search platforms. Our specialized approach helps employers find talented students with fresh ideas, while students access exclusive job listings, internships, and entry-level positions suited to their skills and ambitions. SkillBridge simplifies the job search process, creating meaningful connections between employers and the next generation of professionals.
                </p>
              </div>
              <div className='card bg-wheat'>
                <h1>3.</h1>
                <h2>Support and Resources</h2>
                <p>  
                  At SkillBridge, we support students with resources to enhance their job search. From resume-building tips and interview preparation to valuable career advice, we provide the guidance needed to confidently enter the workforce and achieve career goals.
                </p>
              </div>
            </div>
          </div>
          <div class="bg-grey">
            <div class="sec2-content-wrapper">
                <div className='dashStat-card-content bg-light-green'>
                    <i className="pi pi-users stat-card-i"></i>
                    <p><bold>+80,000</bold> <br /> Active Users</p>
                </div>
                <div className='dashStat-card-content bg-light-blue'>
                    <i className="pi pi-briefcase stat-card-i"></i>
                    <p><bold>+25,000</bold> <br /> Opportunities Posted</p>
                </div>
                <div className='dashStat-card-content bg-light-red'>
                    <i className="pi pi-check stat-card-i"></i>
                    <p><bold>+15,000</bold> <br /> Successful Matches</p>
                </div>
                <div className='dashStat-card-content bg-light-orange'>
                    <i className="pi pi-pencil stat-card-i"></i>
                    <p><bold>+22,500</bold> <br /> Application Submitted</p>
                </div>
            </div>
          </div>
          <div className='dashboard-chart-wrapper'>
                <div className='chart-card-wrap w-100'>
                    <img src={ChartActiveUser} alt="Chart of Active Users" />
                </div>
                <div className='chart-wrapper-secondary'>
                    <div className='chart-content-grid'>
                        <div className='chart-card-wrap2 w-100'>
                            <div className='chart-text'>
                                Opportunities:
                                <br />
                                <bolden>
                                    +25,000
                                </bolden>
                            </div>
                            <img className='DrawnLine' src={DrawnLine} alt="Chart of post" />
                        </div>
                        <div className='chart-card-wrap w-100'>
                            <img src={PieIndustry} alt="Industry" />
                        </div>
                    </div>
                    <div className='chart-CardSchool-wrap'>
                        <div className='pad-30'>
                            <p>SkillBridge <br /> is Used In</p>
                        </div>
                        <div className='pad-20'>
                            <h1>+3K</h1>
                        </div>
                        <div className='pad-30'>
                            <p>Schools <br /> NationWide</p>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    </section>
  );
};

export default CardSection;
