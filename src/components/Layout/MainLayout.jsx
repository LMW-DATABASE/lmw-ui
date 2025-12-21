import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children, showHeader = true, showFooter = true, headerProps = {} }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showHeader && <Header {...headerProps} />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;