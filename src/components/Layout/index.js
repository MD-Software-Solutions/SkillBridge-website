import './index.scss';
import React, { useContext } from 'react';
import { ThemeContext } from '../../App';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
import Interior from '../Interior';

const Layout = () => {
  const theme = useContext(ThemeContext); 

  return (
    <div className={`layout ${theme}`}>
      <div className='App'>
        <div>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
