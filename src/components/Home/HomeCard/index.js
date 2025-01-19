import './index.scss';
import { Divider } from 'primereact/divider';
import React, { useState } from 'react';
import ChartActiveUser from '../../../assets/img/ChartActiveUser.png';
import DrawnLine from '../../../assets/img/DrawnLine.png';
import PieIndustry from '../../../assets/img/PieIndustry.png';

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
          <Divider />
          <div className='sec1-wrapper-primary'>

            <div className='sec1-column-wrap'>
              <h1>1.</h1>
              <h2>Lorem ipsum odor amet, consectetuer adipiscing elit.</h2>
              <p>  
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            <div className='sec1-column2-wrap'>
              <div className='card bg-grey'>
                <h1>2.</h1>
                <h2>Lorem ipsum odor amet, consectetuer adipiscing elit.</h2>
                <p>  
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam.
                </p>
              </div>
              <div className='card bg-wheat'>
                <h1>3.</h1>
                <h2>Lorem ipsum odor amet, consectetuer adipiscing elit.</h2>
                <p>  
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
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
                            <h1>+3k</h1>
                        </div>
                        <div className='pad-30'>
                            <p>Schools <br /> NationWide</p>
                        </div>
                    </div>
                </div>
            </div>
          {/* <div className='sec3-content-wrapper'>
            <div className="custom-carousel">
              <Carousel
                  value={products}
                  numVisible={2}
                  numScroll={1}
                  responsiveOptions={responsiveOptions}
                  itemTemplate={slider}
              />
            </div>
          </div> */}
      </div>
    </section>
  );
};

export default CardSection;
