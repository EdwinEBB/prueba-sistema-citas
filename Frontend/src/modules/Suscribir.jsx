import React, { useState } from 'react';
import api from '../api/axios';

export default function Suscribir({ setNotificación }) {
  const [codPrestador, setCodPrestador] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cupos/suscribir', { cod_usuario_prestador: codPrestador });
      setNotificación({ tipo: 'exito', texto: `Te has suscrito correctamente al prestador #${codPrestador}` });
      setCodPrestador('');
    } catch (err) {
      setNotificación({ tipo: 'error', texto: err.response?.data?.error || 'Error al suscribirse' });
    }
  };

  return (
    <section style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px' }}>
      <h3>3. Suscribirse a un Prestador (Rol Solicitante)</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="number" 
          placeholder="ID del Prestador" 
          value={codPrestador} 
          onChange={(e) => setCodPrestador(e.target.value)} 
          required 
        />
        <button type="submit">Suscribirse</button>
      </form>
    </section>
  );
}