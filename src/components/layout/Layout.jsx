import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { currentUser, userType } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {currentUser && <Sidebar userType={userType} />}
        <main className={`flex-1 ${currentUser ? 'ml-64 pt-4' : 'pt-0'}`}>
          <div className={currentUser ? 'p-6' : ''}>
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;