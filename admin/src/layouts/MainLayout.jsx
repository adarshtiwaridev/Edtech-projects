import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbaar from '../Components/Navbaar';
import Footer from '../Components/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Navbaar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
