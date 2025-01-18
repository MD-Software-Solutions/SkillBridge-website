import './index.scss';
import { Divider } from 'primereact/divider';
import { Carousel } from 'primereact/carousel';
import logo from '../../../assets/img/logo.png';
import React, { useState } from 'react';
import gallery1 from '../../../assets/img/gallery1.jpg';
import gallery2 from '../../../assets/img/gallery2.jpg';
import volunteer1 from '../../../assets/img/volunteer1.jpg';
import volunteer2 from '../../../assets/img/volunteer2.jpg';

/**
 * The `CardSection` component presents a section of the home page, with three key areas.
 * It displays informational cards with text content, a logo, and a carousel showcasing
 * statistics and success stories related to `SkillBridge`. PrimeReact's `Divider` and `Carousel`
 * are used for layout and interactive display. Images pulled from the local assets. 
 */
const CardSection = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Over 85% of students who use SkillBridge find a job or internship related to their skills within 6 months.', background: gallery1 },
    { id: 2, name: '95% of students reported a high level of satisfaction with SkillBridge’s skill-based job matching system.', background: gallery2 },
    { id: 3, name: 'More than 500 students have volunteered over 10,000 hours to local charities through SkillBridge’s volunteer program.', background: volunteer1 },
    { id: 4, name: '70% of students who participate in SkillBridge’s volunteer opportunities report enhanced professional skills that help them in their career search.', background: volunteer2 }
  ]);

  const responsiveOptions = [
      {
          breakpoint: '1400px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '1199px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '767px',
          numVisible: 1,
          numScroll: 1
      },
      {
          breakpoint: '575px',
          numVisible: 1,
          numScroll: 1
      }
  ];

  const productTemplate = (product) => {
    return (
        <div
            className="custom-card"
            style={{
                backgroundImage: `url(${product.background || 'https://via.placeholder.com/600x400'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '10px',
                height: '350px',
                minHeight: '30vh',
                padding: '20px',
                color: '#fff',
                textAlign: 'center',
                margin: '20px',
                boxSizing: 'border-box',
            }}
        >
            <div
                className="glass-effect"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: '10px',
                    padding: '1px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#fff'
                }}
            >
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' , color: 'white', textshadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'}}>{product.name}</h3>
            </div>
        </div>
    );
};


  return (
    <section className="index-2">
      <div className="page-content-wrapper-primary">
          <Divider />
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

By targeting student job postings, SkillBridge offers unique opportunities that are often missed by broader job search platforms. Our specialized approach helps employers find talented students with fresh ideas, while students access exclusive job listings, internships, and entry-level positions suited to their skills and ambitions. SkillBridge simplifies the job search process, creating meaningful connections between employers and the next generation of professionals.                </p>
              </div>
              <div className='card bg-wheat'>
                <h1>3.</h1>
                <h2>Support and Resources</h2>
                <p>  
                At SkillBridge, we support students with resources to enhance their job search. From resume-building tips and interview preparation to valuable career advice, we provide the guidance needed to confidently enter the workforce and achieve career goals.                </p>
              </div>
            </div>

            <div className='sec1-column3-wrap'>
              <img src={logo} alt="Logo" />
            </div>
          </div>
          <Divider />

          <div className='sec2-content-wrapper'>
            <div className="custom-carousel">
              <Carousel
                  value={products}
                  numVisible={2}
                  numScroll={1}
                  responsiveOptions={responsiveOptions}
                  itemTemplate={productTemplate}
              />
            </div>
          </div>
      </div>
    </section>
  );
};

export default CardSection;
