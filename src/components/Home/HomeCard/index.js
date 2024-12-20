import './index.scss';
import { Divider } from 'primereact/divider';
import { Carousel } from 'primereact/carousel';
import logo from '../../../assets/img/logo.png';
import React, { useState } from 'react';

const CardSection = () => {
  const [images] = useState([
    { itemImageSrc: 'https://via.placeholder.com/600x400', caption: 'Placeholder Image 1' },
    { itemImageSrc: 'https://via.placeholder.com/600x400', caption: 'Placeholder Image 2' },
    { itemImageSrc: 'https://via.placeholder.com/600x400', caption: 'Placeholder Image 3' }
  ]);

  const responsiveOptions = [
      {
          breakpoint: '1400px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '1199px',
          numVisible: 3,
          numScroll: 1
      },
      {
          breakpoint: '767px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '575px',
          numVisible: 1,
          numScroll: 1
      }
  ];

  return (
    <section className="index-2">
      <div className="page-content-wrapper-primary">
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

            <div className='sec1-column3-wrap'>
              <img src={logo} alt="Logo" />
            </div>
          </div>
          <Divider />

          <div className='sec2-content-wrapper'>
            <Carousel 
              value={images} 
              responsiveOptions={responsiveOptions} 
              itemTemplate={(item) => (
                <div className="image-carousel-item">
                  <img src={item.itemImageSrc} alt={item.caption} />
                  <p>{item.caption}</p>
                </div>
              )}
            />
          </div>
      </div>
    </section>
  );
};

export default CardSection;
