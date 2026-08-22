import React, { useState } from 'react';
import api from '../api/axios';

export default function RegisterForm({ setNotificación, onSuccess }) {
  const [form, setForm] = useState({ usuario: '', clave: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      setNotificación({ tipo: 'exito', texto: 'Usuario registrado correctamente. Procede a iniciar sesión.' });
      onSuccess();
    } catch (err) {
      setNotificación({ tipo: 'error', texto: err.response?.data?.error || 'Error al registrar usuario' });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h3>Registrar Nuevo Usuario</h3>
      <input 
        type="text" 
        placeholder="Nombre de Usuario" 
        value={form.usuario} 
        onChange={(e) => setForm({ ...form, usuario: e.target.value })} 
        required 
      />
      <input 
        type="password" 
        placeholder="Contraseña" 
        value={form.clave} 
        onChange={(e) => setForm({ ...form, clave: e.target.value })} 
        required 
      />
      <button type="submit">Crear Cuenta</button>
    </form>
  );
}