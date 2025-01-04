import './index.scss';
import { Tag } from 'primereact/tag';
import KnPotrait from '../../../assets/img/KnPotrait.jpg';
import SdPotrait from '../../../assets/img/SdPotrait.jpg';
import { Divider } from 'primereact/divider';

export default function DashBoardContact() {
    return (
        <div className="DashBoard-ContactWrapper-Primary">
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
            <div className="contact-AboutCard-wrapper">
                <div>
                    <img src={KnPotrait} />
                </div>
                <div className="contact-CardText-wrap">
                    <h1>Khang Nguyen</h1>
                    <h2>Front-End Developer</h2>
                    <p>
                        Khang Nguyen is a highly experienced front-end developer with a strong background in building dynamic and responsive web applications. He began his career as an intern at Nike, where his dedication and skills led to a full-time position. After gaining valuable experience at Nike, Khang moved to Amazon, where he further honed his expertise in front-end development. Currently, Khang is contributing his talents at SkillBridge, where he excels in creating seamless and intuitive user interfaces. With proficiency in ReactJS, HTML, JavaScript, CSS, SCSS, and other modern web technologies, Khang has a proven track record of delivering high-quality results and building exceptional user experiences.
                        <br /><br />
                        Gmail: khangng872@gmail.com
                        <br />
                        Phone #: 470-939-2806
                    </p>
                </div>
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
                <div>
                    <img src={SdPotrait} />
                </div>
                <div className="contact-CardText-wrap">
                    <h1>Soham Desai</h1>
                    <h2>BackEnd Developer</h2>
                    <p>
                        Soham Desai is a seasoned back-end developer with a rich background in programming and software development. His journey began as a passionate intern for non-profit organizations, including United Planet, where he contributed to projects that connected communities worldwide. Soham played a pivotal role in helping children in South America learn English, an experience that fueled his desire to make a positive impact through technology. Over time, his skills and dedication led him to work at Microsoft, where he further honed his expertise in back-end systems and large-scale software architecture. Now at SkillBridge, Soham continues to leverage his deep understanding of back-end technologies to build robust and scalable systems. With his wealth of experience, Soham is committed to driving innovation and solving complex challenges in the tech world.
                        <br /><br />
                        Gmail: sohamdesai6508@gmail.com
                        <br />
                        Phone #: 801-638-2850
                    </p>
                </div>
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
