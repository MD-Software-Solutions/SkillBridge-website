import './index.scss';
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
import { ThemeContext } from '../../App';
import EmbededForm from '../EmbededForm';

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
