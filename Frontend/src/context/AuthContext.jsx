import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();



export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.rol;

}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem('usuario')) || null
  );

  const loginContext = (dataToken, dataUsuario) => {
    localStorage.setItem('token', dataToken);
    localStorage.setItem('usuario', JSON.stringify(dataUsuario));
    setToken(dataToken);
    setUsuario(dataUsuario);
  };

  

  const logoutContext = () => {
    localStorage.clear();
    setToken('');
    setUsuario(null);
  };
  

  return (
    <AuthContext.Provider value={{ token, usuario, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);