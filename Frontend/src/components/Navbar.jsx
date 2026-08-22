import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, logoutContext } = useAuth();

  return (
    <header style={{
      display: 'flex',
      justify: 'space-between',
      alignItems: 'center',
      padding: '12px 20px',
      backgroundColor: '#1e293b',
      color: '#fff',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Sistema de Gestión de Citas</h2>
      <div>
        <span style={{ marginRight: '15px' }}>
          Usuario: <strong>{usuario?.usuario}</strong> (ID: {usuario?.cod})
        </span>
        <button 
          onClick={logoutContext}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}