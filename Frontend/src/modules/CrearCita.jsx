import React, { useState } from 'react';
import api from '../api/axios';

export default function CrearCita({ setNotificación }) {
  const [form, setForm] = useState({ descripcion: '', cupos_totales: 5, fecha: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/citas', form);
      setNotificación({ tipo: 'exito', texto: 'Cita médica / espacio creado exitosamente.' });
      setForm({ descripcion: '', cupos_totales: 5, fecha: '' });
    } catch (err) {
      setNotificación({ tipo: 'error', texto: err.response?.data?.error || 'Error al crear la cita' });
    }
  };

  return (
    <section style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px' }}>
      <h3>2. Crear Nueva Cita (Rol Prestador)</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Descripción del Servicio / Cita" 
          value={form.descripcion} 
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })} 
          required 
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number" 
            placeholder="Cupos Totales" 
            value={form.cupos_totales} 
            onChange={(e) => setForm({ ...form, cupos_totales: e.target.value })} 
            required 
          />
          <input 
            type="date" 
            value={form.fecha} 
            onChange={(e) => setForm({ ...form, fecha: e.target.value })} 
            required 
          />
        </div>
        <button type="submit">Publicar Cita</button>
      </form>
    </section>
  );
}