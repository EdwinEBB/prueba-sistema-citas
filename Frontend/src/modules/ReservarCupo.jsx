import React, { useState } from 'react';
import api from '../api/axios';

export default function ReservarCupo({ setNotificación }) {
  const [codCita, setCodCita] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cupos/asignar', { cod_cita: codCita });
      setNotificación({ tipo: 'exito', texto: `Cupo reservado con éxito en la cita #${codCita}` });
      setCodCita('');
    } catch (err) {
      setNotificación({ tipo: 'error', texto: err.response?.data?.error || 'Error al reservar el cupo' });
    }
  };

  return (
    <section style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px' }}>
      <h3>4. Reservar Cupo (Rol Solicitante)</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="number" 
          placeholder="ID Cita" 
          value={codCita} 
          onChange={(e) => setCodCita(e.target.value)} 
          required 
        />
        <button type="submit">Confirmar Reserva</button>
      </form>
    </section>
  );
}