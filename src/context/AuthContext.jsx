// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  // Inicializar estado desde localStorage si existe
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('bobSubastasUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem('bobSubastasUserType') || null;
  });

  // Guardar en localStorage cuando cambie el usuario
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bobSubastasUser', JSON.stringify(currentUser));
      localStorage.setItem('bobSubastasUserType', userType);
    } else {
      localStorage.removeItem('bobSubastasUser');
      localStorage.removeItem('bobSubastasUserType');
    }
  }, [currentUser, userType]);

  const login = (userData) => {
    setCurrentUser(userData);
    setUserType(userData.role);
  };

  const switchUserType = (type) => {
    setUserType(type);
    if (type === 'cliente') {
      setCurrentUser(USUARIOS_DEMO[0]);
    } else if (type === 'admin') {
      setCurrentUser(USUARIOS_DEMO[1]);
    } else if (type === 'xander') {
      setCurrentUser(USUARIOS_DEMO[2] || {
        id: 3,
        nombre: 'Xander Demo',
        email: 'xander@demo.com',
        tipo_usuario: 'XANDER',
        saldo: 15000
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUserType(null);
    localStorage.removeItem('bobSubastasUser');
    localStorage.removeItem('bobSubastasUserType');
  };

  const value = {
    currentUser,
    userType,
    login,
    switchUserType,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: userType === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};