import './index.scss';
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
import MenubarLanding from '../MenubarLanding';
import { ThemeContext } from '../../App';

const Layout = () => {
  const theme = useContext(ThemeContext); 

  return (
    <div className={`layout ${theme}`}>
      <div className='App'>
        <div className='content'>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
