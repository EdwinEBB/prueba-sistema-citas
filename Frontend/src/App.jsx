import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

import AsignarRol from './modules/AsignarRol';
import CrearCita from './modules/CrearCita';
import Consultas from './modules/Consultas';

export default function App() {
  const { token, usuario } = useAuth();
  const [tabAuth, setTabAuth] = useState('login');
  const [notificación, setNotificación] = useState(null);

  const [rolActivo, setRolActivo] = useState(
    usuario?.cod_rol || usuario?.rol || null
  );

  useEffect(() => {
    if (usuario) {
      setRolActivo(usuario.cod_rol || usuario.rol || null);
    }
  }, [usuario]);

  const tieneRol = rolActivo !== null && rolActivo !== undefined && rolActivo !== '';
  const esPrestador = String(rolActivo).toLowerCase() === '2' || String(rolActivo).toLowerCase() === 'prestador';

  const handleRolAsignado = (nuevoRol) => {
    setRolActivo(nuevoRol);
    window.location.reload(); // Recarga para actualizar token/sesión con el nuevo rol
  };

  const getEstiloAlerta = (tipo) => {
    switch (tipo) {
      case 'exito': return { bg: '#dcfce7', border: '#22c55e', color: '#15803d' };
      case 'error': return { bg: '#fee2e2', border: '#ef4444', color: '#b91c1c' };
      default: return { bg: '#e0f2fe', border: '#0284c7', color: '#0369a1' };
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      {token && <Navbar />}

      {notificación && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          backgroundColor: getEstiloAlerta(notificación.tipo).bg,
          borderLeft: `5px solid ${getEstiloAlerta(notificación.tipo).border}`,
          color: getEstiloAlerta(notificación.tipo).color,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{notificación.texto}</span>
          <button 
            onClick={() => setNotificación(null)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {!token ? (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => setTabAuth('login')} style={{ flex: 1, fontWeight: tabAuth === 'login' ? 'bold' : 'normal' }}>
              Iniciar Sesión
            </button>
            <button onClick={() => setTabAuth('register')} style={{ flex: 1, fontWeight: tabAuth === 'register' ? 'bold' : 'normal' }}>
              Registrarse
            </button>
          </div>

          {tabAuth === 'login' ? (
            <LoginForm setNotificación={setNotificación} />
          ) : (
            <RegisterForm setNotificación={setNotificación} onSuccess={() => setTabAuth('login')} />
          )}
        </div>
      ) : (
        <main style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Si no tiene rol, le muestra el panel para asignar */}
          {!tieneRol ? (
            <AsignarRol 
              setNotificación={setNotificación} 
              defaultUserId={usuario?.cod} 
              onRolCambiado={handleRolAsignado} 
            />
          ) : (
            /* Si ya tiene rol, solo muestra 'CrearCita' si es prestador */
            <>
              {esPrestador && <CrearCita setNotificación={setNotificación} />}
            </>
          )}

          {/* Renderizado único de Consultas */}
          <Consultas setNotificación={setNotificación} key={rolActivo} />
        </main>
      )}
    </div>
  );
}