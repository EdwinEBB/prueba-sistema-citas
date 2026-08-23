import React, { useState } from 'react';
import api from '../api/axios';

export default function AsignarRol({ setNotificación, defaultUserId, onRolCambiado }) {
  const [form, setForm] = useState({ cod_usuario: defaultUserId || '', cod_rol: '1' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/asignar-perfil', form);
      
      // Sobrescribir en localStorage con la nueva sesión actualizada
      if (res.data.token && res.data.usuario) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      }

      setNotificación({ tipo: 'exito', texto: `Rol #${form.cod_rol} asignado correctamente` });

      if (onRolCambiado) {
        onRolCambiado(form.cod_rol);
      }
    } catch (err) {
      setNotificación({ tipo: 'error', texto: err.response?.data?.error || 'Error al asignar rol' });
    }
  };

  return (
    <section style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px' }}>
      <h3>1. Asignar Rol / Perfil</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input 
          type="number" 
          placeholder="ID Usuario" 
          value={form.cod_usuario} 
          onChange={(e) => setForm({ ...form, cod_usuario: e.target.value })} 
          required 
          style={{ width: '100px' }}
        />
        <select value={form.cod_rol} onChange={(e) => setForm({ ...form, cod_rol: e.target.value })}>
          <option value="1">Solicitante (Rol 1)</option>
          <option value="2">Prestador (Rol 2)</option>
        </select>
        <button type="submit">Asignar Perfil</button>
      </form>
    </section>
  );
}