// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { USUARIOS_DEMO } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Para demo, simulamos usuario logueado
  const [currentUser, setCurrentUser] = useState(USUARIOS_DEMO[0]); // Cliente por defecto
  const [userType, setUserType] = useState('cliente'); // 'cliente' o 'admin'

  const switchUserType = (type) => {
    setUserType(type);
    if (type === 'cliente') {
      setCurrentUser(USUARIOS_DEMO[0]);
    } else {
      setCurrentUser(USUARIOS_DEMO[1]);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUserType(null);
  };

  const value = {
    currentUser,
    userType,
    switchUserType,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.tipo_usuario?.includes('ADMIN')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};