import './index.scss';
import ChartActiveUser from '../../../assets/img/ChartActiveUser2.png';
import DrawnLine from '../../../assets/img/DrawnLine2.png';
import PieIndustry from '../../../assets/img/PieIndustry2.png';

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
            <div className='info-card custom-font'>
              <h2>Student Opportunities</h2>
              <p>  
                Connect with employers and find internships, part-time jobs, and entry-level positions tailored for students. Build your career from day one.
              </p>
            </div>

            <div className='info-card custom-font'>
              <h2>Employer Solutions</h2>
              <p>
                Access a pool of talented students ready to bring fresh perspectives to your organization. Post jobs and find the perfect candidates for your team.
              </p>
            </div>

            <div className='info-card custom-font'>
              <h2>Career Growth</h2>
              <p>
                Get access to resume building tools, interview preparation resources, and career guidance to help you succeed in your professional journey.
              </p>
            </div>
          </div>

          <div className="bg-grey">
            <div className="sec2-content-wrapper">
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
                    <p><bold>+22,500</bold> <br /> Applications Filled</p>
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
                                    25,000+
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
                            <p>SkillBridge is used in</p>
                        </div>
                        <div className='pad-20'>
                            <h1>3K+</h1>
                        </div>
                        <div className='pad-40'>
                            <p>schools nationwide</p>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    </section>
  );
};

export default CardSection;
