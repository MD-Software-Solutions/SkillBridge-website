import './index.scss';
import { Tag } from 'primereact/tag';
import KnPotrait from '../../../assets/img/KnPotrait.jpg';
import SdPotrait from '../../../assets/img/SdPotrait.jpg';
import { Divider } from 'primereact/divider';

/**
 * DashBoardContact Component
 * 
 * This component displays the SkillBridge team members, their roles, 
 * skills, and contact details. It includes portraits, descriptions, 
 * and tags representing technical expertise.
 */
export default function DashBoardContact() {
    return (
        <div className="DashBoard-ContactWrapper-Primary">
            {/* Section: Introduction Header with team portraits */}
            <div className="contact-introHeader-wrap">
                <div>
                    <img src={KnPotrait} />
                </div>
                <div>
                    <img src={SdPotrait} />
                </div>
                <Divider className="span-2" />
                <div className="span-2">
                    <h1>Meet Our Team Here at SkillBridge</h1>
                </div>
            </div>

            {/* Section: About Cards for team members */}
            <div className="contact-AboutCard-wrapper">
                {/* Khang Nguyen - Front-End Developer */}
                <div>
                    <img src={KnPotrait} />
                </div>
                <div className="contact-CardText-wrap">
                    <h1>Khang Nguyen</h1>
                    <h2>Front-End Developer</h2>
                    <p>
                        Khang Nguyen is a highly experienced front-end developer with a strong background in building dynamic and responsive web applications. 
                        He began his career as an intern at Nike, later securing a full-time position. Afterward, he worked at Amazon, gaining further experience in 
                        front-end development. Now, at SkillBridge, he excels in creating seamless user interfaces.
                        <br /><br />
                        Gmail: khangng872@gmail.com
                        <br />
                        Phone #: 470-939-2806
                    </p>
                </div>
                
                {/* Khang's Skills */}
                <div className="contact-skills span-2">
                    <div className="contact-tags">
                        <Tag className="tag" value="ReactJS" />
                        <Tag className="tag" value="HTML" />
                        <Tag className="tag" value="CSS" />
                        <Tag className="tag" value="SCSS" />
                        <Tag className="tag" value="JavaScript" />
                        <Tag className="tag" value="NodeJS" />
                    </div>
                </div>

                <Divider className='span-2' />

                {/* Soham Desai - Back-End Developer */}
                <div>
                    <img src={SdPotrait} />
                </div>
                <div className="contact-CardText-wrap">
                    <h1>Soham Desai</h1>
                    <h2>Back-End Developer</h2>
                    <p>
                        Soham Desai is a seasoned back-end developer with extensive experience in software development. 
                        He started as an intern for non-profits, including United Planet, where he helped children in South America learn English. 
                        His passion for technology led him to Microsoft, where he refined his skills in back-end systems. Now at SkillBridge, 
                        he focuses on building scalable systems and solving complex challenges.
                        <br /><br />
                        Gmail: sohamdesai6508@gmail.com
                        <br />
                        Phone #: 801-638-2850
                    </p>
                </div>
                
                {/* Soham's Skills */}
                <div className="pad-bottom-10 contact-skills span-2">
                    <div className="contact-tags">
                        <Tag className="tag" value="ReactJS" />
                        <Tag className="tag" value="Render" />
                        <Tag className="tag" value="AWS" />
                        <Tag className="tag" value="Python" />
                        <Tag className="tag" value="JavaScript" />
                        <Tag className="tag" value="NodeJS" />
                    </div>
                </div>
            </div>
        </div>
    );
}
